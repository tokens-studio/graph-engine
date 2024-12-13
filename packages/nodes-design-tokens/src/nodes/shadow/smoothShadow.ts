import { Black } from '@tokens-studio/graph-engine';
import { BoxShadowTypes } from '@tokens-studio/types';
import { ColorSchema, NumberSchema, Vec2Schema } from '@tokens-studio/graph-engine';
import { Color as ColorType } from '@tokens-studio/graph-engine';
import { INodeDefinition, Node, ToInput, ToOutput, Vec2 } from '@tokens-studio/graph-engine';
import { TokenBoxShadowSchema } from '../../schemas/index.js';
import { arrayOf } from '../../schemas/utils.js';
import { toColor, toColorObject } from '@tokens-studio/graph-engine';
import type { TokenBoxshadowValue } from '@tokens-studio/types';

// Helper functions
const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
const roundPixel = (num: number): number => Math.round(num * 10) / 10;
const roundTransparency = (num: number): number => Math.round(num * 1000) / 1000;

export default class NodeDefinition extends Node {
  static title = 'Smooth Shadow';
  static type = 'studio.tokens.shadow.smooth';
  static description = 'Generates a physically realistic smooth shadow with natural-looking depth.';

  declare inputs: ToInput<{
    distance: number;
    intensity: number;
    sharpness: number;
    color: ColorType;
    lightPosition: Vec2;
  }>;

  declare outputs: ToOutput<{
    shadows: TokenBoxshadowValue[];
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput('distance', {
      type: {
        ...NumberSchema,
        default: 100,
        minimum: 0,
        maximum: 1000
      }
    });

    this.addInput('intensity', {
      type: {
        ...NumberSchema,
        default: 0.4,
        minimum: 0,
        maximum: 1
      }
    });

    this.addInput('sharpness', {
      type: {
        ...NumberSchema,
        default: 0.7,
        minimum: 0,
        maximum: 1
      }
    });

    this.addInput('color', {
      type: {
        ...ColorSchema,
        default: Black
      }
    });

    this.addInput('lightPosition', {
      type: {
        ...Vec2Schema,
        default: { x: -0.35, y: -0.5 }
      }
    });

    this.addOutput('shadows', {
      type: arrayOf(TokenBoxShadowSchema)
    });
  }

  execute(): void {
    const { distance, intensity, sharpness, color, lightPosition } = this.getAllInputs();
    const baseColor = toColor(color);
    
    const layers = 6;
    const dx = -lightPosition[0];  // Using tuple access for Vec2
    const dy = -lightPosition[1];

    const shadowLayers = Array.from({ length: layers }).map((_, i) => {
      const t = i / (layers - 1);
      
      // Linear offset growth
      const x = roundPixel(dx * distance * t);
      const y = roundPixel(dy * distance * t);

      // Blur scales with distance and sharpness
      const baseBlur = distance * 0.2;
      const maxExtraBlur = distance * 0.8;
      const blur = roundPixel(baseBlur + maxExtraBlur * sharpness * t);
      
      // Alpha decreases outward
      const maxAlpha = 0.07 * intensity;
      const alpha = roundTransparency(maxAlpha * (1 - t));

      baseColor.alpha = alpha;
      const shadowColor = toColorObject(baseColor);

      return {
        type: BoxShadowTypes.DROP_SHADOW,
        x,
        y,
        blur,
        spread: 0,
        color: toColor(shadowColor).toString({ format: 'hex' })
      };
    });

    this.outputs.shadows.set(shadowLayers);
  }
} 