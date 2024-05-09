import Node from "../../../../src/nodes/string/lowercase.js";
import { Graph } from "../../../../src/graph/graph.js";

describe("string/lowercase", () => {
  it("lowercases all characters", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);

    node.inputs.value.setValue("HHH");

    await node.execute();

    expect(node.outputs.value.value).toStrictEqual("hhh");
  });
});
