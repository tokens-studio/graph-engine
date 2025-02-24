import { Assert } from "@/assert.js";
import { BehaviourNode } from "../types/behaviorNode.js";
import { Edge } from "@/programmatic/edge.js";
import { Engine } from "./engine.js";
import { isAsyncNode, isFlowNode } from "../types/utils.js";
import { resolvePortValue } from "./resolvePortValue.js";

export class Fiber {
  private readonly fiberCompletedListenerStack: (() => void)[] = [];
  private readonly nodes: BehaviourNode[];
  public executionSteps = 0;

  constructor(
    public engine: Engine,
    public nextEval: Edge | null,
    fiberCompletedListener: (() => void) | undefined = undefined
  ) {
    this.nodes = engine.nodes;
    if (fiberCompletedListener !== undefined) {
      this.fiberCompletedListenerStack.push(fiberCompletedListener);
    }
  }

  /**
   * 
   * @param node The calling originating node that is committing to a new fiber
   * @param outputPortName  The name of the output port that the fiber is committing to
   * @param fiberCompletedListener  A callback that is invoked when the fiber is completed
   */
  commit(
    node: BehaviourNode,
    outputPortName: string,
    fiberCompletedListener: (() => void) | undefined = undefined
  ) {
    Assert.mustBeTrue(isFlowNode(node));
    Assert.mustBeTrue(this.nextEval === null);

    const outputPort = node.outputs[outputPortName];
    if (!outputPort) {
      throw new Error(`can not find Port with the name ${outputPortName}`);
    }

    if (outputPort._edges.length > 1) {
      throw new Error(
        'invalid for an output flow Port to have multiple downstream links:' +
        `${node.nodeType}.${outputPort.name}#${node.id} has ${outputPort._edges.length} downlinks`
      );
    }
    if (outputPort._edges.length === 1) {
      const edge = outputPort._edges[0];
      if (!edge) {
        throw new Error('edge must be defined');
      }
      this.nextEval = edge;
    }

    if (fiberCompletedListener !== undefined) {
      this.fiberCompletedListenerStack.push(fiberCompletedListener);
    }
  }

  /**
   * Actually executes the next step in the fiber
   * @returns 
   */
  executeStep(): void {
    // pop the next node off the queue
    const edge = this.nextEval;
    this.nextEval = null;

    // nothing waiting, thus go back and start to evaluate any callbacks, in stack order.
    if (edge === null) {
      if (this.fiberCompletedListenerStack.length === 0) {
        return;
      }
      const awaitingCallback = this.fiberCompletedListenerStack.pop();
      awaitingCallback?.();
      return;
    }

    //Otherwise we have processing to do
    //Get the next node to evaluate
    const node = this.nodes[edge.target];

    node.inputs.forEach((inputPort) => {
      if (inputPort.valueTypeName !== 'flow') {
        this.executionSteps += resolvePortValue(this.engine, inputPort);
      }
    });

    // first resolve all input values
    // flow Port is set to true for the one flowing in, while all others are set to false.
    this.engine.onNodeExecutionStart.emit(node);
    if (isAsyncNode(node)) {
      this.engine.asyncNodes.push(node);
      node.triggered(this.engine, link.PortName, () => {
        // remove from the list of pending async nodes
        const index = this.engine.asyncNodes.indexOf(node);
        this.engine.asyncNodes.splice(index, 1);
        this.engine.onNodeExecutionEnd.emit(node);
        this.executionSteps++;
      });
      return;
    }
    if (isFlowNode(node)) {
      node.triggered(this, edge.nma);
      this.engine.onNodeExecutionEnd.emit(node);
      this.executionSteps++;
      return;
    }

    throw new TypeError(
      `should not get here, unhandled node ${node.nodeType}#${node.id}`
    );
  }

  /**
   * Returns a boolean representing whether the fiber is completed and has no more nodes to evaluate
   * @returns 
   */
  isCompleted() {
    return (
      this.fiberCompletedListenerStack.length === 0 && this.nextEval === null
    );
  }
}
