import type { Track } from '../result-flow/flows';

/** How the operations are passed: as Results that are already running, or as values and a mapper that starts them. */
export type TimelineMode = 'direct' | 'mapper';

export type Aggregator = 'sequence' | 'collect';

export const AGGREGATORS: readonly Aggregator[] = ['sequence', 'collect'];

export type Operation = {
  label: string;
  /** How long the operation takes, in units of the time axis. */
  duration: number;
};

export const OPERATIONS: Readonly<Record<TimelineMode, readonly Operation[]>> = {
  direct: [
    { label: 'task1', duration: 3 },
    { label: 'task2', duration: 2 },
    { label: 'task3', duration: 4 },
  ],
  mapper: [
    { label: 'fn(1)', duration: 3 },
    { label: 'fn(2)', duration: 2 },
    { label: 'fn(3)', duration: 4 },
  ],
};

/** The operation that fails until the reader picks another: the second, so that both functions show how they differ. */
export const DEFAULT_FAILING = 1;

export type Bar = {
  start: number;
  end: number;
  outcome: Track;
  /**
   * `used` when the function waits for the result, `ignored` when the operation keeps
   * running after the function has returned, and `notStarted` when it is never run.
   */
  status: 'used' | 'ignored' | 'notStarted';
};

export type Schedule = {
  bars: readonly Bar[];
  returnsAt: number;
  output: { track: Track; value: string };
};

const VALUES = ['a', 'b', 'c'];

/** When each operation runs and when the function returns, if the operation at `failing` fails. */
export const scheduleOf = (aggregator: Aggregator, mode: TimelineMode, failing: number | null): Schedule => {
  const operations = OPERATIONS[mode];
  const outcomeOf = (index: number): Track => (index === failing ? 'failure' : 'success');
  const values = `[${VALUES.slice(0, operations.length).join(', ')}]`;
  const error = `e${(failing ?? 0) + 1}`;

  if (aggregator === 'collect') {
    // Every operation runs at once, and collect waits for all of them to gather every error.
    return {
      bars: operations.map(({ duration }, index) => ({ start: 0, end: duration, outcome: outcomeOf(index), status: 'used' })),
      returnsAt: Math.max(...operations.map(({ duration }) => duration)),
      output: failing === null ? { track: 'success', value: values } : { track: 'failure', value: `[${error}]` },
    };
  }

  const output = failing === null ? { track: 'success', value: values } as const : { track: 'failure', value: error } as const;

  if (mode === 'mapper') {
    // The mapper starts each operation once the previous one has succeeded, and none after a failure.
    let time = 0;
    const bars = operations.map(({ duration }, index): Bar => {
      if (failing !== null && failing < index) return { start: time, end: time, outcome: 'success', status: 'notStarted' };
      const bar: Bar = { start: time, end: time + duration, outcome: outcomeOf(index), status: 'used' };
      time = bar.end;
      return bar;
    });
    return { bars, returnsAt: time, output };
  }

  // Every operation is already running, and sequence waits for them in order until the first failure.
  const bars = operations.map(({ duration }, index): Bar => ({
    start: 0,
    end: duration,
    outcome: outcomeOf(index),
    status: failing !== null && failing < index ? 'ignored' : 'used',
  }));
  return { bars, returnsAt: Math.max(...bars.filter(({ status }) => status === 'used').map(({ end }) => end)), output };
};

/** The length of the time axis, long enough for every schedule of the mode. */
export const axisOf = (mode: TimelineMode): number => {
  const failings = [null, ...OPERATIONS[mode].map((_, index) => index)];
  return Math.max(...AGGREGATORS.flatMap((aggregator) => failings.map((failing) => {
    const { bars, returnsAt } = scheduleOf(aggregator, mode, failing);
    return Math.max(returnsAt, ...bars.map(({ end }) => end));
  })));
};
