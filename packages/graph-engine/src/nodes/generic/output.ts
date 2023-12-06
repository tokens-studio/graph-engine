/**
 * Acts as an output node for the graph. There can only be a single output node per graph.
 *
 * @packageDocumentation
 */

import { Input, Node,Output  } from "@/index.js";
import { NodeTypes } from "../../types.js";
import { z } from 'zod';

const type = NodeTypes.OUTPUT;

const AnySchema = z.array(z.number());


export class OutputNode extends Node {

  description = "Allows you to expose outputs of the node"
  type = type
  inputs = {
    value: new Input<typeof AnySchema>({
      type: AnySchema
    })
  }
  output = {
    value: new Output<typeof AnySchema>({
      type: AnySchema
    })
  }

  execute(): void {

    this.output.value.set(this.inputs.value.get(), );
  }

}
