---
description: Deciding which errors belong in a Result and which should be thrown — anticipated business errors versus unexpected infrastructure errors — and how to convert between the two at the boundaries.
---

# Result vs throw

You may have heard the argument: "JavaScript can throw anywhere, and it's impossible to manage every error with `Result`, so there's no point in using `Result` at all."

We disagree. The key is that **a `Result` only needs to represent anticipated errors**.
There is no need to wrap every possible error in a `Result`.

## Anticipated vs Unexpected Errors

Whether an error belongs in a `Result` or should be thrown depends on its nature.

### Anticipated Errors: Use `Result`

Anticipated errors are part of your application's business logic.
They are expected to happen during normal operation, and the caller can respond to them meaningfully, for example by showing a message to the user or returning a `404` response:

- The requested post does not exist
- The user doesn't have permission to perform the action
- The submitted form contains invalid values

Represent these errors in the return type so that callers are forced to handle them:

```ts
// @noErrors
class PostNotFoundError extends Error {}
class PostPermissionError extends Error {}
class PostAlreadyDeletedError extends Error {}
import { Result } from '@praha/byethrow';
// ---cut-before---
type PostDeleteError = (
  | PostNotFoundError
  | PostPermissionError
  | PostAlreadyDeletedError
);

const deletePost = async (postId: string): Result.ResultAsync<void, PostDeleteError> => {
  // Returns a Failure for each business rule violation
}
```

### Unexpected Errors: Let Them Throw

Unexpected errors come from the infrastructure or from bugs.
The caller usually can't do anything about them other than report them:

- Database connection failures
- Network timeouts
- Out-of-memory errors
- Programming errors, such as reading a property of `undefined`

Let these errors be thrown, and handle them in one place at the top level, such as a framework's error handler or an error monitoring service like Sentry:

```ts
// @noErrors
interface Database {}
// ---cut-before---
// May throw on connection failures, timeouts, and so on
const connectToDatabase = async (): Promise<Database> => {
  // ...
};
```

:::tip
When in doubt, ask yourself: **"Will the caller handle this error differently from any other error?"**
If the answer is yes, it is an anticipated error and belongs in a `Result`.
:::

## Converting Between the Two

In practice, the two kinds of errors meet at the boundaries of your code:

- **From throw to `Result`**: When a library signals an anticipated failure by throwing, such as `JSON.parse` on user input, wrap it with [`Result.fn` or `Result.try`](../tutorial/basics/wrapping-functions).
- **From `Result` to throw**: At the entry point of your application, handle the errors you expect and let [`Result.unwrap`](../tutorial/resolving/unwrapping) throw the rest, so that your error monitoring can pick them up.

## Wrapping Unexpected Errors for Better Stack Traces

Sometimes the stack trace of an unexpected error isn't helpful, because it points deep into a library's internals.
In that case, you can wrap the operation with `Result.fn` and convert any thrown error into a single `UnexpectedError` class.

First, define the error class:

:::tip
For more details about `@praha/error-factory`, see [Custom Error](./custom-error).
:::

```ts
import { ErrorFactory } from '@praha/error-factory';

class UnexpectedError extends ErrorFactory({
  name: 'UnexpectedError',
  message: 'An unexpected error occurred',
}) {}
```

Then wrap the operation, keeping the original error as `cause`:

```ts
import { ErrorFactory } from '@praha/error-factory';

class UnexpectedError extends ErrorFactory({
  name: 'UnexpectedError',
  message: 'An unexpected error occurred',
}) {}
const performDatabaseOperation = async (id: string): Promise<string> => Promise.resolve('data');
// ---cut-before---
import { Result } from '@praha/byethrow';

const findRecord = Result.fn({
  try: (id: string) => {
    // May throw query errors, network errors, and so on
    return performDatabaseOperation(id);
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});

const result = await findRecord('123');
if (Result.isFailure(result)) {
  // The stack trace starts in your code, where the error was wrapped
  console.error(result.error.stack);
  // The original error is still available
  console.error(result.error.cause);
}
```

This approach has the following benefits:

1. **Readable stack traces**: The new error is created in your own code, so its stack trace shows where the failure entered your application.
2. **Context**: You can attach information that helps with debugging, such as the arguments of the operation.
3. **Nothing is lost**: The original error remains accessible through the `cause` property.

At the entry point of your application, you can still `unwrap` these errors to rethrow them to your error monitoring.

## Conclusion

The goal is not to replace every `throw` with a `Result`, but to use each where it fits best.
`Result` excels at anticipated, business-level errors that require explicit handling, while `throw` remains the right tool for unexpected errors that should be handled at the infrastructure level.

This combination gives you explicit error handling where it matters most, without the burden of wrapping every possible error in your application.
