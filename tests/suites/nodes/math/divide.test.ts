import { executeNode } from "#/core.js";
import { node } from "#/nodes/math/divide.js";

describe("math/divide", () => {
  it("divides two numbers", async () => {
    const output = await executeNode({
      input: {
        0: 4,
        1: 2,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 2,
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
      output: 0.5,
    });
  });
  it("multiplies multiple numbers with gaps", async () => {
    const output = await executeNode({
      input: {
        0: 10,
        1: 2,
        4: 5,
        10: "10.0",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: 0.1,
    });
  });
  it("throws an error with no inputs", async () => {
    await expect(
      executeNode({
        input: {},
        node,
        state: {},
        nodeId: "testId",
      })
    ).rejects.toThrowError(
      'Validation failed for node "" of type "studio.tokens.math.divide" with error "Error: Not enough inputs "'
    );
  });
  it("returns infinity when dividing by zero", async () => {
    const output = await executeNode({
      input: {
        0: 10,
        1: 0,
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: Infinity,
    });
  });
});
