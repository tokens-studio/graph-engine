import { executeNode } from "@/core.js";
import { node, mapOutput } from "@/nodes/color/poline.js";

describe("color/poline", () => {
  it("creates the expected color palette with these inputs 1", async () => {
    const input = {
      anchorColors: ["#ff0000", "#00ff00"],
      numPoints: 2,
      hueShift: 20,
      positionFnX: "linearPosition",
    };

    const state = {
      anchorColors: [],
      numPoints: 4,
    };

    const output = await executeNode({
      input: input,
      node,
      state: state,
      nodeId: "",
    });

    expect(output).toStrictEqual(
      mapOutput(input, state, ["#ff5500", "#9d8b00", "#20a200", "#00ff55"])
    );
  });

  it("creates the expected color palette with these inputs 2", async () => {
    const input = {
      anchorColors: ["#ff0000", "#00ff00"],
      numPoints: 6,
      invertedLightness: true,
      positionFnY: "arcPosition",
    };

    const state = {
      anchorColors: [],
      numPoints: 4,
    };

    const output = await executeNode({
      input: input,
      node,
      state: state,
      nodeId: "",
    });

    expect(output).toStrictEqual(
      mapOutput(input, state, [
        "#ff0000",
        "#ff6454",
        "#ffc1a0",
        "#f3ffc7",
        "#a7ffa7",
        "#77ff90",
        "#4aff6a",
        "#00ff00",
      ])
    );
  });

  it("creates the expected color palette with two color inputs and a given state", async () => {
    const input = {
      anchorColors: ["#ff0000", "#00ff00"],
    };

    const state = {
      anchorColors: [],
      numPoints: 2,
      hueShift: 20,
      positionFnX: "linearPosition",
    };

    const output = await executeNode({
      input: input,
      node,
      state: state,
      nodeId: "",
    });

    expect(output).toStrictEqual(
      mapOutput(input, state, ["#ff5500", "#9d8b00", "#20a200", "#00ff55"])
    );
  });
});
