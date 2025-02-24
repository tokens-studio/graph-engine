import { BehaviourGraph } from "../index.js";
import { Engine } from "../execution/engine.js";
import { Node } from "@/programmatic/node.js";

export enum NodeType {
    Event = 'Event',
    Flow = 'Flow',
    Async = 'Async',
    Function = 'Function'
}


export class BehaviourNode extends Node<BehaviourGraph> {
    behaviourType: NodeType = NodeType.Flow;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override dispose(engine: Engine): void {
        // Add your dispose logic here
    };
}