import test from 'node:test';
import assert from 'node:assert/strict';
import { scheduleOccurrences } from './recurrence';

test('backfills every weekly occurrence through the requested date', () => {
  const result = scheduleOccurrences(
    { name: 'Rent', amount: 100 },
    'series-1',
    new Date('2026-01-01T12:00:00.000Z'),
    'WEEKLY',
    null,
    new Date('2026-01-20T23:59:59.999Z'),
  );

  assert.deepEqual(result.occurrences.map((item) => item.date), [
    '2026-01-01T12:00:00.000Z',
    '2026-01-08T12:00:00.000Z',
    '2026-01-15T12:00:00.000Z',
  ]);
  assert.equal(result.nextDue?.toISOString(), '2026-01-22T12:00:00.000Z');
});

test('monthly recurrence preserves the original day at month end', () => {
  const result = scheduleOccurrences(
    { name: 'Subscription', amount: 20 },
    'series-2',
    new Date('2026-01-31T12:00:00.000Z'),
    'MONTHLY',
    null,
    new Date('2026-03-31T23:59:59.999Z'),
  );

  assert.deepEqual(result.occurrences.map((item) => item.date), [
    '2026-01-31T12:00:00.000Z',
    '2026-02-28T12:00:00.000Z',
    '2026-03-31T12:00:00.000Z',
  ]);
});

test('end date bounds backfilled dates and prevents another due date', () => {
  const result = scheduleOccurrences(
    { name: 'Annual bill', amount: 500 },
    'series-3',
    new Date('2024-01-01T00:00:00.000Z'),
    'YEARLY',
    new Date('2025-01-01T00:00:00.000Z'),
    new Date('2026-01-01T23:59:59.999Z'),
  );

  assert.equal(result.occurrences.length, 2);
  assert.equal(result.nextDue, null);
});
