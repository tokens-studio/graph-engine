import { SerializedGraph } from "@/graph/types.js";


export type SerializedVariable = {
    name: string,
    value: any,
    type: string
}

export type SerializedCustomEvent= {
    /**
     * This is the name of the custom event intended for easy lookup
     */
    name: string,
    /**
     * This is the unique custom event ID
     */
    id:string
}

export type SerializedBehaviourGraph = SerializedGraph & {

    customEvents: SerializedCustomEvent[];
    variables: SerializedVariable[];
}