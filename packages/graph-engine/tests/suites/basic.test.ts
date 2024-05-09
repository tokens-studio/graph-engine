import { Graph, NodeFactory, SerializedGraph, nodeLookup } from "../../src/index.js";
import basic from "../data/processed/basic";

describe("basic", () => {
  it("performs basic passthrough calculations", async () => {
    const graph = new Graph().deserialize(basic as unknown as SerializedGraph, nodeLookup as Record<string, NodeFactory>);

    const result = await graph.execute();
    expect(result.output).toEqual({
        type: {
          $id: "https://schemas.tokens.studio/string.json",
          title: "String",
          type: "string",
        },
        value: "black",
    });
  });
});
