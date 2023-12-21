import Node from "@/nodes/array/concat.js";

describe("array/concat", () => {
  it("concats the expected nodes", async () => {
    const node = new Node();

    node.inputs.a.setValue([1, 2, 3]);
    node.inputs.b.setValue([4, 5, 6]);

    await node.execute();

    const actual = node.outputs.value.value;

    expect(actual).toStrictEqual([1, 2, 3, 4, 5, 6]);
  });
});
