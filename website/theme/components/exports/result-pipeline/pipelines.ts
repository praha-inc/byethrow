import type { Track } from '../result-flow/flows';

export type PipelineStep = {
  /** The line of the pipeline as it appears in the code. */
  code: string;
  /** The track the step runs on, or `start` for the Result the pipeline begins with. */
  runsOn: Track | 'start';
  /** The tracks the step can leave on, the default first. When there are two, the reader picks one. */
  outcomes: readonly [Track] | readonly [Track, Track];
};

/** How the Result went through a step. */
export type StepTrace = {
  /** The track the Result arrived on. */
  input: Track;
  runs: boolean;
  /** The track the Result left on. */
  output: Track;
};

/** Follows the Result down the pipeline, with `choices` overriding the default outcome of each step. */
export const tracePipeline = (steps: readonly PipelineStep[], choices: readonly (Track | undefined)[]): StepTrace[] => {
  let track: Track = 'success';
  return steps.map((step, index) => {
    const runs = step.runsOn === 'start' || step.runsOn === track;
    const output = runs ? choices[index] ?? step.outcomes[0] : track;
    const trace = { input: step.runsOn === 'start' ? output : track, runs, output };
    track = output;
    return trace;
  });
};

export const PIPELINES = {
  welcome: [
    { code: 'Result.succeed(id),', runsOn: 'start', outcomes: ['success'] },
    { code: 'Result.andThen(validateId),', runsOn: 'success', outcomes: ['success', 'failure'] },
    { code: 'Result.andThen(findUser),', runsOn: 'success', outcomes: ['success', 'failure'] },
    { code: 'Result.map(toWelcomeMessage),', runsOn: 'success', outcomes: ['success'] },
  ],
  shortCircuit: [
    { code: 'Result.succeed(id),', runsOn: 'start', outcomes: ['success'] },
    { code: 'Result.andThen(validateId),', runsOn: 'success', outcomes: ['success', 'failure'] },
    { code: 'Result.andThen(findUser),', runsOn: 'success', outcomes: ['success', 'failure'] },
    { code: 'Result.map(toWelcomeMessage),', runsOn: 'success', outcomes: ['success'] },
    { code: 'Result.inspectError(console.error),', runsOn: 'failure', outcomes: ['failure'] },
  ],
  fallback: [
    { code: 'fetchUserFromCache(id),', runsOn: 'start', outcomes: ['failure', 'success'] },
    { code: 'Result.orElse(() => fetchUserFromDb(id)),', runsOn: 'failure', outcomes: ['success', 'failure'] },
    { code: 'Result.andThen(validateUser),', runsOn: 'success', outcomes: ['success', 'failure'] },
  ],
} satisfies Record<string, readonly PipelineStep[]>;

export type PipelineName = keyof typeof PIPELINES;
