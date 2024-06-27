// src/nodes/array/randomSelection.ts

import { AnySchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { ToInput, ToOutput } from "../../programmatic";
import { arrayOf } from "../../schemas/utils.js";

export default class RandomSelectionNode extends Node {
  static title = "Random Selection";
  static type = "studio.tokens.array.randomSelection";
  static description = "Randomly selects one item from an array";

  declare inputs: ToInput<{
    items: any[];
    seed?: string;
  }>;

  declare outputs: ToOutput<{
    selected: any;
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("items", {
      type: arrayOf(AnySchema),
    });
    this.addInput("seed", {
      type: StringSchema,
      visible: false,
    });

    this.addOutput("selected", {
      type: AnySchema,
    });
  }

  execute(): void | Promise<void> {
    const { items, seed } = this.getAllInputs();
    const itemsInput = this.getRawInput("items");

    if (!Array.isArray(items) || items.length === 0) {
      this.setOutput("selected", null);
      return;
    }

    const selected = this.selectRandomItem(items, seed);
    
    // Infer the type from the items input
    const itemType = itemsInput.type.items;
    this.setOutput("selected", selected, itemType);
  }

  private selectRandomItem(items: any[], seed?: string): any {
    let random: () => number;

    if (seed) {
      random = this.createSeededRandom(seed);
    } else {
      random = Math.random;
    }

    const index = Math.floor(random() * items.length);
    return items[index];
  }

  private createSeededRandom(seed: string): () => number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return () => {
      const x = Math.sin(hash++) * 10000;
      return x - Math.floor(x);
    };
  }
}