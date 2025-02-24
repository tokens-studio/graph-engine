import { Assert } from '@/assert.js';
import { BehaviourNode } from '../types/behaviorNode.js';
import { EventEmitter } from '../eventEmitter.js';
import { Fiber } from './fiber.js';
import { IAsyncNode, IEventNode, isAsyncNode, isEventNode } from '../types/utils.js';
import { Node } from '@/programmatic/node.js';
import { resolvePortValue } from './resolvePortValue.js';
import { sleep } from '../utils/sleep.js';

export class Engine {
  // tracking the next node+input Port to execute.
  private readonly fiberQueue: Fiber[] = [];
  /**
   * Tracks all async nodes that are currently in progress.
   */
  public readonly asyncNodes: IAsyncNode[] = [];
  public readonly eventNodes: IEventNode[] = [];
  public readonly onNodeExecutionStart = new EventEmitter<Node>();
  public readonly onNodeExecutionEnd = new EventEmitter<Node>();
  public executionSteps = 0;

  constructor(public readonly nodes: BehaviourNode[]) {
    // collect all event nodes
    Object.values(nodes).forEach((node) => {
      if (isEventNode(node)) {
        this.eventNodes.push(node);
      }
    });
    // init all event nodes at startup
    this.eventNodes.forEach((eventNode) => {
      // evaluate input parameters
      Object.values(eventNode.inputs).forEach((inputPort) => {
        Assert.mustBeTrue(inputPort.valueTypeName !== 'flow');
        this.executionSteps += resolvePortValue(this, inputPort);
      });

      this.onNodeExecutionStart.emit(eventNode);
      eventNode.init(this);
      this.executionSteps++;
      this.onNodeExecutionEnd.emit(eventNode);
    });
  }

  dispose() {
    // dispose all, possibly in-progress, async nodes
    this.asyncNodes.forEach((asyncNode) => asyncNode.dispose());

    // dispose all event nodes
    this.eventNodes.forEach((eventNode) => eventNode.dispose(this));
  }

  /**
   * 
   * @param node The calling originating node that is committing to a new fiber
   * @param outputFlowPortName The name of the output port that the fiber is committing to
   * @param fiberCompletedListener A callback that is invoked when the fiber is completed
   */
  commitToNewFiber(
    node: BehaviourNode,
    outputFlowPortName: string,
    fiberCompletedListener: (() => void) | undefined = undefined
  ) {
    Assert.mustBeTrue(isEventNode(node) || isAsyncNode(node));
    const outputPort = node.outputs[outputFlowPortName];
    if (outputPort === undefined) {
      throw new Error(`no Port with the name ${outputFlowPortName}`);
    }
    if (outputPort._edges.length > 1) {
      throw new Error(
        'invalid for an output flow Port to have multiple downstream links:' +
        `${node.nodeType}.${outputPort.name}#${node.id} has ${outputPort._edges.length} downlinks`
      );
    }
    if (outputPort._edges.length === 1) {
      const fiber = new Fiber(
        this,
        outputPort._edges[0],
        fiberCompletedListener
      );
      this.fiberQueue.push(fiber);
    }
  }

  /**
   * NOTE: This does not execute all if there are promises.
   * @param limitInSeconds 
   * @param limitInSteps 
   * @returns 
   */
  executeAllSync(limitInSeconds = 100, limitInSteps = 100000000): number {
    const startDateTime = Date.now();
    let elapsedSeconds = 0;
    let elapsedSteps = 0;
    while (
      elapsedSteps < limitInSteps &&
      elapsedSeconds < limitInSeconds &&
      this.fiberQueue.length > 0
    ) {
      const currentFiber = this.fiberQueue[0];
      const startingFiberExecutionSteps = currentFiber.executionSteps;
      currentFiber.executeStep();
      elapsedSteps += currentFiber.executionSteps - startingFiberExecutionSteps;
      if (currentFiber.isCompleted()) {
        // remove first element
        this.fiberQueue.shift();
      }
      elapsedSeconds = (Date.now() - startDateTime) * 0.001;
    }
    this.executionSteps += elapsedSteps;

    return elapsedSteps;
  }

  /**
   * 
   * @param limitInSeconds 
   * @param limitInSteps 
   * @returns 
   */
  async executeAllAsync(
    limitInSeconds = 100,
    limitInSteps = 100000000
  ): Promise<number> {
    const startDateTime = Date.now();
    let elapsedSteps = 0;
    let elapsedTime = 0;
    let iterations = 0;
    do {
      if (iterations > 0) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(0);
      }
      elapsedSteps += this.executeAllSync(
        limitInSeconds - elapsedTime,
        limitInSteps - elapsedSteps
      );
      elapsedTime = (Date.now() - startDateTime) * 0.001;
      iterations += 1;
    } while (
      (this.asyncNodes.length > 0 || this.fiberQueue.length > 0) &&
      elapsedTime < limitInSeconds &&
      elapsedSteps < limitInSteps
    );

    return elapsedSteps;
  }
}
