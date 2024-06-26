import { INodeDefinition } from "../../programmatic/node.js";
import { Node } from "../../programmatic/node.js";
import { ObjectSchema } from "../../schemas/index.js";
import { annotatedDynamicInputs } from '../../annotations/index.js';

/**
 * Similar to the Objectify node, this expects that inputs will be added to it dynamically.
 * Technically this performs the exact same function as the Objectify node, but it's more
 * convenient to have a node here that could use strong typing on the property names if need
 * be. Note that you should using something like the "mdn-data" package to get the list of
 * properties and their types. This is just a convenience node.
 */
export default class NodeDefinition extends Node {
  static title = "CSS Map";
  static type = "studio.tokens.css.map";



  static description =
    "Creates a map of CSS properties and their values.\n\nInputs: Various CSS properties (dynamically added)\nOutput: CSS object\n\nUse this node to collect and organize multiple CSS properties into a single object. Add inputs for each CSS property you want to include. Ideal for creating style objects, preparing data for CSS-in-JS solutions, or bundling multiple style properties for consistent application across your design system.";
  constructor(props: INodeDefinition) {
    super(props);

    //Indaicate that is uses dynamic inputs
    this.annotations[annotatedDynamicInputs] = true;
    this.addOutput("value", {
      type: ObjectSchema,
    });
  }

  execute(): void | Promise<void> {
    const inputs = this.getAllInputs();
    const output = Object.entries(inputs).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    this.setOutput("value", output);
  }
}
