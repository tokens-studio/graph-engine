import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Base Font Size";
  static type = 'studio.tokens.typography.baseFontSize';

  declare inputs: ToInput<{
    visualAcuity: number;
    /**
     * The correct factor 
     */
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
      visible: true,
    });
    this.addInput("lightingCondition", {
      type: {
        ...NumberSchema,
        default: 0.83,
      },
      visible: true,
    });
    this.addInput("distance", {
      type: {
        ...NumberSchema,
        default: 30,
      },
      visible: true,
    });

    this.addInput("xHeightRatio", {
      type: {
        ...NumberSchema,
        default: 0.53,
      },
      visible: true,
    });

    this.addInput("ppi", {
      type: {
        ...NumberSchema,
        default: 458,
      },
      visible: true,
    });
    this.addInput("pixelDensity", {
      type: {
        ...NumberSchema,
        default: 3,
      },
      visible: true,
    });
    this.addInput("precision", {
      type: {
        ...NumberSchema,
        default: 0,
      },
      visible: true,
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
      precision
    } = this.getAllInputs();

    const visualCorrection =
      correctionFactor * (lightingCondition / visualAcuity);
    const xHeightMM =
      Math.tan((visualCorrection * Math.PI) / 21600) * (distance * 10) * 2;
    const xHeightPX = (xHeightMM / 25.4) * (ppi / pixelDensity);
    const fontSizePX = (1 * xHeightPX) / xHeightRatio;

    const shift = 10 ** precision;
    const output = Math.round(fontSizePX * shift) / shift;

    this.setOutput("value", output);
  }
}
