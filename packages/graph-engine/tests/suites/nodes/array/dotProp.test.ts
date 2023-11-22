import { executeNode } from "@/core.js";
import { node } from "@/nodes/array/dotProp.js";

describe("array/dotProp", () => {
  it("extracts the expected property", async () => {
    const output = await executeNode({
      input: {
        array: [{ a: 0 }, { a: 1 }, { a: 2 }],
        accessor: "a",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: [0, 1, 2],
    });
  });
});
