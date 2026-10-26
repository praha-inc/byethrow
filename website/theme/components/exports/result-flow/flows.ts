export type Track = 'success' | 'failure';

/**
 * A line where values enter or leave the diagram: one of the two tracks of a Result,
 * or, outside the Result, a plain value, a value returned by a function, or a throw.
 */
export type Lane = Track | 'value' | 'returned' | 'thrown';

/** What a lane carries, such as `a` in `Success(a)`. */
export type FlowValue = {
  track: Lane;
  value: string;
  /** A shorter label for the moving dot, when `value` is too long to fit. */
  dot?: string | undefined;
};

export type FlowStep
  = { kind: 'skipped' | 'ignored'; call: string }
    | { kind: 'returns'; call: string; value: string }
    | { kind: 'values' | 'firstError' | 'errors' | 'valid' | 'invalid' }
    | { kind: 'unwrapped' | 'thrown' | 'defaulted'; value: string };

/** One way values can go through the function. */
export type FlowCase = {
  /** One value for most functions, several for the ones that combine Results. */
  inputs: readonly FlowValue[];
  output: FlowValue;
  step: FlowStep;
};

export type Flow = {
  /** How the function is called, shown above the diagram. */
  signature: string;
  /** The label of the box in the middle. */
  box: string;
  /**
   * Which lane the box takes its input from. A box on one lane is skipped by the
   * other, while `both` sits between the lanes and takes every input.
   */
  side: Lane | 'both';
  /** The lanes on the left, from top to bottom. The two tracks unless the function makes a Result from something else. */
  entries?: readonly [Lane] | readonly [Lane, Lane];
  /** The lanes on the right, from top to bottom. The two tracks unless the function takes the contents out of the Result. */
  exits?: readonly [Lane, Lane];
  cases: readonly FlowCase[];
};

const LANE_LABELS: Readonly<Record<Lane, string>> = {
  success: 'Success',
  failure: 'Failure',
  value: 'value',
  returned: 'return',
  thrown: 'throw',
};

export const laneLabel = (lane: Lane): string => LANE_LABELS[lane];

/** e.g. `Success(a)`, `a` outside a Result, or `throw e` */
export const formatValue = ({ track, value }: FlowValue): string => {
  if (track === 'value' || track === 'returned') return value;
  if (track === 'thrown') return `throw ${value}`;
  return `${LANE_LABELS[track]}(${value})`;
};

/** e.g. `Success(a)`, or `[Success(a), Failure(e)]` for several inputs. */
export const formatInputs = (inputs: readonly FlowValue[]): string => {
  const values = inputs.map(formatValue).join(', ');
  return inputs.length === 1 ? values : `[${values}]`;
};

/** A key that tells the cases of one flow apart. */
export const caseKey = ({ inputs, output }: FlowCase): string => [...inputs.map(({ track }) => track), output.value].join('-');

const success = (value: string, dot?: string): FlowValue => ({ track: 'success', value, dot });
const failure = (value: string, dot?: string): FlowValue => ({ track: 'failure', value, dot });
const plain = (value: string): FlowValue => ({ track: 'value', value });
const returned = (value: string): FlowValue => ({ track: 'returned', value });
const thrown = (value: string): FlowValue => ({ track: 'thrown', value });

const returns = (call: string, value: string): FlowStep => ({ kind: 'returns', call, value });

/** The track opposite the box passes straight through without calling `fn`. */
const skip = (track: Track): FlowCase => {
  const value = track === 'success' ? success('a') : failure('e');
  return { inputs: [value], output: value, step: { kind: 'skipped', call: 'fn' } };
};

export const FLOWS = {
  map: {
    signature: 'map(fn)',
    box: 'fn',
    side: 'success',
    cases: [
      { inputs: [success('a')], output: success('b'), step: returns('fn(a)', 'b') },
      skip('failure'),
    ],
  },
  mapError: {
    signature: 'mapError(fn)',
    box: 'fn',
    side: 'failure',
    cases: [
      { inputs: [failure('e')], output: failure('f'), step: returns('fn(e)', 'f') },
      skip('success'),
    ],
  },
  andThen: {
    signature: 'andThen(fn)',
    box: 'fn',
    side: 'success',
    cases: [
      { inputs: [success('a')], output: success('b'), step: returns('fn(a)', 'Success(b)') },
      { inputs: [success('a')], output: failure('f'), step: returns('fn(a)', 'Failure(f)') },
      skip('failure'),
    ],
  },
  orElse: {
    signature: 'orElse(fn)',
    box: 'fn',
    side: 'failure',
    cases: [
      { inputs: [failure('e')], output: success('b'), step: returns('fn(e)', 'Success(b)') },
      { inputs: [failure('e')], output: failure('f'), step: returns('fn(e)', 'Failure(f)') },
      skip('success'),
    ],
  },
  andThrough: {
    signature: 'andThrough(fn)',
    box: 'fn',
    side: 'success',
    cases: [
      { inputs: [success('a')], output: success('a'), step: returns('fn(a)', 'Success(b)') },
      { inputs: [success('a')], output: failure('f'), step: returns('fn(a)', 'Failure(f)') },
      skip('failure'),
    ],
  },
  orThrough: {
    signature: 'orThrough(fn)',
    box: 'fn',
    side: 'failure',
    cases: [
      { inputs: [failure('e')], output: failure('e'), step: returns('fn(e)', 'Success(b)') },
      { inputs: [failure('e')], output: failure('f'), step: returns('fn(e)', 'Failure(f)') },
      skip('success'),
    ],
  },
  inspect: {
    signature: 'inspect(fn)',
    box: 'fn',
    side: 'success',
    cases: [
      { inputs: [success('a')], output: success('a'), step: { kind: 'ignored', call: 'fn(a)' } },
      skip('failure'),
    ],
  },
  inspectError: {
    signature: 'inspectError(fn)',
    box: 'fn',
    side: 'failure',
    cases: [
      { inputs: [failure('e')], output: failure('e'), step: { kind: 'ignored', call: 'fn(e)' } },
      skip('success'),
    ],
  },
  sequence: {
    signature: 'sequence(results)',
    box: 'sequence',
    side: 'both',
    cases: [
      { inputs: [success('a'), success('b'), success('c')], output: success('[a, b, c]', '[a,b,c]'), step: { kind: 'values' } },
      { inputs: [success('a'), failure('e'), failure('f')], output: failure('e'), step: { kind: 'firstError' } },
    ],
  },
  collect: {
    signature: 'collect(results)',
    box: 'collect',
    side: 'both',
    cases: [
      { inputs: [success('a'), success('b'), success('c')], output: success('[a, b, c]', '[a,b,c]'), step: { kind: 'values' } },
      { inputs: [success('a'), failure('e'), failure('f')], output: failure('[e, f]', '[e,f]'), step: { kind: 'errors' } },
    ],
  },
  bind: {
    signature: 'bind(name, fn)',
    box: 'fn',
    side: 'success',
    cases: [
      { inputs: [success('{ a }')], output: success('{ a, b }'), step: returns('fn({ a })', 'Success(b)') },
      { inputs: [success('{ a }')], output: failure('f'), step: returns('fn({ a })', 'Failure(f)') },
      skip('failure'),
    ],
  },
  let: {
    signature: 'let(name, fn)',
    box: 'fn',
    side: 'success',
    cases: [
      { inputs: [success('{ a }')], output: success('{ a, b }'), step: returns('fn({ a })', 'b') },
      skip('failure'),
    ],
  },
  unwrap: {
    signature: 'unwrap(result, defaultValue?)',
    box: 'unwrap',
    side: 'both',
    exits: ['returned', 'thrown'],
    cases: [
      { inputs: [success('a')], output: returned('a'), step: { kind: 'unwrapped', value: 'a' } },
      { inputs: [failure('e')], output: thrown('e'), step: { kind: 'thrown', value: 'e' } },
      { inputs: [failure('e')], output: returned('d'), step: { kind: 'defaulted', value: 'd' } },
    ],
  },
  unwrapError: {
    signature: 'unwrapError(result, defaultValue?)',
    box: 'unwrapError',
    side: 'both',
    exits: ['returned', 'thrown'],
    cases: [
      { inputs: [failure('e')], output: returned('e'), step: { kind: 'unwrapped', value: 'e' } },
      { inputs: [success('a')], output: thrown('a'), step: { kind: 'thrown', value: 'a' } },
      { inputs: [success('a')], output: returned('d'), step: { kind: 'defaulted', value: 'd' } },
    ],
  },
  fn: {
    signature: 'fn({ try, catch })',
    box: 'catch',
    side: 'thrown',
    entries: ['returned', 'thrown'],
    cases: [
      { inputs: [returned('a')], output: success('a'), step: returns('try(...args)', 'a') },
      { inputs: [thrown('x')], output: failure('e'), step: returns('catch(x)', 'e') },
    ],
  },
  try: {
    signature: 'try({ try, catch })',
    box: 'catch',
    side: 'thrown',
    entries: ['returned', 'thrown'],
    cases: [
      { inputs: [returned('a')], output: success('a'), step: returns('try()', 'a') },
      { inputs: [thrown('x')], output: failure('e'), step: returns('catch(x)', 'e') },
    ],
  },
  parse: {
    signature: 'parse(schema, value)',
    box: 'parse',
    side: 'both',
    entries: ['value'],
    cases: [
      { inputs: [plain('a')], output: success('a'), step: { kind: 'valid' } },
      { inputs: [plain('a')], output: failure('issues'), step: { kind: 'invalid' } },
    ],
  },
} satisfies Record<string, Flow>;

export type FlowName = keyof typeof FLOWS;
