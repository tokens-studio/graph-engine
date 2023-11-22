import { executeNode } from "@/core.js";
import { node } from "@/nodes/typing/passUnit.js";

describe("typing/passUnit", () => {
  it("adds unit if falsey value", async () => {
    const output = await executeNode({
      input: {
        value: 0,
      },
      node,
      state: {
        fallback: "px",
      },
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "0px",
    });
  });

  it("adds unit if not detected", async () => {
    const output = await executeNode({
      input: {
        value: 3,
      },
      node,
      state: {
        fallback: "px",
      },
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "3px",
    });
  });

  it("does not add unit if  detected", async () => {
    const output = await executeNode({
      input: {
        value: "3px",
      },
      node,
      state: {
        fallback: "px",
      },
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "3px",
    });
  });
});
