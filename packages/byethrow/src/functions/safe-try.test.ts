import { safeTry } from "./safe-try";
import { fail } from './fail';
import { succeed } from './succeed';
import { describe, it } from 'vitest';
import { isFailure } from "./is-failure";
import { random } from "effect/Hash";

describe('safeTry', () => {
  it('should return all the failures', () => {
    function generateRandomNumber() {
      const randomNumber = Math.floor(Math.random() * 100)
      if (randomNumber > 80) {
        return fail('RandomError' as const)
      }

      return succeed(randomNumber)
    }

    const divide = (a: number, b: number) => {
      if (b === 0) {
        return fail('DivideByZeroError' as const)
      }
      return succeed(a / b)
    }


    const safePrompt = (_message: string) => {
      const value = '0' as string | null // prompt(message) simulate fake user prompt
      if (value === null) {
        return fail('PromptCancelledError' as const)
      }
      return succeed(value)
    }

    const res = safeTry(function*(_) {
      const randomNumber = yield* _(generateRandomNumber())
      console.log(`got random number: ${randomNumber}`)

      const value = parseInt(yield* _(safePrompt('Enter a number')))

      const result = yield* _(divide(randomNumber, value))

      return succeed(result)
    })

    if (isFailure(res)) {
      switch (res.error) {
        case 'RandomError': {
          console.log('something went wrong')
          break
        }
        case 'DivideByZeroError': {
          console.log('cant divide by zero')
          break
        }
        case 'PromptCancelledError': {
          console.log('cancelled by user')
          break
        }
      }
    } else {
      console.log(`result is ${res.value}`)
    }
  })
})
