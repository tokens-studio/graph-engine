import { minimizeFlowGraph } from './../../src/graph/graph';
import { MinimizedFlowGraph, execute, nodes } from "../../src/index.js";
import inputDisconnected from "../data/processed/inputDisconnected.json";
import tokenSetInput from "../data/raw/tokenSetInput.json";
import noInput from "../data/processed/noInput.json";

describe("Input", () => {
  it("throws an error if no input node detected", async () => {
    await expect(async () => {
      await execute({
        graph: noInput as MinimizedFlowGraph,
        inputValues: {},
        nodes,
      });
    }).rejects.toThrowError();
  });

  it("executes even if the input is disconnected", async () => {
    const result = await execute({
      graph: inputDisconnected as MinimizedFlowGraph,
      inputValues: {},
      nodes,
    });

    expect(result).toEqual({ value: "#b885a2" });
  });

  it("executes when token set is passed", async () => {
    const result = await execute({
      // @ts-ignore
      graph: minimizeFlowGraph(tokenSetInput),
      inputValues: {
        colorSet: {
          name: "input.json",
          tokens: {
          "background-color": {
            "value": "#0F3CC9",
            "type": "color"
          }}
        }
      },
      nodes,
    });

    expect(result).toEqual({css: { background: "#0F3CC9"}})
  });

});
