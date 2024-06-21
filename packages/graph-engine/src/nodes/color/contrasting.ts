
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
  static description = "Returns the name of the color";

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
      type: {
        ...ColorSchema,
        default: "#ffffff",
      },
    });
    this.addInput("b", {
      type: {
        ...ColorSchema,
        default: "#000000",
      },
    });
    this.addInput("background", {
      type: {
        ...ColorSchema,
        default: "#fd0000",
      },
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
    });
    this.addOutput("color", {
      type: ColorSchema,
    });
    this.addOutput("contrast", {
      type: NumberSchema,
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
