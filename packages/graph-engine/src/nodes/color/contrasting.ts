
import {
  BooleanSchema,
  ColorSchema,
  NumberSchema,
  StringSchema,
} from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { Input, Output } from "../../programmatic";
import Color from "colorjs.io";

export enum WcagVersion {
  V2 = "2.1",
  V3 = "3.0",
}

/**
 * Performs a contrast calculation between two colors using APCA-W3 calcs
 */
export default class NodeDefinition extends Node {
  static title = "Contrasting Color";
  static type = "studio.tokens.color.contrasting";
  static description = "Evaluates the contrast ratio between two colors using the APCA-W3 algorithm, and identifies the color with the higher contrast. Outputs include the color with the highest contrast, the calculated contrast ratio, and a boolean indicating whether this ratio meets a specified sufficiency threshold. Users can adjust the threshold for sufficiency and choose between WCAG 3.0 (default) or other versions for the contrast calculation.";

  declare inputs: {
    a: Input;
    b: Input;
    background: Input;
    wcag: Input;
    threshold: Input<number>;
  };
  declare outputs: {
    color: Output;
    sufficient: Output<boolean>;
    contrast: Output<number>;
  };

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: ColorSchema,
      visible: true,
    });
    this.addInput("b", {
      type: ColorSchema,
      visible: true,
    });
    this.addInput("background", {
      type: {
        ...ColorSchema,
        default: "#ffffff",
      },
      visible: true,
    });

    this.addInput("wcag", {
      type: {
        ...StringSchema,
        enum: Object.values(WcagVersion),
        default: WcagVersion.V3,
      },
    });
    this.addInput("threshold", {
      type: {
        ...NumberSchema,
        default: 60,
      },
    });

    this.addInput("contrast", {
      type: {
        ...NumberSchema,
        default: 0,
      },
    });

    this.addOutput("sufficient", {
      type: BooleanSchema,
      visible: true,
    });
    this.addOutput("color", {
      type: ColorSchema,
      visible: true,
    });
    this.addOutput("contrast", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { wcag, a, b, background, threshold } = this.getAllInputs();

    let contrastA, contrastB;
    const colorA = new Color(a);
    const colorB = new Color(b);
    const backgroundCol = new Color(background);

    if (wcag == WcagVersion.V2) {
      contrastA = backgroundCol.contrast(colorA, "WCAG21");
      contrastB = backgroundCol.contrast(colorB, "WCAG21");
    } else {
      contrastA = Math.abs(backgroundCol.contrast(colorA, "APCA"));
      contrastB = Math.abs(backgroundCol.contrast(colorB, "APCA"));
    }

    if (contrastA > contrastB) {
      this.setOutput("color", a);
      this.setOutput("sufficient", contrastA >= threshold);
      this.setOutput("contrast", contrastA);
    } else {
      this.setOutput("color", b);
      this.setOutput("sufficient", contrastB >= threshold);
      this.setOutput("contrast", contrastB);
    }
  }
}
