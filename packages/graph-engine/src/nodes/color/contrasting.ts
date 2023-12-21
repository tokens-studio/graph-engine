// /**
//  * Performs a contrast calculation between two colors using APCA-W3 calcs
//  *
//  * @packageDocumentation
//  */
import {
  ColorSchema,
  StringSchema,
  NumberSchema,
  BooleanSchema,
} from "@/schemas/index.js";
import { NodeTypes } from "@/types.js";
import { INodeDefinition, Node } from "@/programmatic/node.js";
import Color from "colorjs.io";

export enum WcagVersion {
  V2 = "2.1",
  V3 = "3.0",
}

export default class NodeDefinition extends Node {
  static title = "Contrasting Color";
  static type = NodeTypes.CONTRASTING;
  static description = "Returns the name of the color";
  constructor(props?: INodeDefinition) {
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
    let colorA = new Color(a);
    let colorB = new Color(b);
    let backgroundCol = new Color(background);

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
