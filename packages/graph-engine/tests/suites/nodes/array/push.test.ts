import { Graph } from "../../../../src/graph/graph.js";
import Node from "../../../../src/nodes/array/push";

describe("array/push", () => {
  it("does a non mutative push", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    const array = [1, 2, 3];

    node.inputs.array.setValue(array);
    node.inputs.item.setValue(4);

    await node.execute();

    expect(node.outputs.value.value).toStrictEqual([1, 2, 3, 4]);
    //don't mutate the original array
    expect(array).toStrictEqual([1, 2, 3]);
  });
});
