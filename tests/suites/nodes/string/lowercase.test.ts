import { executeNode } from "#/core.js";
import { node } from "#/nodes/string/lowercase.js";

describe("string/lowercase", () => {
  it("throws and error if not passed a string", async () => {
    await expect(
      executeNode({
        input: {},
        node,
        state: {},
        nodeId: "testId",
      })
    ).rejects.toThrowError(
      'Validation failed for node "testId" of type "studio.tokens.string.lowercase" with error "Error: Invalid input, expected a string"'
    );
  });

  it("lowercases all characters", async () => {
    const output = await executeNode({
      input: {
        input: "HHH",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "hhh",
    });
  });
});
