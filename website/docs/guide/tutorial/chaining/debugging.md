---
description: Learn how to debug Result pipelines using inspect and inspectError functions in @praha/byethrow to peek at values.
---

# Debugging

When debugging complex pipelines, you need to see what's happening at each step. The `inspect` and `inspectError` functions let you peek at values without affecting the flow.

## `inspect` - Peek at Success Values

`inspect` runs a side effect function on success values but always returns the original result unchanged:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(42),
  Result.inspect((value) => console.log('Value:', value)),
  Result.map((x) => x * 2),
);
// Console: "Value: 42"
// { type: 'Success', value: 84 }
```

On failure, `inspect` does nothing:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('error'),
  Result.inspect((value) => console.log('Value:', value)), // Not called
);
// { type: 'Failure', error: 'error' }
```

## `inspectError` - Peek at Error Values

`inspectError` is the counterpart for failure values:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.fail('Something went wrong'),
  Result.inspectError((error) => console.error('Error:', error)),
);
// Console: "Error: Something went wrong"
// { type: 'Failure', error: 'Something went wrong' }
```

On success, `inspectError` does nothing:

```ts
import { Result } from '@praha/byethrow';

const result = Result.pipe(
  Result.succeed(42),
  Result.inspectError((error) => console.error('Error:', error)), // Not called
);
// { type: 'Success', value: 42 }
```

## Example: Trace the Pipeline

```ts
type Input = { data: string };
type Transformed = { transformedData: string };
type Saved = { id: string };
declare const validate: (input: Input) => Result.Result<Input, 'ValidateFailed'>;
declare const transform: (input: Input) => Result.Result<Transformed, 'TransformFailed'>;
declare const save: (input: Transformed) => Result.Result<Saved, 'SaveFailed'>;
// ---cut-before---
import { Result } from '@praha/byethrow';

const processData = (input: Input) => {
  return Result.pipe(
    Result.succeed(input),
    Result.inspect((value) => console.log('Input:', value)),
    Result.andThrough(validate),
    Result.inspect((value) => console.log('After validation:', value)),
    Result.andThen(transform),
    Result.inspect((value) => console.log('After transform:', value)),
    Result.andThen(save),
    Result.inspect((value) => console.log('After save:', value)),
    Result.inspectError((error) => console.error('Pipeline failed:', error)),
  );
};
```

## References

| Function                                                       | Purpose                                          |
|----------------------------------------------------------------|--------------------------------------------------|
| [inspect(fn)](../../../api/functions/Result.inspect)           | Run a side effect on the success value           |
| [inspectError(fn)](../../../api/functions/Result.inspectError) | Run a side effect on the error value             |
