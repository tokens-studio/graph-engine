import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema, BooleanSchema, StringSchema } from "@/schemas/index.js";

export enum Operator {
  EQUAL = "==",
  NOT_EQUAL = "!=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  GREATER_THAN_OR_EQUAL = ">=",
  LESS_THAN_OR_EQUAL = "<=",
}

export default class NodeDefinition extends Node {
  static title = "Compare";
  static type = NodeTypes.COMPARE;
  static description =
    "Compare node allows you to compare two values using multiple operators.";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: AnySchema,
      visible: true,
    });
    this.addInput("b", {
      type: AnySchema,
      visible: true,
    });
    this.addInput("operator", {
      type: {
        ...StringSchema,
        enum: Object.values(Operator),
        default: Operator.EQUAL,
      },
      visible: true,
    });

    this.addOutput("value", {
      type: BooleanSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { operator, a, b } = this.getAllInputs();

    let answer = false;
    switch (operator) {
      case Operator.EQUAL:
        answer = a === b;
        break;
      case Operator.NOT_EQUAL:
        answer = a !== b;
        break;
      case Operator.GREATER_THAN:
        answer = a > b;
        break;
      case Operator.LESS_THAN:
        answer = a < b;
      case Operator.GREATER_THAN_OR_EQUAL:
        answer = a >= b;
        break;
      case Operator.LESS_THAN_OR_EQUAL:
        answer = a <= b;
        break;
    }

    this.setOutput("value", answer);
  }
}
