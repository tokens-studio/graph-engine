import { executeNode } from "#/core.js";
import { node } from "#/nodes/css/box.js";

describe("css/box", () => {
  it("produces the css box descriptionbs", async () => {
    const output = await executeNode({
      input: {
        top: 5,
        right: 6,
      },
      node,
      state: {
        bottom: 3,
        left: 4,
      },
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "5 6 3 4",
    });
  });
});
