import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Fluid";
  static type = "studio.tokens.math.fluid";
  static description =
    "Fluid node allows you to dynamically calculates a dimension based on the current viewport width, transitioning smoothly between a minimum and maximum dimension as the viewport width changes within a defined range (from min viewport to max viewport)";



  declare inputs: ToInput<{
    minSize: number;
    maxSize: number;
    minViewport: number;
    maxViewport: number;
    viewport: number;
  }>;
  declare outputs: ToOutput<{
    value: number;
  }>;


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
    const { minSize, maxSize, minViewport, maxViewport, viewport } =
      this.getAllInputs();
    const fontV = (100 * (maxSize - minSize)) / (maxViewport - minViewport);
    const fontR =
      (minViewport * maxSize - maxViewport * minSize) /
      (minViewport - maxViewport);
    const fluid = (viewport / 100) * fontV + fontR;
    const clamped = Math.min(maxSize, Math.max(minSize, fluid));

    this.setOutput("value", clamped);
  }
}
