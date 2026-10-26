export type TraceStep = {
  /** The line of the pipeline as it appears in the code. */
  code: string;
  /** The members of the error type once the step has run, as they are written in the type. */
  errors: readonly string[];
};

/** How a member of the error type changed at a step. */
export type ErrorChange = 'kept' | 'added' | 'removed';

export type ErrorMember = { name: string; change: ErrorChange };

/** The members of the error type at a step, with the ones it removed still in place and the ones it added at the end. */
export const membersAt = (steps: readonly TraceStep[], index: number): ErrorMember[] => {
  const before = steps[index - 1]?.errors ?? [];
  const after = steps[index]?.errors ?? [];
  return [
    ...before.map((name): ErrorMember => ({ name, change: after.includes(name) ? 'kept' : 'removed' })),
    ...after.filter((name) => !before.includes(name)).map((name): ErrorMember => ({ name, change: 'added' })),
  ];
};

/** The error type as TypeScript writes it. */
export const formatErrors = (errors: readonly string[]): string => (errors.length === 0 ? 'never' : errors.join(' | '));

/** Named after the examples they trace, so that a change to an example leads to its trace. */
export const TRACES = {
  sequentialSteps: [
    { code: 'Result.succeed(\'u123\'),', errors: [] },
    { code: 'Result.andThen(findUserById),', errors: ['\'NotFound\''] },
    { code: 'Result.andThen(validateEmail),', errors: ['\'NotFound\'', '\'InvalidEmail\''] },
    { code: 'Result.andThen(saveUser),', errors: ['\'NotFound\'', '\'InvalidEmail\'', '\'SaveFailed\''] },
  ],
  recoveringFromSpecificErrors: [
    { code: 'findUser(\'u123\'),', errors: ['\'NotFound\'', '\'Timeout\''] },
    { code: 'Result.orElse((error) => { ... }),', errors: ['\'Timeout\''] },
  ],
} satisfies Record<string, readonly TraceStep[]>;

export type TraceName = keyof typeof TRACES;
