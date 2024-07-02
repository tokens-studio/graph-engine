import { ContrastAlgorithm } from "../../../../src/types/index.js";
import { Graph } from "../../../../src/graph/graph.js";
import Node from "../../../../src/nodes/color/contrasting.js";

import { getAllOutputs } from "../utils";

describe("color/contrasting", () => {
  it("should return the more contrasting color correctly with WCAG 3", async () => {
    const graph = new Graph();
    const node = new Node({ graph });


    node.inputs.a.setValue({
      space: "srgb",
      channels: [0, 0, 0],

    });
    node.inputs.b.setValue({
      space: "srgb",
      channels: [1, 1, 1],

    });
    node.inputs.background.setValue({
      space: "srgb",
      channels: [1, 1, 1],

    });
    node.inputs.algorithm.setValue(ContrastAlgorithm.APCA);
    node.inputs.threshold.setValue(60);

    await node.run();

    const output = getAllOutputs(node);

    expect(output).toEqual({
      color: {
        space: "srgb",
        channels: [0, 0, 0],

      },
      sufficient: true, // assuming contrast value is above 60
      contrast: 106.04067321268862,
    });
  });

  it("should return the more contrasting color correctly with WCAG 2", async () => {
    const graph = new Graph();
    const node = new Node({ graph });


    node.inputs.a.setValue({
      space: "srgb",
      channels: [0, 0, 0],

    });
    node.inputs.b.setValue({
      space: "srgb",
      channels: [1, 1, 1],

    });
    node.inputs.background.setValue({
      space: "srgb",
      channels: [0, 0, 0],
    });
    node.inputs.algorithm.setValue(ContrastAlgorithm.WCAG21);
    node.inputs.threshold.setValue(4.5);

    await node.run();

    const output = getAllOutputs(node);

    expect(output).toEqual({
      color: {
        space: "srgb",
        channels: [1, 1, 1],
      },
      sufficient: true, // assuming contrast value is above 4.5
      contrast: 21,
    });
  });

  it("should return false for sufficient contrast if below threshold", async () => {
    const graph = new Graph();
    const node = new Node({ graph });


    node.inputs.a.setValue({
      space: "srgb",
      channels: [0.87, 0.87, 0.87],

    });
    node.inputs.b.setValue({
      space: "srgb",
      channels: [0.73, 0.73, 0.73],

    });
    node.inputs.background.setValue({
      space: "srgb",
      channels: [1, 1, 1],
  
    });
    node.inputs.algorithm.setValue(ContrastAlgorithm.APCA);
    node.inputs.threshold.setValue(60);

    await node.run();

    const output = getAllOutputs(node);

    expect(output).toEqual({
      color: {
        space: "srgb",
        channels: [0.73, 0.73, 0.73],

      },
      sufficient: false, // assuming contrast value is below 60
      contrast: 37.180836150040705,
    });
  });
});
