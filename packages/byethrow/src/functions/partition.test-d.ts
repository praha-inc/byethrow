import { describe, expectTypeOf, it } from "vitest";

import { fail } from "./fail";
import { partition } from "./partition";
import { succeed } from "./succeed";

import type { Result, ResultAsync } from "../result";
import type { Partition } from "./partition";

describe("partition", () => {
  describe("when all Results are synchronous", () => {
    it("should return a synchronous Result", () => {
      const result = partition([succeed(1), fail("error"), succeed(2)]);

      expectTypeOf(result).toEqualTypeOf<
        Result<Partition<1 | 2, "error">, never>
      >();
    });
  });

  describe("when some Results are asynchronous", () => {
    it("should return a ResultAsync", () => {
      const result = partition([
        succeed(Promise.resolve(1)),
        fail("error"),
        succeed(2),
      ]);

      expectTypeOf(result).toEqualTypeOf<
        ResultAsync<Partition<number, "error">, never>
      >();
    });

    it("should return a ResultAsync for mixed sync and async Results", () => {
      const result = partition([succeed(1), fail(Promise.resolve("error"))]);

      expectTypeOf(result).toEqualTypeOf<
        ResultAsync<Partition<1, string>, never>
      >();
    });
  });
});
