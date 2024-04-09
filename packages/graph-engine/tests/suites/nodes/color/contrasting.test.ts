import Node, { WcagVersion } from "@/nodes/color/contrasting.js";
import { Graph } from "@/graph/graph.js";

import { getAllOutputs } from "../utils";

describe("color/contrasting", () => {
  it("should return the more contrasting color correctly with WCAG 3", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    node.inputs.a.setValue("#000000");
    node.inputs.b.setValue("#ffffff");
    node.inputs.background.setValue("#ffffff");
    node.inputs.wcag.setValue(WcagVersion.V3);
    node.inputs.threshold.setValue(60);

    await node.execute();

    const output = getAllOutputs(node);

    expect(output).toEqual({
      color: "#000000",
      sufficient: true, // assuming contrast value is above 60
      contrast: 106.04067321268862,
    });
  });

  it("should return the more contrasting color correctly with WCAG 2", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    node.inputs.a.setValue("#000000");
    node.inputs.b.setValue("#ffffff");
    node.inputs.background.setValue("#000000");
    node.inputs.wcag.setValue(WcagVersion.V2);
    node.inputs.threshold.setValue(4.5);

    await node.execute();

    const output = getAllOutputs(node);

    expect(output).toEqual({
      color: "#ffffff",
      sufficient: true, // assuming contrast value is above 4.5
      contrast: 21,
    });
  });

  it("should return false for sufficient contrast if below threshold", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    node.inputs.a.setValue("#dddddd");
    node.inputs.b.setValue("#bbbbbb");
    node.inputs.background.setValue("#ffffff");
    node.inputs.wcag.setValue(WcagVersion.V3);
    node.inputs.threshold.setValue(60);

    await node.execute();

    const output = getAllOutputs(node);

    expect(output).toEqual({
      color: "#bbbbbb",
      sufficient: false, // assuming contrast value is below 60
      contrast: 36.717456545363994,
    });
  });
});
