import Node from "../../../../src/nodes/math/subtract.js";
import { Graph } from "../../../../src/graph/graph.js";

describe("math/sub", () => {
  it("subtracts two numbers", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    node.inputs.a.setValue(1);
    node.inputs.b.setValue(2);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(-1);
  });
});
