import Node from "../../../../src/nodes/array/join.js";
import { Graph } from "../../../../src/graph/graph.js";


describe("array/join", () => {
  it("joins the values as expected", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    
    node.inputs.array.setValue([1, 2, 3]);
    node.inputs.delimiter.setValue(",");

    await node.execute();

    expect(node.outputs.value.value).toStrictEqual("1,2,3");
  });
  it("uses the default delimiter if not specified", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    
    node.inputs.array.setValue([1, 2, 3]);

    await node.execute();

    expect(node.outputs.value.value).toStrictEqual("1,2,3");
  });
});
