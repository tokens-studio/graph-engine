import { SerializedNode } from "@/graph";
import { StringSchema } from "@/schemas";

export default {
  version: "100.0.0",
  graph: {
    description: "Basic",
  },
  nodes: [
    {
      id: "c15d874f-f7e7-42a6-a6b3-8f238da52007",
      type: "studio.tokens.generic.input",
      inputs: [
        {
          name: "xxx",
          value: "black",
          type: {
            type: StringSchema,
          },
        },
      ],
    },
    {
      id: "33952fc4-eced-4c10-a56d-7bdb65182b34",
      type: "studio.tokens.generic.output",
      inputs: [],
    },
  ] as SerializedNode[],
  edges: [
    {
      id: "b7786ca3-f93c-4806-9c4e-ccc6e8e48825",
      target: "33952fc4-eced-4c10-a56d-7bdb65182b34",
      source: "c15d874f-f7e7-42a6-a6b3-8f238da52007",
      sourceHandle: "xxx",
      targetHandle: "input",
    },
  ],
};
