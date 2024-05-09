import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Base Font Size";
  static type = NodeTypes.BASE_FONT_SIZE;

  declare inputs: ToInput<{
    visualAcuity: number;
    correctionFactor: number;
    lightingCondition: number;
    distance: number;
    xHeightRatio: number;
    ppi: number;
    pixelDensity: number;
  }>;

  declare outputs: ToOutput<{
    value: number;
  }>;

  static description =
    "Base Font node allows you to calculate the base font size with DIN 1450.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("visualAcuity", {
      type: {
        ...NumberSchema,
        default: 0.7,
      },
      visible: true,
    });
    this.addInput("correctionFactor", {
      type: {
        ...NumberSchema,
        default: 13,
      },
    });
    this.addInput("lightingCondition", {
      type: {
        ...NumberSchema,
        default: 0.83,
      },
    });
    this.addInput("distance", {
      type: {
        ...NumberSchema,
        default: 30,
      },
    });

    this.addInput("xHeightRatio", {
      type: {
        ...NumberSchema,
        default: 0.53,
      },
    });

    this.addInput("ppi", {
      type: {
        ...NumberSchema,
        default: 458,
      },
    });
    this.addInput("pixelDensity", {
      type: {
        ...NumberSchema,
        default: 3,
      },
    });

    this.addOutput("value", {
      type: {
        ...NumberSchema,
        description: "The generated font size",
      },
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const {
      visualAcuity,
      lightingCondition,
      distance,
      xHeightRatio,
      ppi,
      pixelDensity,
      correctionFactor,
    } = this.getAllInputs();

    const visualCorrection =
      correctionFactor * (lightingCondition / visualAcuity);
    const xHeightMM =
      Math.tan((visualCorrection * Math.PI) / 21600) * (distance * 10) * 2;
    const xHeightPX = (xHeightMM / 25.4) * (ppi / pixelDensity);
    const fontSizePX = (1 * xHeightPX) / xHeightRatio;

    this.setOutput("value", fontSizePX);
  }
}
