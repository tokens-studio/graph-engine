import Node from "../../../../src/nodes/math/multiply";
import { Graph } from "../../../../src/graph/graph.js";

describe("math/mul", () => {
  it("multiplies two numbers", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    node.inputs.a.setValue(1);
    node.inputs.b.setValue(2);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(2);
  });
});
