import { NodeTypes } from "@/types.js";
import { INodeDefinition, Node } from "@/programmatic/node.js";
import orderBy from "lodash.orderby";

import { AnyArraySchema, StringSchema } from "@/schemas/index.js";
import { Input } from "@/programmatic/input.js";

export enum Order {
  ASC = "asc",
  DESC = "desc",
}

export type NamedInput = {
  array: any[];
  order?: Order.ASC | Order.DESC; // Optional parameter to specify the sort order
  sortBy?: string; // Optional parameter to specify the property to sort by
};

export const defaults = {
  order: Order.ASC,
};
export default class NodeDefinition extends Node {
  static title = "Sort Array";
  static type = NodeTypes.SORT;

  declare inputs: {
    array: Input<any[]>;
    order: Input<Order>;
    sortBy: Input<string>;
  };

  static description = "Sorts an array";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: AnyArraySchema,
      visible: true,
    });
    this.addInput("order", {
      type: {
        ...StringSchema,
        enum: [Order.ASC, Order.DESC],
        default: Order.ASC,
      },
      visible: true,
    });
    this.addInput("sortBy", {
      type: StringSchema,
    });
    this.addOutput("value", {
      type: AnyArraySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { sortBy, order } = this.getAllInputs();
    const array = this.getRawInput("array");
    const sorted = orderBy(array.value, [sortBy], order);

    this.setOutput("value", sorted, array.type);
  }
}
