import { Graph } from "../../../../src/graph/graph.js";
import Node from "../../../../src/nodes/string/join.js";

describe("string/join", () => {
  it("should join the string array correctly", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    node.inputs.array.setValue(["a", "b", "c"]);
    node.inputs.delimiter.setValue(",");

    await node.execute();

    expect(node.outputs.value.value).toStrictEqual("a,b,c");
  });
});
