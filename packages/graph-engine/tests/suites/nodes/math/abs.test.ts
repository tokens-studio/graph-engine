import Node from "@/nodes/math/abs.js";

describe("math/abs", () => {
  it("absolutes the input", async () => {
    const node = new Node();
    node.inputs.input.setValue(-1);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(1);
  });
});
