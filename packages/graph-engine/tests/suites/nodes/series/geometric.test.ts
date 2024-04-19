import Node from "@/nodes/series/geometric";
import { Graph } from "@/graph/graph.js";

describe("series/geometric", () => {
  it("generates the expected series", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.base.setValue(16);
    node.inputs.stepsDown.setValue(1);
    node.inputs.steps.setValue(1);
    node.inputs.ratio.setValue(1.2);
    node.inputs.precision.setValue(0);


    await node.execute();

    const output = node.outputs.array.value;

    expect(output).toStrictEqual([13, 16, 19]);
  });
});
