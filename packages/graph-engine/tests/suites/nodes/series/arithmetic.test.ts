import { executeNode } from "#/core.js";
import { node } from "#/nodes/series/arithmetic.js";

describe("series/arithmetic", () => {
  it("generates the expected series", async () => {
    const output = await executeNode({
      input: {
        base: 16,
        stepsDown: 1,
        steps: 1,
        increment: 1,
        precision: 0,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      "-1": 15,
      0: 16,
      1: 17,
      asArray: [15, 16, 17],
    });
  });
});

describe("series/arithmetic with precision", () => {
  it("handles precision correctly", async () => {
    // Case 1: Test for precision = 1
    const output1 = await executeNode({
      input: {
        base: 16,
        stepsDown: 1,
        steps: 1,
        increment: 0.5,
        precision: 1,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output1).toStrictEqual({
      "-1": 15.5,
      0: 16.0,
      1: 16.5,
      asArray: [15.5, 16.0, 16.5],
    });

    // Case 2: Test for precision = 2
    const output2 = await executeNode({
      input: {
        base: 16,
        stepsDown: 2,
        steps: 2,
        increment: 0.25,
        precision: 2,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output2).toStrictEqual({
      "-2": 15.5,
      "-1": 15.75,
      0: 16.0,
      1: 16.25,
      2: 16.5,
      asArray: [15.5, 15.75, 16.0, 16.25, 16.5],
    });

    // Case 3: Test for a negative increment with precision
    const output3 = await executeNode({
      input: {
        base: 16,
        stepsDown: 2,
        steps: 2,
        increment: -0.3,
        precision: 1,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output3).toStrictEqual({
      "-2": 16.6,
      "-1": 16.3,
      0: 16.0,
      1: 15.7,
      2: 15.4,
      asArray: [16.6, 16.3, 16.0, 15.7, 15.4],
    });
  });
});
