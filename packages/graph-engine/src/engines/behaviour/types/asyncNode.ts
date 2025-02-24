import { BehaviourNode } from "./behaviorNode.js";
import { Engine } from "../execution/engine.js";

export abstract class AbstractAsyncNode extends BehaviourNode {

    abstract triggered(
        engine: Engine,
        triggeringSocketName: string,
        finished: () => void
    )

}

export class AsyncNode extends AbstractAsyncNode {
    triggered = (
        engine: Pick<Engine, 'commitToNewFiber'>,
        triggeringPortName: string,
        finished: () => void
    ) => {
        this.triggeredInner({
            read: this.readInput,
            write: this.writeOutput,
            commit: (outFlowname, fiberCompletedListener) =>
                engine.commitToNewFiber(this, outFlowname, fiberCompletedListener),
            // configuration: this.configuration,
            graph: this.getGraph(),
            finished,
            triggeringPortName
        });
    };
}
