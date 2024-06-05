import { NumberSchema } from "../../src/schemas/index.js";
import { Graph } from "../../src/index.js";
import ConstantNode from "../../src/nodes/generic/constant.js";
import SubtractNode from "../../src/nodes/math/subtractVariadic.js";
import OutputNode from "../../src/nodes/generic/output.js";

describe("enqueing", () => {
  it("automatically enqueues when using variadic types", async () => {
    const graph = new Graph();

    const input1 = new ConstantNode({ id: "1", graph });
    const input2 = new ConstantNode({ id: "2", graph });
    const sub = new SubtractNode({ id: "sub", graph });
    const output = new OutputNode({ id: "output", graph });

    //Create an input port on the output node 
    output.addInput("input", {
      type: NumberSchema,
    });


    //We should only be setting values here after we are sure that the nodes exists in a graph
    input1.inputs.value.setValue(2, {
      type: NumberSchema,
    });

    input2.inputs.value.setValue(3, {
      type: NumberSchema,
    });

    //These should be enqueued automatically
    input1.outputs.value.connect(sub.inputs.inputs);
    input2.outputs.value.connect(sub.inputs.inputs);
    sub.outputs.value.connect(output.inputs.input);

    const final = await graph.execute();

    const expected = {
      input: {
        type: NumberSchema,
        value: -1,
      }
    };

    expect(final.output).toEqual(expected);
  });
});
