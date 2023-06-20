import { executeNode } from "#/core.js";
import { node } from "#/nodes/string/uppercase.js";

describe("string/uppercase", () => {
  it("throws and error if not passed a string", async () => {
    await expect(
      executeNode({
        input: {},
        node,
        state: {},
        nodeId: "testId",
      })
    ).rejects.toThrowError(
      'Validation failed for node "testId" of type "studio.tokens.string.uppercase" with error "Error: Invalid input, expected a string"'
    );
  });

  it("uppercases all characters", async () => {
    const output = await executeNode({
      input: {
        input: "hhh",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      output: "HHH",
    });
  });
});
