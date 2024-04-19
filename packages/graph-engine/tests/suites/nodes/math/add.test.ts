import Node from "@/nodes/math/add";
import { Graph } from "@/graph/graph.js";

describe("math/add", () => {
  it("adds two numbers", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.a.setValue(1);
    node.inputs.b.setValue(1);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(3);
  });
});
