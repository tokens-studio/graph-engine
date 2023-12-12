



import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { NumberSchema } from "@/schemas/index.js";

export class NodeDefinition extends Node {
  title = "Fluid";
  type = NodeTypes.FLUID_VALUE;
  description = "Fluid node allows you to dynamically calculates a dimension based on the current viewport width, transitioning smoothly between a minimum and maximum dimension as the viewport width changes within a defined range (from min viewport to max viewport)"
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("minSize", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("maxSize", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("minViewport", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("maxViewport", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("viewport", {
      type: NumberSchema,
      visible: true,
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { minSize, maxSize, minViewport, maxViewport, viewport } = this.getAllInputs();
    const fontV = (100 * (maxSize - minSize)) / (maxViewport - minViewport);
    const fontR =
      (minViewport * maxSize - maxViewport * minSize) /
      (minViewport - maxViewport);
    const fluid = (viewport / 100) * fontV + fontR;
    const clamped = Math.min(maxSize, Math.max(minSize, fluid));

    this.setOutput("value", clamped);
  }
}
