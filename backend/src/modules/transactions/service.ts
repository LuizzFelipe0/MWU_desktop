import { randomUUID } from 'crypto';
import { transactionRepository } from './repository';
import { Transaction } from './entity';
import { endOfToday, nextOccurrence, parseDate, RecurrenceInterval, scheduleOccurrences } from './recurrence';

type TransactionInput = Partial<Transaction> & { is_recurring?: boolean };

export const transactionService = {
  getAll: async (userId: string): Promise<Transaction[]> => {
    await transactionService.generateDueOccurrences(userId);
    return transactionRepository.getAll(userId);
  },
  getById: async (id: string, userId: string) => transactionRepository.getById(id, userId),
  create: async (input: TransactionInput) => {
    const { is_recurring = false, ...data } = input;
    if (!is_recurring) {
      return transactionRepository.create({
        ...data,
        recurrence_id: null,
        recurrence_interval: null,
        next_due_date: null,
        end_date: null,
      });
    }

    if (!data.recurrence_interval) throw new Error('recurrence_interval is required');
    const interval = data.recurrence_interval as RecurrenceInterval;
    const startDate = parseDate(data.date);
    if (!startDate) throw new Error('date is required');
    const endDate = parseDate(data.end_date);
    if (endDate && endDate < startDate) throw new Error('end_date must be on or after the start date');

    const recurrenceId = randomUUID();
    const { occurrences, nextDue } = scheduleOccurrences(
      data,
      recurrenceId,
      startDate,
      interval,
      endDate,
      endOfToday(),
    );

    if (!occurrences.length) {
      // A future start date remains a scheduled transaction, even before its due date.
      occurrences.push({
        ...data,
        recurrence_id: recurrenceId,
        recurrence_interval: interval,
        end_date: endDate?.toISOString() ?? null,
        next_due_date: null,
      });
    }

    const requestedNextDue = parseDate(data.next_due_date);
    const savedNextDue = requestedNextDue && requestedNextDue > endOfToday()
      ? requestedNextDue
      : nextDue;
    occurrences[occurrences.length - 1].next_due_date =
      savedNextDue && (!endDate || savedNextDue <= endDate) ? savedNextDue.toISOString() : null;

    const saved = await transactionRepository.createMany(occurrences);
    return saved[0];
  },
  update: async (id: string, userId: string, input: TransactionInput) => {
    const { is_recurring, ...data } = input;
    const updateData: Partial<Transaction> = { ...data };
    if (is_recurring === false) {
      updateData.recurrence_id = null;
      updateData.recurrence_interval = null;
      updateData.next_due_date = null;
      updateData.end_date = null;
    } else if (is_recurring === true) {
      if (!data.recurrence_interval) throw new Error('recurrence_interval is required');
      const existing = await transactionRepository.getById(id, userId);
      if (existing && !existing.recurrence_id) {
        const interval = data.recurrence_interval as RecurrenceInterval;
        const startDate = parseDate(data.date);
        if (!startDate) throw new Error('date is required');
        const endDate = parseDate(data.end_date);
        if (endDate && endDate < startDate) throw new Error('end_date must be on or after the start date');
        const recurrenceId = randomUUID();
        const { occurrences, nextDue } = scheduleOccurrences(
          data,
          recurrenceId,
          startDate,
          interval,
          endDate,
          endOfToday(),
        );
        const requestedNextDue = parseDate(data.next_due_date);
        const futureNextDue = requestedNextDue && requestedNextDue > endOfToday()
          ? requestedNextDue
          : nextDue;

        if (!occurrences.length) {
          updateData.recurrence_id = recurrenceId;
          updateData.recurrence_interval = interval;
          updateData.end_date = endDate?.toISOString() ?? null;
          updateData.next_due_date = futureNextDue?.toISOString() ?? null;
          return transactionRepository.update(id, userId, updateData);
        }

        Object.assign(updateData, occurrences[0]);
        updateData.next_due_date = null;
        await transactionRepository.update(id, userId, updateData);
        const historical = occurrences.slice(1);
        if (historical.length) await transactionRepository.createMany(historical);
        const lastOccurrence = historical.length ? historical[historical.length - 1] : occurrences[0];
        if (historical.length) {
          const savedSeries = await transactionRepository.getRecurring(userId);
          const last = savedSeries.find((transaction) => transaction.recurrence_id === recurrenceId && transaction.date === lastOccurrence.date);
          if (last) {
            const nextDueDate = futureNextDue && (!endDate || futureNextDue <= endDate) ? futureNextDue : null;
            await transactionRepository.update(last.id, userId, { next_due_date: nextDueDate?.toISOString() ?? null });
          }
        } else {
          const nextDueDate = futureNextDue && (!endDate || futureNextDue <= endDate) ? futureNextDue : null;
          await transactionRepository.update(id, userId, { next_due_date: nextDueDate?.toISOString() ?? null });
        }
        return transactionRepository.getById(id, userId);
      }
      updateData.recurrence_id = existing?.recurrence_id ?? randomUUID();
      updateData.next_due_date = data.next_due_date ?? existing?.next_due_date ?? null;
    }
    return transactionRepository.update(id, userId, updateData);
  },
  generateDueOccurrences: async (userId?: string) => {
    const transactions = await transactionRepository.getRecurring(userId);
    const groups = new Map<string, Transaction[]>();
    for (const transaction of transactions) {
      if (!transaction.recurrence_id) continue;
      groups.set(transaction.recurrence_id, [...(groups.get(transaction.recurrence_id) ?? []), transaction]);
    }

    const now = new Date();
    for (const series of groups.values()) {
      const latest = series.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b);
      if (!latest.next_due_date || !latest.recurrence_interval) continue;
      const endDate = parseDate(latest.end_date);
      let due = parseDate(latest.next_due_date);
      const firstOccurrence = series.reduce((a, b) => new Date(a.date) < new Date(b.date) ? a : b);
      const anchorDay = new Date(firstOccurrence.date).getUTCDate();
      if (!due || due > now || (endDate && due > endDate)) continue;

      const additions: Partial<Transaction>[] = [];
      while (due && due <= now && (!endDate || due <= endDate)) {
        additions.push({
          user_id: latest.user_id,
          account_id: latest.account_id,
          category_id: latest.category_id,
          recurrence_id: latest.recurrence_id,
          name: latest.name,
          description: latest.description,
          amount: latest.amount,
          date: due.toISOString(),
          recurrence_interval: latest.recurrence_interval,
          next_due_date: null,
          end_date: latest.end_date,
        });
        due = nextOccurrence(due, latest.recurrence_interval, anchorDay);
      }

      const nextDue = due && (!endDate || due <= endDate) ? due : null;
      if (additions.length) {
        additions[additions.length - 1].next_due_date = nextDue?.toISOString() ?? null;
        await transactionRepository.createMany(additions);
      } else {
        await transactionRepository.update(latest.id, latest.user_id, {
          next_due_date: nextDue?.toISOString() ?? null,
        });
      }
    }
  },
  delete: async (id: string, userId: string) => transactionRepository.delete(id, userId),
};
