# Result vs throw

You may have encountered opinions like: "Since JavaScript can throw errors anywhere and it's impossible to manage everything with Result, there's no point in introducing Result at all."

However, we don't necessarily agree with this perspective. The key insight is that **Result should only handle "anticipated errors"** - there's no need to wrap every possible error in a Result.

## The Philosophy: Anticipated vs Unexpected Errors

The distinction between what should be handled with Result versus what should be allowed to throw lies in understanding the nature of the error:

### Anticipated Errors (Use Result)

These are errors that are part of your application's business logic and should be handled explicitly:

```ts
// @noErrors
class PostNotFoundError extends Error {}
class PostPermissionError extends Error {}
class PostAlreadyDeletedError extends Error {}
import { Result } from '@praha/byethrow';
// ---cut-before---
// Example of a post deletion function
type PostDeleteError = (
  | PostNotFoundError
  | PostPermissionError
  | PostAlreadyDeletedError
);

const deletePost = async (postId: string): Result.ResultAsync<void, PostDeleteError> => {
  // Business logic errors that should be handled by the application
}
```

### Unexpected Errors (Let them throw)

These are infrastructure-level or truly unexpected errors:

- Database connection failures
- Network timeouts
- Out of memory errors
- Unknown exceptions

```ts
// @noErrors
interface Database {}
// ---cut-before---
// Example of an infrastructure-level function
const connectToDatabase = async (): Promise<Database> => {
  // This function may throw errors like connection failures, timeouts, etc.
};
```

These should be allowed to throw and be caught by infrastructure-level error handling (like Sentry).

## When You Need Better Stack Traces: Using `Result.try`

However, when you want more detailed stack traces for debugging purposes, we recommend using `Result.try` to wrap unexpected errors with custom error classes. This approach gives you application-level stack traces instead of library-level ones.

### Defining Custom Error Classes

First, define a custom error class for unexpected errors:

:::tip
For more details about `@praha/error-factory`, see the [Custom Error](./custom-error.mdx#recommended-using-prahaerror-factory) page.
:::

```ts
import { ErrorFactory } from '@praha/error-factory';

class UnexpectedError extends ErrorFactory({
  name: 'UnexpectedError',
  message: 'An unexpected error occurred',
}) {}
```

### Using Result.try for Better Error Handling

```ts
import { ErrorFactory } from '@praha/error-factory';

class UnexpectedError extends ErrorFactory({
  name: 'UnexpectedError',
  message: 'An unexpected error occurred',
}) {}
const performDatabaseOperation = async (id: string): Promise<string> => Promise.resolve('data');
// ---cut-before---
import { Result } from '@praha/byethrow';

// Wrap potentially throwing operations
const safeDatabaseOperation = Result.try({
  try: (id: string) => {
    // This might throw database query errors, network errors, etc.
    return performDatabaseOperation(id);
  },
  catch: (error) => new UnexpectedError({ cause: error }),
});

// Usage
const result = await safeDatabaseOperation('123');
if (Result.isFailure(result)) {
  // You now have a clean UnexpectedError with your application's stack trace
  // instead of deep library stack traces
  console.error(result.error.stack);
  // Original error is still accessible
  console.error(result.error.cause);
}
```

### Benefits of This Approach

1. **Clean Stack Traces**: You get stack traces that point to your application code, not deep into library internals
2. **Error Context**: You can add meaningful context to errors while preserving the original error
3. **Consistent Error Handling**: All errors, whether anticipated or unexpected, can be handled through the Result interface when needed
4. **Debugging**: The original error is still accessible through the `cause` property for debugging purposes

## Conclusion

The goal isn't to eliminate all throws in favor of Result, but to use each approach where it's most appropriate. Result excels at handling expected, business-level errors that require explicit handling, while throw remains the right choice for unexpected system errors that should be handled at the infrastructure level.

This hybrid approach gives you the benefits of explicit error handling where it matters most, without the burden of wrapping every possible error in your application.
