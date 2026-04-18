import { describe, expect, it } from "vitest";

import { fail } from "./fail";
import { partition } from "./partition";
import { succeed } from "./succeed";

describe("partition", () => {
  describe("when all results are successful", () => {
    it("should return succeeded values and an empty failed list", () => {
      const result = partition([succeed(1), succeed(2), succeed(3)]);

      expect(result).toEqual(
        succeed({
          succeeded: [1, 2, 3],
          failed: [],
        }),
      );
    });
  });

  describe("when some results are failures", () => {
    it("should return both succeeded values and failed errors", () => {
      const result = partition([
        succeed(1),
        fail("error1"),
        succeed(2),
        fail("error2"),
      ]);

      expect(result).toEqual(
        succeed({
          succeeded: [1, 2],
          failed: ["error1", "error2"],
        }),
      );
    });
  });

  describe("when input has asynchronous Results", () => {
    it("should handle asynchronous successes and failures", async () => {
      const result = await partition([
        succeed(Promise.resolve(1)),
        fail(Promise.resolve("error1")),
        succeed(Promise.resolve(2)),
        fail(Promise.resolve("error2")),
      ]);

      expect(result).toEqual(
        succeed({
          succeeded: [1, 2],
          failed: ["error1", "error2"],
        }),
      );
    });

    it("should handle mixed synchronous and asynchronous Results", async () => {
      const result = await partition([
        succeed(1),
        fail(Promise.resolve("error1")),
        succeed(Promise.resolve(2)),
        fail("error2"),
      ]);

      expect(result).toEqual(
        succeed({
          succeeded: [1, 2],
          failed: ["error1", "error2"],
        }),
      );
    });
  });

  describe("when input is empty", () => {
    it("should return empty succeeded and failed lists", () => {
      const result = partition([]);

      expect(result).toEqual(
        succeed({
          succeeded: [],
          failed: [],
        }),
      );
    });
  });
});
