import Node from "@/nodes/series/harmonic";
import { Graph } from "@/graph/graph.js";

describe("series/harmonic", () => {
  it("generates the expected series", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.base.setValue(16);
    node.inputs.stepsDown.setValue(2);
    node.inputs.steps.setValue(2);
    node.inputs.notes.setValue(3);
    node.inputs.ratio.setValue(1.2);
    node.inputs.precision.setValue(1);


    await node.execute();

    const output = node.outputs.array.value;

    expect(output).toStrictEqual([14.2,15.1, 16, 17,18.1]);
  });
});
