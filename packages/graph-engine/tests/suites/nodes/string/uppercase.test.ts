import Node from "../../../../src/nodes/string/uppercase.js";
import { Graph } from "../../../../src/graph/graph.js";

describe("string/uppercase", () => {
  it("uppercases all characters", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.value.setValue("jjj");
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual("JJJ");
  });
});
