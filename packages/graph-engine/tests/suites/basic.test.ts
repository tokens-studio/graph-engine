import { Graph, nodeLookup } from "../../src/index.js";
import basic from "../data/processed/basic";

describe("basic", () => {
  it("performs basic passthrough calculations", async () => {
    const graph = Graph.deserialize(basic, nodeLookup);
    const result = await graph.execute();
    expect(result).toEqual({
      output: {
        type: {
          $id: "https://schemas.tokens.studio/string.json",
          title: "String",
          type: "string",
        },
        value: "black",
      },
    });
  });
});
