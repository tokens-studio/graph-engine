import Node, { ColorModifierTypes } from "../../../../src/nodes/color/blend.js";
import { Graph } from "../../../../src/graph/graph.js";
import { ColorSpaceTypes } from "@tokens-studio/types";

describe("color/blend", () => {
  it("darkens the color correctly", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    

    node.inputs.color.setValue("red");
    node.inputs.space.setValue(ColorSpaceTypes.SRGB);
    node.inputs.modifierType.setValue(ColorModifierTypes.DARKEN);
    node.inputs.value.setValue(0.5);

    await node.execute();
    const output = node.outputs.value.value;
    expect(output).toStrictEqual("#800000");
  });

  it("lightens the color correctly", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    

    node.inputs.color.setValue("red");
    node.inputs.space.setValue(ColorSpaceTypes.SRGB);
    node.inputs.modifierType.setValue(ColorModifierTypes.LIGHTEN);
    node.inputs.value.setValue(0.5);
    await node.execute();
    const output = node.outputs.value.value;
    expect(output).toStrictEqual("#ff8080");
  });
});
