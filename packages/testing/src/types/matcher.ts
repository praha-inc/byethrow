export type MatcherState = {
  isNot?: boolean;
  utils: {
    matcherHint: (matcherName: string, received?: string, expected?: string) => string;
    printReceived: (value: unknown) => string;
  };
};

export type MatcherReturnType = {
  pass: boolean;
  message: () => string;
};
