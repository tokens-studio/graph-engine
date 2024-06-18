import Node from "../../../../src/nodes/series/arithmetic.js";
import { Graph } from "../../../../src/graph/graph.js";

describe("series/arithmetic", () => {
  it("generates the expected series", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    
    node.inputs.base.setValue(16);
    node.inputs.stepsDown.setValue(1);
    node.inputs.stepsUp.setValue(1);
    node.inputs.increment.setValue(1);
    node.inputs.precision.setValue(0);

    await node.execute();

    const output = node.outputs.array.value;

    expect(output).toStrictEqual([15, 16, 17]);
  });
});
