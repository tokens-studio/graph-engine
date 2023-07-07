import { executeNode } from "#/core.js";
import { node } from "#/nodes/input/objectify.js";

describe("input/objectify", () => {
  it("passes through the input correctly", async () => {
    const output = await executeNode({
      input: {
        name: "a",
        key: "value",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: {
        name: "a",
        key: "value",
      },
    });
  });
});
