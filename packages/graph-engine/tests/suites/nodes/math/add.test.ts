import Node from "../../../../src/nodes/math/add";
import { Graph } from "../../../../src/graph/graph.js";

describe("math/add", () => {
  it("adds two numbers", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    node.inputs.a.setValue(2);
    node.inputs.b.setValue(1);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(3);
  });
});
