import { StringSchema } from "@/schemas/index.js";
import { Graph, nodeLookup } from "../../src/index.js";
import InputNode from "@/nodes/generic/input.js";
import OutputNode from "@/nodes/generic/output.js";

describe("nodeUsage", () => {
  it("performs basic passthrough calculations", async () => {
    const graph = new Graph();

    const input = new InputNode({
      id: "780c1b1a-6931-4176-90c5-2efaef37d43a",
    });
    const output = new OutputNode({
      id: "442854d8-b1a2-4261-a310-8cf7cfaa25fd",
    });
    graph.addNode(input);
    graph.addNode(output);

    //Create an input port on the input
    input.addInput("foo", {
      type: StringSchema,
    });

    //Input is a special case with dynamic values so it needs to be executed and computed to generate the output values
    await input.execute();

    input.outputs.foo.connect(output.inputs.input);

    const final = await graph.execute({
      inputs: {
        foo: {
          value: "black",
        },
      },
    });

    const expected = {
      output: {
        type: {
          $id: "https://schemas.tokens.studio/string.json",
          title: "String",
          type: "string",
        },
        value: "black",
      },
    };

    expect(final).toEqual(expected);

    const serialized = graph.serialize();
    expect(serialized).toEqual({
      edges: [
        {
          id: "780c1b1a-6931-4176-90c5-2efaef37d43a:foo→442854d8-b1a2-4261-a310-8cf7cfaa25fd:input}",
          source: "780c1b1a-6931-4176-90c5-2efaef37d43a",
          sourceHandle: "foo",
          target: "442854d8-b1a2-4261-a310-8cf7cfaa25fd",
          targetHandle: "input",
        },
      ],
      graph: {
        description: "",
      },
      nodes: [
        {
          id: "780c1b1a-6931-4176-90c5-2efaef37d43a",
          inputs: [
            {
              name: "foo",
              value: "black",
              type: {
                type: {
                  $id: "https://schemas.tokens.studio/string.json",
                  title: "String",
                  type: "string",
                },
              },
            },
          ],
          type: "studio.tokens.generic.input",
        },
        {
          id: "442854d8-b1a2-4261-a310-8cf7cfaa25fd",
          inputs: [],
          type: "studio.tokens.generic.output",
        },
      ],
      version: "0.12.0",
    });

    const deserializedOutput = await Graph.deserialize(
      serialized,
      nodeLookup
    ).execute();

    expect(deserializedOutput).toEqual(expected);
  });
});
