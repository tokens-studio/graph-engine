import { NodeTypes } from "@/types.js";
import { AnyArraySchema, NumberSchema } from "@/schemas/index.js";
import SubgraphNode from "./subgraph";
import { annotatedDynamicInputs, hideFromParentSubgraph } from "@/annotations";
import { ToInput, ToOutput } from "@/programmatic";

export default class ArraySubgraph<T, V> extends SubgraphNode {
  static title = "Array Map";
  static type = NodeTypes.ARRAY;
  static description = "Allows you to map an array of items";

  declare inputs: ToInput<{
    array: T[];
  }>

  declare outputs: ToOutput<{
    value: V
  }>

  constructor(props) {
    super(props);

    this.annotations[annotatedDynamicInputs] = true;

    //Create the hardcoded input values in the innergraph
    const input = Object.values(this._innerGraph.nodes).find((x) => x.factory.type === NodeTypes.INPUT);

    if (!input) throw new Error("No input node found in subgraph");

    input.addInput("value", {
      type: AnyArraySchema,
      visible: false,
      annotations: {
        "ui.editable": false,
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
  }

  async execute() {
    const input = this.getRawInput("array");
    const output = await Promise.all(
      (input.value as any[]).map(async (item) => {
        const result = await this._innerGraph.execute();
        if (!result.output) throw new Error("No output from subgraph");
        return result.output.value;
      })
    );

    this.setOutput("value", output, input.type);
  }
}
