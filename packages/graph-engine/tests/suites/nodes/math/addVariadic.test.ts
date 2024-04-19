import Node from "@/nodes/math/addVariadic.js";
import { Graph } from "@/graph/graph.js";

describe("math/addVariadic", () => {
  it("adds two numbers", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.inputs.setValue([1, 2]);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(3);
  });
  it("adds multiple numbers", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.inputs.setValue([1, 2, 5, 10]);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(18);
  });
});
