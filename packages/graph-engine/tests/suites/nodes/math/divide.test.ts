import Node from "@/nodes/math/divideVariadic";
import { Graph } from "@/graph/graph.js";

describe("math/div", () => {
  it("divides two numbers", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.inputs.setValue([1, 2]);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(0.5);
  });
  it("divides multiple numbers", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.inputs.setValue([8, 2, 2]);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(2);
  });

  it("returns infinity when dividing by zero", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.inputs.setValue([1, 0]);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(Infinity);
  });
});
