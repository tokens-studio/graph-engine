import Node from "../../../../src/nodes/array/reverse";
import { Graph } from "../../../../src/graph/graph.js";


describe("array/reverse", () => {
    it("does a non mutative reverse", async () => {
        const graph = new Graph();
        const node = new Node({ graph });
        
        const array = [1, 2, 3];

        node.inputs.array.setValue(array);

        await node.execute();

        expect(node.outputs.value.value).toStrictEqual([3,2,1]);
        //don't mutate the original array
        expect(array).toStrictEqual([1, 2, 3]);
    });
});
