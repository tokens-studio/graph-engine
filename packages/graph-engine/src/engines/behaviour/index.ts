import { CustomEvent } from "./customEvents/customEvents.js";
import { Graph } from "../../graph/index.js";
import { SerializedBehaviourGraph } from "./types/serialized.js";
import { Variable } from "./variable.js";



export class BehaviourGraph extends Graph {

    readonly variables: { [name: string]: Variable } = {};
    readonly customEvents: { [id: string]: CustomEvent } = {};

    override serialize(): SerializedBehaviourGraph {

        const base = super.serialize() as SerializedBehaviourGraph;

        base.variables = Object.keys(this.variables).map(([name, variable]) => {
            return {
                name: name,
                value: variable.get(),
                type: variable.valueTypeName
            }
        });

        return base;
    }
}

