import { AnySchema, BooleanSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";

export enum Operator {
  EQUAL = "==",
  NOT_EQUAL = "!=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  GREATER_THAN_OR_EQUAL = ">=",
  LESS_THAN_OR_EQUAL = "<=",
}

export default class NodeDefinition<T> extends Node {
  static title = "Compare";
  static type = "studio.tokens.logic.compare";
  static description =
    "Compare node allows you to compare two values using multiple operators.";

  declare inputs: ToInput<{
    a: T,
    b: T,
    operator: Operator
  }>
  declare outputs: ToOutput<{
    value: boolean
  }>

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: AnySchema,
    });
    this.addInput("b", {
      type: AnySchema,
    });
    this.addInput("operator", {
      type: {
        ...StringSchema,
        enum: Object.values(Operator),
        default: Operator.EQUAL,
      },
    });

    this.addOutput("value", {
      type: BooleanSchema,
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
        break;
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
