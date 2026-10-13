import { describe, expect, it } from "vitest";

import { fail } from "./fail";
import { partitionBy } from "./partition-by";
import { succeed } from "./succeed";

describe("partitionBy", () => {
  describe("when function returns synchronous Results", () => {
    const parseNumber = (value: string) => {
      const number = Number(value);
      return Number.isNaN(number) ? fail("invalid number") : succeed(number);
    };

    it("should return succeeded values and failed inputs", () => {
      const parseMany = partitionBy(parseNumber);
      const result = parseMany(["1", "x", "2"]);

      expect(result).toEqual(
        succeed({
          succeeded: [1, 2],
          failed: [{ input: "x", reason: "invalid number" }],
        }),
      );
    });
  });

  describe("when function returns asynchronous Results", () => {
    const parseNumber = (value: string) => {
      const number = Number(value);
      return Number.isNaN(number)
        ? fail(Promise.resolve("invalid number"))
        : succeed(Promise.resolve(number));
    };

    it("should return succeeded values and failed inputs", async () => {
      const parseMany = partitionBy(parseNumber);
      const result = await parseMany(["1", "x", "2"]);

      expect(result).toEqual(
        succeed({
          succeeded: [1, 2],
          failed: [{ input: "x", reason: "invalid number" }],
        }),
      );
    });
  });

  describe("when function returns mixed sync and async Results", () => {
    const parse = (value: string) => {
      if (value === "x") {
        return fail(Promise.resolve("x error"));
      }

      if (value === "y") {
        return fail("y error");
      }

      const number = Number(value);
      return number % 2 === 0
        ? succeed(Promise.resolve(number))
        : succeed(number);
    };

    it("should preserve input and error pairs", async () => {
      const parseMany = partitionBy(parse);
      const result = await parseMany(["1", "x", "2", "y"]);

      expect(result).toEqual(
        succeed({
          succeeded: [1, 2],
          failed: [
            { input: "x", reason: "x error" },
            { input: "y", reason: "y error" },
          ],
        }),
      );
    });
  });

  describe("when input is empty", () => {
    it("should return empty succeeded and failed lists", () => {
      const result = partitionBy((input: number) => succeed(input))([]);

      expect(result).toEqual(
        succeed({
          succeeded: [],
          failed: [],
        }),
      );
    });
  });
});
