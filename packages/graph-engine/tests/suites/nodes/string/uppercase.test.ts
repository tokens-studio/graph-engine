import Node from "@/nodes/string/uppercase.js";
import { Graph } from "@/graph/graph.js";

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
