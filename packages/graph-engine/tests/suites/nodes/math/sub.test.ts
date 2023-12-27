import Node from "@/nodes/math/subtract.js";

describe("math/sub", () => {
  it("subtracts two numbers", async () => {
    const node = new Node();
    node.inputs.inputs.setValue([1, 2]);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(-1);
  });
  it("subtracts multiple numbers", async () => {
    const node = new Node();
    node.inputs.inputs.setValue([1, 2, 5, 10]);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(-16);
  });
});
