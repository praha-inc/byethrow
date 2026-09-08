import { describe, expectTypeOf, it } from "vitest";

import { fail } from "./fail";
import { partitionBy } from "./partition-by";
import { succeed } from "./succeed";

import type { Result, ResultAsync, ResultMaybeAsync } from "../result";
import type { BatchFailure } from "./partition-by";
import type { Partition } from "./partition";

describe("partitionBy", () => {
  describe("when function returns synchronous Results", () => {
    it("should return a synchronous Result", () => {
      const parseMany = partitionBy((value: string) => {
        const number = Number(value);
        return Number.isNaN(number) ? fail("invalid") : succeed(number);
      });

      const result = parseMany(["1", "x"]);

      expectTypeOf(result).toEqualTypeOf<
        Result<Partition<number, BatchFailure<string, "invalid">>, never>
      >();
    });
  });

  describe("when function returns asynchronous Results", () => {
    it("should return a ResultAsync", () => {
      const parseMany = partitionBy((value: string) => {
        const number = Number(value);
        return Number.isNaN(number)
          ? fail(Promise.resolve("invalid"))
          : succeed(Promise.resolve(number));
      });

      const result = parseMany(["1", "x"]);

      expectTypeOf(result).toEqualTypeOf<
        ResultAsync<Partition<number, BatchFailure<string, string>>, never>
      >();
    });
  });

  describe("when function returns ResultMaybeAsync", () => {
    it("should return a ResultMaybeAsync", () => {
      const parseMany = partitionBy((value: number) => {
        return value % 2 === 0 ? succeed(Promise.resolve(value)) : fail("odd");
      });

      const result = parseMany([1, 2, 3]);

      expectTypeOf(result).toEqualTypeOf<
        ResultMaybeAsync<Partition<number, BatchFailure<number, "odd">>, never>
      >();
    });
  });
});
