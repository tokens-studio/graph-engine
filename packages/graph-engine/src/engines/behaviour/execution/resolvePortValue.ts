import { Assert } from '@/Assert.js';
import { BehaviourNode } from '../types/behaviorNode.js';
import { Engine } from './engine.js';
import { Port } from '@/programmatic/port.js';
import { isFunctionNode } from '../types/utils.js';

export function resolvePortValue(
  engine: Engine,
  inputPort: Port<BehaviourNode>
): number {
  // if it has no edges, leave value on input Port alone.
  if (inputPort._edges.length === 0) {
    return 0;
  }

  const nodes = engine.nodes;

  const upstreamLink = inputPort._edges[0];
  // caching the target node + Port here increases engine performance by 8% on average.  This is a hotspot.
  if (
    upstreamLink.target === undefined ||
    upstreamLink.targetHandle === undefined
  ) {
    Assert.mustBeTrue(inputPort._edges.length === 1);

    // if upstream node is an eval, we just return its last value.
    upstreamLink._targetNode = nodes[upstreamLink.nodeId];
    // what is inputPort connected to?
    upstreamLink._targetPort = upstreamLink._targetNode.outputs.find(
      (Port) => Port.name === upstreamLink.PortName
    );
    if (upstreamLink._targetPort === undefined) {
      throw new Error(
        `can not find Port with the name ${upstreamLink.PortName}`
      );
    }
  }

  const upstreamNode = upstreamLink.source;
  const upstreamOutputPort = upstreamLink.sourceHandle;

  // if upstream is a flow/event/async node, do not evaluate it rather just use its existing output Port values
  if (!isFunctionNode(upstreamNode)) {
    inputPort.value = upstreamOutputPort.value;
    return 0;
  }

  let executionSteps = 0;

  if (isFunctionNode(upstreamNode)) {
    // resolve all inputs for the upstream node (this is where the recursion happens)
    // TODO: This is a bit dangerous as if there are loops in the graph, this will blow up the stack
    for (const upstreamInputPort of upstreamNode.inputs) {
      executionSteps += resolvePortValue(engine, upstreamInputPort);
    }

    engine.onNodeExecutionStart.emit(upstreamNode);
    upstreamNode.exec(upstreamNode);
    executionSteps++;
    engine.onNodeExecutionEnd.emit(upstreamNode);

    // get the output value we wanted.
    inputPort.value = upstreamOutputPort.value;
    return executionSteps;
  }

  return 0;
}
