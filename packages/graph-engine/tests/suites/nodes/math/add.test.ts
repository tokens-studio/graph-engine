import { executeNode } from "@/core.js";
import { node } from "@/nodes/math/add.js";

describe("math/add", () => {
  it("adds two numbers", async () => {
    const output = await executeNode({
      input: {
        0: 1,
        1: 2,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 3,
    });
  });
  it("converts string values if detected", async () => {
    const output = await executeNode({
      input: {
        0: "1",
        1: "2.0000",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 3,
    });
  });
  it("adds multiple numbers with gaps", async () => {
    const output = await executeNode({
      input: {
        0: 1,
        1: 2,
        4: 5,
        10: "10.0",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 18,
    });
  });
  it("returns 0 for no inputs", async () => {
    const output = await executeNode({
      input: {},
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 0,
    });
  });
});
