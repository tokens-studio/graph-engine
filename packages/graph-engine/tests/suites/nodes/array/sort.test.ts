import Node, { Order } from "@/nodes/array/sort.js";

describe("array/sort", () => {
  it("sorts the values as expected", async () => {
    const node = new Node();
    node.inputs.array.setValue([1, 2, 3, 4]);
    node.inputs.order.setValue(Order.DESC);

    await node.execute();

    const output = node.outputs.value.value;

    expect(output).toEqual([4, 3, 2, 1]);
  });

  it("sorts the values as expected", async () => {
    const node = new Node();
    node.inputs.array.setValue([{ a: 3 }, { a: 2 }, { a: 4 }]);
    node.inputs.order.setValue(Order.ASC);
    node.inputs.sortBy.setValue("a");

    await node.execute();

    const output = node.outputs.value.value;

    expect(output).toEqual([{ a: 2 }, { a: 3 }, { a: 4 }]);
  });
});
