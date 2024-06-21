import { Graph } from "../../../../src/graph/graph.js";
import Node from "../../../../src/nodes/math/abs.js";

describe("math/abs", () => {
  it("absolutes the input", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    node.inputs.input.setValue(-1);
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(1);
  });
});
