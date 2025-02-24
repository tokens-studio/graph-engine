import { BehaviourNode, NodeType } from "./behaviorNode.js";
import { Engine } from "../execution/engine.js";
import { Fiber } from "../execution/fiber.js";
import { Node } from "@/programmatic/node.js";


export interface IFlowNode extends BehaviourNode {
    behaviourType: NodeType.Flow;
    triggered: (fiber: Fiber, triggeringSocketName: string) => void;
}

export interface IFunctionNode extends BehaviourNode {
    behaviourType: NodeType.Function;
    exec: (node: Node) => void;
}

export interface IEventNode extends BehaviourNode {
    behaviourType: NodeType.Event;
    init: (engine: Engine) => void;
    dispose: (engine: Engine) => void;
}
export interface IAsyncNode extends BehaviourNode {
    behaviourType: NodeType.Async;
    triggered: (
        engine: Engine,
        triggeringSocketName: string,
        finished: () => void
    ) => void;
    dispose: () => void;
}



export const isFlowNode = (node: BehaviourNode): node is IFlowNode =>
    node.behaviourType === NodeType.Flow;

export const isEventNode = (node: BehaviourNode): node is IEventNode =>
    node.behaviourType === NodeType.Event;

export const isAsyncNode = (node: BehaviourNode): node is IAsyncNode =>
    node.behaviourType === NodeType.Async;

export const isFunctionNode = (node: BehaviourNode): node is IFunctionNode =>
    node.behaviourType === NodeType.Function;
