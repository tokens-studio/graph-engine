import { NodeTypes } from "../../types.js";
import { AnyArraySchema, AnySchema, NumberSchema, SchemaObject } from "../../schemas/index.js";
import SubgraphNode from "../generic/subgraph.js";
import { annotatedDynamicInputs, hideFromParentSubgraph } from "../../annotations/index.js";
import { Input, ToInput, ToOutput } from "../../programmatic/index.js";
import { extractArray } from "../../schemas/utils.js";

export default class ArraySubgraph<T, V> extends SubgraphNode {
  static title = "Array Map";
  static type = 'tokens.studio.array.map';
  static description = "Allows you to map an array of items";

  declare inputs: ToInput<{
    array: T[];
  }>

  declare outputs: ToOutput<{
    value: V
  }>

  constructor(props) {
    super(props);

    //Create the hardcoded input values in the innergraph
    const input = Object.values(this._innerGraph.nodes).find((x) => x.factory.type === NodeTypes.INPUT);

    if (!input) throw new Error("No input node found in subgraph");

    input.annotations[annotatedDynamicInputs] = true;

    input.addInput("value", {
      type: AnySchema,
      visible: false,
      annotations: {
        "ui.editable": false,
        "ui.hidden": true,
        [hideFromParentSubgraph]: true
      }
    });

    //Do not allow these to be edited 
    input.addInput("index", {
      type: NumberSchema,
      visible: false,
      annotations: {
        "ui.editable": false,
        [hideFromParentSubgraph]: true
      }
    });


    this.addInput("array", {
      type: AnyArraySchema,
      visible: true,
    });
    this.inputs["array"].annotations["ui.editable"] = false

    this.addOutput("value", {
      type: AnyArraySchema,
      visible: true,
    });
  }

  async execute() {
    const input = this.getRawInput("array");

    const otherInputs: [string, Input<any>][] = Object.keys(this.inputs).filter(x => x !== "array").map(x => [x, this.getRawInput(x)]);
    const other = Object.fromEntries(otherInputs.map(([name, x]) => [name, {
      value: x.value,
      type: x.type
    }]));

    //Todo optimize this to run in parallel. We have to run this in series because the inner graph is not designed to run in parallel

    const output = await (input.value as any[]).reduce(async (acc, item, i) => {

      const output = await acc;



      const result = await this._innerGraph.execute({
        //By default this is any so we need to overwrite it with its runtime type
        inputs: {
          value: {
            value: item,
            type: extractArray(input.type)
          },
          index: {
            value: i
          },
          ...other
        }
      });

      if (!result.output) throw new Error("No output from subgraph");
      return output.concat([result.output]);
    }, Promise.resolve([]));

    const flattened = output.map(x => x.value);

    const type = output.length > 0 ? output[0].type : input.type;

    const { title } = type;

    const dynamicTypeSchema: SchemaObject = {
      title,
      //Override the type
      type: 'array',
      items: type
    }

    this.setOutput("value", flattened, dynamicTypeSchema);
  }
}
