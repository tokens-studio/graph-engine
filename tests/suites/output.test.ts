import { MinimizedFlowGraph, execute, nodes } from "../../src/index.js";
import noOutput from "../data/processed/noOutput.json";
import outputObject from "../data/processed/outputObject.json";

describe("Output", () => {
  it("throws an error if no output node detected", async () => {
    await expect(async () => {
      await execute({
        graph: noOutput as MinimizedFlowGraph,
        inputValues: {},
        nodes,
      });
    }).rejects.toThrowError();
  });

  it("Outputs a pruned css map object", async () => {
    const result = await execute({
      graph: outputObject as MinimizedFlowGraph,
      inputValues: {
        background: "blue",
      },
      nodes,
    });

    expect(result).toEqual({
      out: {
        background: "blue",
      },
    });
  });
});
