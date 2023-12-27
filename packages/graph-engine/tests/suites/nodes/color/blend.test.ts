import Node, { ColorModifierTypes } from "@/nodes/color/blend.js";

describe("color/blend", () => {
  it("darkens the color correctly", async () => {
    const node = new Node();

    node.inputs.color.setValue("red");
    node.inputs.space.setValue("srgb");
    node.inputs.modifierType.setValue(ColorModifierTypes.DARKEN);
    node.inputs.value.setValue(0.5);

    await node.execute();
    const output = node.outputs.value.value;
    expect(output).toStrictEqual("#800000");
  });

  it("lightens the color correctly", async () => {
    const node = new Node();

    node.inputs.color.setValue("red");
    node.inputs.space.setValue("srgb");
    node.inputs.modifierType.setValue(ColorModifierTypes.LIGHTEN);
    node.inputs.value.setValue(0.5);
    await node.execute();
    const output = node.outputs.value.value;
    expect(output).toStrictEqual("#ff8080");
  });
});
