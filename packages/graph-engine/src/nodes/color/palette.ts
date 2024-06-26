// src/nodes/color/paletteGenerator.ts

import { ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { ToInput, ToOutput } from "../../programmatic";
import Color from "colorjs.io";

enum PaletteType {
  MONOCHROMATIC = "monochromatic",
  COMPLEMENTARY = "complementary",
  ANALOGOUS = "analogous",
  TRIADIC = "triadic"
}

export default class ColorPaletteGeneratorNode extends Node {
  static title = "Palette";
  static type = "studio.tokens.color.paletteGenerator";
  static description = "Generates a color palette based on a base color and palette type";

  declare inputs: ToInput<{
    baseColor: string;
    paletteType: PaletteType;
    numberOfColors: number;
  }>;

  declare outputs: ToOutput<{
    palette: string[];
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("baseColor", {
      type: {
        ...ColorSchema,
        default: "#2255ff",
      },
    });
    this.addInput("paletteType", {
      type: {
        ...StringSchema,
        enum: Object.values(PaletteType),
        default: PaletteType.MONOCHROMATIC,
      },
    });
    this.addInput("numberOfColors", {
      type: {
        ...NumberSchema,
        default: 5,
      },
    });

    this.addOutput("palette", {
      type: {
        type: "array",
        items: ColorSchema,
      },
    });
  }

  execute(): void | Promise<void> {
    const { baseColor, paletteType, numberOfColors } = this.getAllInputs();

    let palette: string[];

    switch (paletteType) {
      case PaletteType.MONOCHROMATIC:
        palette = this.generateMonochromatic(baseColor, numberOfColors);
        break;
      case PaletteType.COMPLEMENTARY:
        palette = this.generateComplementary(baseColor, numberOfColors);
        break;
      case PaletteType.ANALOGOUS:
        palette = this.generateAnalogous(baseColor, numberOfColors);
        break;
      case PaletteType.TRIADIC:
        palette = this.generateTriadic(baseColor, numberOfColors);
        break;
      default:
        throw new Error(`Unsupported palette type: ${paletteType}`);
    }

    this.setOutput("palette", palette);
  }

  private generateMonochromatic(baseColor: string, count: number): string[] {
    const base = new Color(baseColor);
    const lightness = base.oklch.l;
    return Array.from({ length: count }, (_, i) => {
      const newLightness = lightness + (i / (count - 1) - 0.5) * 0.6; // Adjust range as needed
      return new Color("oklch", [Math.max(0, Math.min(1, newLightness)), base.oklch.c, base.oklch.h]).toString({format: "hex"});
    });
  }

  private generateComplementary(baseColor: string, count: number): string[] {
    const base = new Color(baseColor);
    const complement = new Color("oklch", [base.oklch.l, base.oklch.c, (base.oklch.h + 180) % 360]);
    return this.interpolateColors(base, complement, count);
  }

  private generateAnalogous(baseColor: string, count: number): string[] {
    const base = new Color(baseColor);
    const color1 = new Color("oklch", [base.oklch.l, base.oklch.c, (base.oklch.h - 30 + 360) % 360]);
    const color2 = new Color("oklch", [base.oklch.l, base.oklch.c, (base.oklch.h + 30) % 360]);
    return this.interpolateColors(color1, base, color2, count);
  }

  private generateTriadic(baseColor: string, count: number): string[] {
    const base = new Color(baseColor);
    const color1 = new Color("oklch", [base.oklch.l, base.oklch.c, (base.oklch.h + 120) % 360]);
    const color2 = new Color("oklch", [base.oklch.l, base.oklch.c, (base.oklch.h + 240) % 360]);
    return this.interpolateColors(base, color1, color2, count);
  }

  private interpolateColors(...args: (Color | string | number)[]): string[] {
    const colors = args.slice(0, -1) as Color[];
    const count = args[args.length - 1] as number;
    
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      const interpolated = this.interpolate(colors, t);
      return interpolated.toString({format: "hex"});
    });
  }

  private interpolate(colors: Color[], t: number): Color {
    if (colors.length === 1) return colors[0];
    if (colors.length === 2) {
      const [c1, c2] = colors;
      return new Color("oklch", [
        c1.oklch.l + (c2.oklch.l - c1.oklch.l) * t,
        c1.oklch.c + (c2.oklch.c - c1.oklch.c) * t,
        c1.oklch.h + (((c2.oklch.h - c1.oklch.h + 540) % 360) - 180) * t
      ]);
    }
    
    const segment = (colors.length - 1) * t;
    const index = Math.floor(segment);
    const segmentT = segment - index;
    return this.interpolate([colors[index], colors[index + 1]], segmentT);
  }
}