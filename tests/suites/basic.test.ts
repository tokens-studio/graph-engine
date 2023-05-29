import { MinimizedFlowGraph, execute, nodes } from "../../src/index.js";
import basic from "../data/processed/basic.json";

describe("basic", () => {
  it("performs basic passthrough calculations", async () => {
    const result = await execute({
      graph: basic as MinimizedFlowGraph,
      inputValues: {},
      nodes,
    });

    expect(result).toEqual({ out: "black" });
  });
});
