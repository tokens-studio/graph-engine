import Node from "@/nodes/array/indexArray.js";

describe("array/indexArray", () => {
  it("returns the expected value", async () => {
    const node = new Node();

    node.inputs.array.setValue([0, 1, 2]);
    node.inputs.index.setValue(1);

    await node.execute();

    const output = node.outputs.value.value;
    expect(output).toStrictEqual(1);
  });
  it("returns undefined when out of bounds", async () => {
    const node = new Node();

    node.inputs.array.setValue([0, 1, 2]);
    node.inputs.index.setValue(-5);

    await node.execute();

    const output = node.outputs.value.value;
    expect(output).toStrictEqual(undefined);
  });
});
