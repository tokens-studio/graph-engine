import Node from "@/nodes/array/slice";
import { Graph } from "@/graph/graph.js";


describe("array/slice", () => {
    it("performs an array slice", async () => {
        const graph = new Graph();
        const node = new Node({ graph });
        graph.addNode(node);
        const array = [1, 2, 3];

        node.inputs.array.setValue(array);
        node.inputs.start.setValue(array);
        node.inputs.end.setValue(array);

        await node.execute();

        expect(node.outputs.value.value).toStrictEqual([3,2,1]);
        //don't mutate the original array
        expect(array).toStrictEqual([1, 2, 3]);
    });
});
