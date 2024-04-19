import Node from "@/nodes/math/abs.js";
import { Graph } from "@/graph/graph.js";

describe("math/abs", () => {
  it("absolutes the input", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.input.setValue(-1);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(1);
  });
});
