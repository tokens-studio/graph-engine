// src/nodes/logic/abTest.ts

import { AnySchema, BooleanSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { ToInput, ToOutput } from "../../programmatic";

export default class ABTestNode extends Node {
  static title = "A/B Test";
  static type = "studio.tokens.logic.abTest";
  static description = "Randomly selects between two options for A/B testing in design systems";

  declare inputs: ToInput<{
    optionA: any;
    optionB: any;
    weightA: number;
    seed: string;
    useWeights: boolean;
  }>;

  declare outputs: ToOutput<{
    result: any;
    isOptionA: boolean;
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("optionA", {
      type: AnySchema,
    });
    this.addInput("optionB", {
      type: AnySchema,
    });
    this.addInput("weightA", {
      type: {
        ...NumberSchema,
        default: 0.5,
        minimum: 0,
        maximum: 1,
      },
    });
    this.addInput("seed", {
      type: StringSchema,
    });
    this.addInput("useWeights", {
      type: {
        ...BooleanSchema,
        default: false,
      },
    });

    this.addOutput("result", {
      type: AnySchema,
    });
    this.addOutput("isOptionA", {
      type: BooleanSchema,
    });
  }

  execute(): void | Promise<void> {
    const { optionA, optionB, weightA, seed, useWeights } = this.getAllInputs();

    const isOptionA = this.selectOption(weightA, seed, useWeights);

    this.setOutput("result", isOptionA ? optionA : optionB);
    this.setOutput("isOptionA", isOptionA);
  }

  private selectOption(weightA: number, seed: string, useWeights: boolean): boolean {
    let random: number;

    if (seed) {
      // Use a simple hash function to generate a number from the seed
      const hash = this.hashCode(seed);
      random = (hash % 1000) / 1000; // Normalize to 0-1 range
    } else {
      random = Math.random();
    }

    if (useWeights) {
      return random < weightA;
    } else {
      return random < 0.5;
    }
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}