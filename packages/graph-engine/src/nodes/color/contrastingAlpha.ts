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
import { ContrastAlgorithm } from "../../types/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { Input, Output } from "../../programmatic";
import { flattenAlpha } from "./lib/flattenAlpha.js";
import Color from "colorjs.io";


export const contrastCheck = (foreground: Color, background: Color, algorithm): number => {
  return Math.abs(foreground.contrast(background, algorithm));
}

export default class NodeDefinition extends Node {
  static title = "Contrasting Alpha";
  static type = "studio.tokens.color.contrastingAlpha";
  static description = "Finds the optimal alpha value for a foreground color to meet contrast requirements.\n\nInputs: Foreground Color, Background Color, Target Contrast, Algorithm\nOutputs: Adjusted Color, Alpha Value, Achieved Contrast\n\nUse this node to automatically adjust the opacity of text or UI elements for optimal readability. It finds the minimum alpha needed to meet the specified contrast ratio. Essential for creating accessible designs that maintain visual aesthetics."
;

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
    });
    this.addInput("background", {
      type: {
        ...ColorSchema,
        default: "#ffffff",
      },
    });
    this.addInput("algorithm", {
      type: {
        ...StringSchema,
        enum: Object.values(ContrastAlgorithm),
        default: ContrastAlgorithm.APCA,
      },
    });
    this.addInput("threshold", {
      type: {
        ...NumberSchema,
        default: 60,
      },
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
    });
    this.addOutput("color", {
      type: ColorSchema,
    });
    this.addOutput("contrast", {
      type: NumberSchema,
    });
  }

  execute(): void | Promise<void> {
    const { algorithm, foreground, background, threshold, precision } = this.getAllInputs();

    const binarySearchAlpha = (low, high, fg, bg, targetContrast, iterations) => {
      
      if (iterations == 0 || high - low < 0.01) {  // Adding a minimum delta to prevent infinite recursion
        fg.alpha = high; // Default to higher alpha if exact match isn't found
        return high;  // Ensure we are returning the alpha that provides sufficient contrast
      }

      const mid = (low + high) / 2;
      fg.alpha = mid;

      // Convert blended color back to Color object and then to hex string
      const solidColor = flattenAlpha(fg, bg);

      currentContrast = contrastCheck(solidColor, bg, algorithm);
      
      if (currentContrast >= targetContrast) {
        return binarySearchAlpha(low, mid, fg, bg, targetContrast, iterations - 1);
      } else {
        return binarySearchAlpha(mid, high, fg, bg, targetContrast, iterations - 1);
      }
    };

    const foregroundColor = new Color(foreground);
    const backgroundColor = new Color(background);
    let currentContrast = contrastCheck(foregroundColor, backgroundColor, algorithm);

    if (currentContrast <= threshold) {
      this.setOutput("alpha", 1);
      this.setOutput("color", foregroundColor.to('srgb').toString({ format: 'hex' }));
      this.setOutput("contrast", currentContrast);
      return;
    }

    const finalAlpha = binarySearchAlpha(0, 1, foregroundColor, backgroundColor, threshold, precision);

    foregroundColor.alpha = finalAlpha;
    const finalColor = flattenAlpha(foregroundColor, backgroundColor);
    const finalContrast = Math.abs(finalColor.contrast(backgroundColor, algorithm));

    this.setOutput("alpha", finalAlpha);
    this.setOutput("color", finalColor.to('srgb').toString({ format: 'hex' }));
    this.setOutput("contrast", finalContrast);
  }
}
