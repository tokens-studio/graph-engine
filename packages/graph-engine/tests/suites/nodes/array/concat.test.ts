import Node from "@/nodes/array/concat.js";
import { Graph } from "@/graph/graph.js";

describe("array/concat", () => {
  it("concats the expected nodes", async () => {
    const graph = new Graph();
    const node = new Node({graph});
    graph.addNode(node);

    const a = [1, 2, 3];
    const b = [4, 5, 6];

    node.inputs.a.setValue(a);
    node.inputs.b.setValue(b);

    await node.execute();

    const actual = node.outputs.value.value;

    expect(actual).toStrictEqual([1, 2, 3, 4, 5, 6]);
    expect(a).toStrictEqual([1, 2, 3]);
    expect(b).toStrictEqual([4, 5, 6]);
  });
});
