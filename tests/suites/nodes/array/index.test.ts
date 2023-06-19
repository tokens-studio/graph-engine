import { executeNode } from "#/core.js";
import { node } from "#/nodes/array/indexArray.js";

describe("array/indexArray", () => {
  it("returns the expected value", async () => {
    const output = await executeNode({
      input: {
        array: [0, 1, 2],
        index: 1,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 1,
    });
  });
  it("returns undefined when out of bounds", async () => {
    const output = await executeNode({
      input: {
        array: [0, 1, 2],
        index: -5,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: undefined,
    });
  });
});
