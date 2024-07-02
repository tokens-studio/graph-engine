// src/nodes/logic/isEmpty.ts

import { AnySchema, BooleanSchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { ToInput, ToOutput } from "../../programmatic";

export default class IsEmptyNode extends Node {
  static title = "Is Empty";
  static type = "studio.tokens.logic.isEmpty";
  static description = "Checks if the input is empty and outputs input if not, otherwise fallback value";

  declare inputs: ToInput<{
    input: any;
    ifEmpty: any;
    ifNotEmpty: any;
  }>;

  declare outputs: ToOutput<{
    result: any;
    isEmpty: boolean;
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("input", {
      type: AnySchema,
    });
    this.addInput("fallback", {
      type: AnySchema,
    });

    this.addOutput("result", {
      type: AnySchema,
    });
    this.addOutput("isEmpty", {
      type: BooleanSchema,
    });
  }

  execute(): void | Promise<void> {
    const { input, fallback } = this.getAllInputs();

    const isEmpty = this.checkIsEmpty(input);

    this.setOutput("isEmpty", isEmpty);
    this.setOutput("result", isEmpty ? fallback : input);
  }

  private checkIsEmpty(value: any): boolean {
    if (value == null) return true;
    if (typeof value === "string") return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
  }
}