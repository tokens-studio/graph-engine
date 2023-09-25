import { executeNode } from "#/core.js";
import { node } from "#/nodes/string/join.js";

describe("string/join", () => {
  it("should join the string array correctly", async () => {
    const output = await executeNode({
      input: {
        array: ["a", "b", "c"],
      },
      node,
      state: {
        seperator: ",",
      },
      nodeId: "testId",
    });

    expect(output).toStrictEqual({
      output: "a,b,c",
    });
  });
});
