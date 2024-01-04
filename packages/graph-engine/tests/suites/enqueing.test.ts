import { NumberSchema, StringSchema } from "@/schemas/index.js";
import { Graph, nodeLookup } from "../../src/index.js";
import ConstantNode from "@/nodes/generic/constant.js";
import SubtractNode from "@/nodes/math/subtract.js";

describe("enqueing", () => {
  it("automatically enqueues when using variadic types", async () => {
    const graph = new Graph();

    const input1 = new ConstantNode();
    const input2 = new ConstantNode();

    input1.inputs.value.setValue(2, {
      type: NumberSchema,
    });

    input1.inputs.value.setValue(3, {
      type: NumberSchema,
    });

    const output = new SubtractNode();
    graph.addNode(input1);
    graph.addNode(input2);
    graph.addNode(output);

    //These should be enqueued automatically
    input1.outputs.value.connect(output.inputs.inputs);
    input2.outputs.value.connect(output.inputs.inputs);

    const final = await graph.execute();

    const expected = {
      output: {
        type: NumberSchema,
        value: -1,
      },
    };

    expect(final).toEqual(expected);
  });
});
