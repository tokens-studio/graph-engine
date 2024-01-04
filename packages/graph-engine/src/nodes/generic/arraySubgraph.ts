import { NodeTypes } from "@/types.js";
import { AnyArraySchema } from "@/schemas/index.js";
import SubgraphNode from "./subgraph";

export default class ArraySubgraph extends SubgraphNode {
  static title = "Array Map";
  static type = NodeTypes.ARRAY;
  static description = "Allows you to map an array of items";

  constructor(props) {
    super(props);

    this.addInput("array", {
      type: AnyArraySchema,
      visible: true,
    });
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
