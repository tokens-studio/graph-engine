import { StringSchema } from "../../src/schemas/index.js";
import { Edge, Graph, nodeLookup } from "../../src/index.js";
import InputNode from "../../src/nodes/generic/input.js";
import OutputNode from "../../src/nodes/generic/output.js";

describe("nodeUsage", () => {
  it("performs basic passthrough calculations", async () => {
    const graph = new Graph();

    const input = new InputNode({
      id: "780c1b1a-6931-4176-90c5-2efaef37d43a",
      graph
    });
    const output = new OutputNode({
      id: "442854d8-b1a2-4261-a310-8cf7cfaa25fd",
      graph
    });
    graph.addNode(input);
    graph.addNode(output);

    //Create an input port on the input
    input.addInput("foo", {
      type: StringSchema,
    });

    //Input is a special case with dynamic values so it needs to be executed and computed to generate the output values
    await input.execute();

    const edge = input.outputs.foo.connect(output.inputs.input);

    const final = await graph.execute({
      inputs: {
        foo: {
          value: "black",
        },
      },
    });

    const expected = {
      type: {
        $id: "https://schemas.tokens.studio/string.json",
        title: "String",
        type: "string",
      },
      value: "black",
    };

    expect(final.output).toEqual(expected);

    const serialized = graph.serialize();

    expect(serialized.annotations['engine.version']).toEqual('0.12.0');

    expect(serialized).toHaveProperty('edges');
    expect(serialized).toHaveProperty('nodes');

    expect(serialized.edges).toEqual([
      {
        id: (edge as Edge).id,
        source: "780c1b1a-6931-4176-90c5-2efaef37d43a",
        sourceHandle: "foo",
        target: "442854d8-b1a2-4261-a310-8cf7cfaa25fd",
        targetHandle: "input",
      },
    ]);
    expect(serialized.nodes.length).toEqual(2);


    expect(serialized.nodes).toEqual(
      [
        {
          id: "780c1b1a-6931-4176-90c5-2efaef37d43a",
          "annotations": {
            "engine.dynamicInputs": true,
            "engine.singleton": true,
          },
          inputs: [
            {
              name: "foo",
              value: "black",
              type: {
                $id: "https://schemas.tokens.studio/string.json",
                title: "String",
                type: "string",

              },
            },
          ],
          type: "studio.tokens.generic.input",
        },
        {
          "annotations": {
            "engine.singleton": true,
          },
          id: "442854d8-b1a2-4261-a310-8cf7cfaa25fd",
          inputs: [],
          type: "studio.tokens.generic.output",
        },
      ],
    );

    const deserializedOutput = await new Graph().deserialize(
      serialized,
      nodeLookup
    ).execute();

    expect(deserializedOutput.output).toEqual(expected);
  });
});
