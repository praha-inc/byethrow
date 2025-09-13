import type { Failure, Result } from "../result";

function wrapper<T, E>(value: Result<T, E>) {
  return {
    ...value,
    *[Symbol.iterator]() {
      if (value.type === 'Success') {
        return value.value
      } else {
        yield value
        throw 'unreachable'
      }
    }
  }
}

type Wrapper = typeof wrapper


export function safeTry<T, E>(body: (_: Wrapper) => Generator<Failure<E>, Result<T, E>>): Result<T, E> {
  const n = body(wrapper).next()
  return n.value
}
