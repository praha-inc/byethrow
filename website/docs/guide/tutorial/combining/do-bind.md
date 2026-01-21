# The `do`/`bind` Pattern

When building complex objects where each field depends on successful computation, the `do`/`bind` pattern provides an elegant solution. It lets you accumulate successful results into a growing object.

## What is `do`?

`do` creates a starting point—a `Success` with an empty object:

```ts
import { Result } from '@praha/byethrow';

const start = Result.do();
// { type: 'Success', value: {} }
```

## What is `bind`?

`bind` adds a new field to the accumulated object. It:
1. Receives the current accumulated object
2. Runs a computation that returns a Result
3. If successful, merges the result into the object under the given key
4. If failed, short-circuits and returns the failure

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('name', () => Result.succeed('Alice')),
  Result.bind('age', () => Result.succeed(30)),
);
// { type: 'Success', value: { name: 'Alice', age: 30 } }
```

## Using Previous Values

The power of `bind` is that each step can access previous values:

```ts
declare const fetchUser: (userId: string) => Result.ResultAsync<{ id: string; profileId: string }, 'UserNotFound'>;
declare const fetchProfile: (profileId: string) => Result.ResultAsync<{ bio: string }, 'ProfileNotFound'>;
// ---cut-before---
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('user', () => fetchUser('user-123')),
  Result.bind('profile', ({ user }) => fetchProfile(user.profileId)), // Uses user!
);
```

## Failure Short-Circuits

If any `bind` fails, subsequent binds are skipped:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.do(),
  Result.bind('a', () => Result.succeed(1)),
  Result.bind('b', () => Result.fail('Error!')),  // Fails here
  Result.bind('c', () => Result.succeed(3)),      // Skipped
  Result.bind('d', () => Result.succeed(4)),      // Skipped
);
// { type: 'Failure', error: 'Error!' }
```

## References

| Function                                             | Purpose                         |
|------------------------------------------------------|---------------------------------|
| [do()](../../../api/functions/Result.do)             | Start with `Success<{}>`        |
| [bind(name, fn)](../../../api/functions/Result.bind) | Add field to accumulated object |
