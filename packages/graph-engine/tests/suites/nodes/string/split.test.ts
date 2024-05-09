import Node from "../../../../src/nodes/string/split.js";
import { Graph } from "../../../../src/graph/graph.js";

describe("string/split", () => {
  it("splits a string as expected", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.value.setValue("HHH");
    node.inputs.value.setValue("H,H,H");
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(["H", "H", "H"]);
  });
});
