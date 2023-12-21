import Node from "@/nodes/math/multiply";

describe("math/mul", () => {
  it("multiplies two numbers", async () => {
    const node = new Node();
    node.inputs.inputs.setValue([1, 2]);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(2);
  });
  it("multiplies multiple numbers", async () => {
    const node = new Node();
    node.inputs.inputs.setValue([8, 2, 2]);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(32);
  });
});
