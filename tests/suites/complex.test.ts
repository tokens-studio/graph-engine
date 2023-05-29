import { MinimizedFlowGraph, execute, nodes } from "../../src/index.js";
import basic from "../data/processed/complex.json";

describe("complex", () => {
  it("performs baseline complex calculations", async () => {
    const result = await execute({
      graph: basic as MinimizedFlowGraph,
      inputValues: {
        product: "base",
        colorMode: "light",
        surface: "bold",
        appearance: "primary",
      },
      nodes,
    });

    expect(result).toEqual({
      container: {
        background: "#C0007C",
        color: "#FFF2FA",
      },
    });

    const result2 = await execute({
      graph: basic as MinimizedFlowGraph,
      inputValues: {
        product: "cinematic",
        colorMode: "light",
        surface: "bold",
        appearance: "primary",
      },
      nodes,
    });

    expect(result2).toEqual({
      container: {
        background: "#2F59D6",
        color: "#F1F5FF",
      },
    });
  });
});
