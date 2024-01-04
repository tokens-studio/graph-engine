import Node from "@/nodes/math/addVariadic.js";

describe("math/add", () => {
  it("adds two numbers", async () => {
    const node = new Node();
    node.inputs.inputs.setValue([1, 2]);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(3);
  });
  it("adds multiple numbers", async () => {
    const node = new Node();
    node.inputs.inputs.setValue([1, 2, 5, 10]);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(18);
  });
});
