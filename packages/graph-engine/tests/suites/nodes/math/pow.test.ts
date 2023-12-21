import Node from "@/nodes/math/pow";

describe("math/pow", () => {
  it("powers two numbers", async () => {
    const node = new Node();
    node.inputs.base.setValue(2);
    node.inputs.exponent.setValue(2);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(4);
  });
});
