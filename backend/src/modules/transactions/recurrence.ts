export type RecurrenceInterval = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export const parseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const result = new Date(value);
  if (Number.isNaN(result.getTime())) throw new Error('Invalid transaction date');
  return result;
};

export const nextOccurrence = (date: Date, interval: string, anchorDay = date.getUTCDate()): Date => {
  const result = new Date(date);
  if (interval === 'WEEKLY') {
    result.setUTCDate(result.getUTCDate() + 7);
    return result;
  }
  if (interval !== 'MONTHLY' && interval !== 'YEARLY') {
    throw new Error('Invalid recurrence_interval');
  }
  const targetMonth = result.getUTCMonth() + (interval === 'MONTHLY' ? 1 : 12);
  result.setUTCDate(1);
  result.setUTCMonth(targetMonth);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(anchorDay, lastDay));
  return result;
};

export const endOfToday = () => {
  const today = new Date();
  today.setUTCHours(23, 59, 59, 999);
  return today;
};

export const scheduleOccurrences = <T extends object>(
  data: T,
  recurrenceId: string,
  startDate: Date,
  interval: RecurrenceInterval,
  endDate: Date | null,
  throughDate: Date,
) => {
  const occurrences: Array<Partial<T> & Partial<{
    recurrence_id: string;
    date: string;
    recurrence_interval: RecurrenceInterval;
    end_date: string | null;
    next_due_date: string | null;
  }>> = [];
  let due = startDate;
  while (due <= throughDate && (!endDate || due <= endDate)) {
    occurrences.push({
      ...data,
      recurrence_id: recurrenceId,
      date: due.toISOString(),
      recurrence_interval: interval,
      end_date: endDate?.toISOString() ?? null,
      next_due_date: null,
    });
    due = nextOccurrence(due, interval, startDate.getUTCDate());
  }
  const nextDue = occurrences.length ? due : nextOccurrence(startDate, interval, startDate.getUTCDate());
  const boundedNextDue = !endDate || nextDue <= endDate ? nextDue : null;
  if (occurrences.length) occurrences[occurrences.length - 1].next_due_date = boundedNextDue?.toISOString() ?? null;
  return { occurrences, nextDue: boundedNextDue };
};
