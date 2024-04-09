import Node from "@/nodes/string/join.js";
import { Graph } from "@/graph/graph.js";

describe("string/join", () => {
  it("should join the string array correctly", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    node.inputs.array.setValue(["a", "b", "c"]);
    node.inputs.separator.setValue(",");

    await node.execute();

    expect(node.outputs.value.value).toStrictEqual("a,b,c");
  });
});
