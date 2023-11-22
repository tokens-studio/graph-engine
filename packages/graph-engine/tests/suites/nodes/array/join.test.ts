import { executeNode } from "@/core.js";
import { node } from "@/nodes/array/join.js";

describe("array/join", () => {
  it("joins the values as expected", async () => {
    const output = await executeNode({
      input: {
        array: [1, 3, 4],
        delimiter: ",",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "1,3,4",
    });
  });
  it("cuses the default delimiter if not specified", async () => {
    const output = await executeNode({
      input: {
        array: [1, 3, 4],
        delimiter: ",",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "1,3,4",
    });
  });
});
