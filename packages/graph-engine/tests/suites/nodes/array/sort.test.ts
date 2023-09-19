import { executeNode } from "#/core.js";
import { node } from "#/nodes/array/sort.js";

describe("array/sort", () => {
  it("sorts the values as expected", async () => {
    const output = await executeNode({
      input: {
        array: [1, 2, 3, 4],
        order: "desc",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: [4, 3, 2, 1],
    });
  });

  it("sorts the values as expected", async () => {
    const output = await executeNode({
      input: {
        array: [{ a: 3 }, { a: 2 }, { a: 4 }],
        order: "asc",
        sortBy: "a",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: [{ a: 2 }, { a: 3 }, { a: 4 }],
    });
  });
});
