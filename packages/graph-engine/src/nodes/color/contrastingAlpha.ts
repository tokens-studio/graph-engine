/**
 * Performs a contrast calculation between two colors using APCA-W3 calcs
 *
 * @packageDocumentation
 */
import {
  ColorSchema,
  NumberSchema,
  StringSchema,
} from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { Input, Output } from "../../programmatic";
import { NodeTypes } from "../../types.js";
import { flattenAlpha } from "./lib/flattenAlpha.js";
import Color from "colorjs.io";

export enum WcagVersion {
  V2 = "2.1",
  V3 = "3.0",
}

export const contrastCheck = (foreground: Color, background: Color, wcag: WcagVersion): number => {
  if (wcag == WcagVersion.V2) {
    return foreground.contrast(background, "WCAG21");
  } else {
    return Math.abs(foreground.contrast(background, "APCA"));
  }
}

export default class NodeDefinition extends Node {
  static title = "Contrasting Alpha";
  static type = "studio.tokens.color.contrasting";
  static description = "Reduce alpha until you are close to the threshold.";

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

    // Inputs
    this.addInput("foreground", {
      type: {
        ...ColorSchema,
        default: "#000000"
      },
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
      visible: true,
    });
    this.addInput("precision", {
      type: {
        ...NumberSchema,
        default: 5,
      },
    });

    // Outputs
    this.addOutput("alpha", {
      type: NumberSchema,
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
    const { wcag, foreground, background, threshold, precision } = this.getAllInputs();

    const binarySearchAlpha = (low, high, fg, bg, targetContrast, iterations) => {
      
      if (iterations == 0 || high - low < 0.01) {  // Adding a minimum delta to prevent infinite recursion
        fg.alpha = high; // Default to higher alpha if exact match isn't found
        return high;  // Ensure we are returning the alpha that provides sufficient contrast
      }

      const mid = (low + high) / 2;
      fg.alpha = mid;

      // Convert blended color back to Color object and then to hex string
      const solidColor = flattenAlpha(fg, bg);

      currentContrast = contrastCheck(solidColor, bg, wcag);
      
      if (currentContrast >= targetContrast) {
        return binarySearchAlpha(low, mid, fg, bg, targetContrast, iterations - 1);
      } else {
        return binarySearchAlpha(mid, high, fg, bg, targetContrast, iterations - 1);
      }
    };

    const foregroundColor = new Color(foreground);
    const backgroundColor = new Color(background);
    let currentContrast = contrastCheck(foregroundColor, backgroundColor, wcag);

    if (currentContrast <= threshold) {
      this.setOutput("alpha", 1);
      this.setOutput("color", foregroundColor.to('srgb').toString({ format: 'hex' }));
      this.setOutput("contrast", currentContrast);
      return;
    }

    const finalAlpha = binarySearchAlpha(0, 1, foregroundColor, backgroundColor, threshold, precision);

    foregroundColor.alpha = finalAlpha;
    const finalColor = flattenAlpha(foregroundColor, backgroundColor);
    let finalContrast;
    if (wcag == WcagVersion.V2) {
      finalContrast = finalColor.contrast(backgroundColor, "WCAG21");
    } else {
      finalContrast = Math.abs(finalColor.contrast(backgroundColor, "APCA"));
    }

    this.setOutput("alpha", finalAlpha);
    this.setOutput("color", finalColor.to('srgb').toString({ format: 'hex' }));
    this.setOutput("contrast", finalContrast);
  }
}
