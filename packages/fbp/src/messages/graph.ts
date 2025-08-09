import { PositionMetadata } from "../interfaces/metadata"
import { TypeDefinition } from "@tokens-studio/graph-engine"

/**
 * Initialize an empty graph.
 */
export type Clear = {
    /**
     * identifier for the graph being created. Used for all subsequent messages related to the graph instance
     */
    id: string,
    /**
     * Human-readable label for the graph
     */
    name: string,
    /**
     * Component library identifier
     */
    library: string,
    /**
     * Identifies the graph as a main graph of a project that should not be registered as a component Graphs registered in this way should also be available for use as subgraphs in other graphs. Therefore a graph registration and later changes to it may cause component messages of the Component protocol to be sent back to the client informing of possible changes in the ports of the subgraph component.
     */
    main: boolean,
    icon?: string,
    description?: string,
    secret?: string

}

/**
 * Add node to a graph. 
 */
export type AddNode = {
    /**
     * identifier for the node being created. Used for all subsequent messages related to the node instance
     */
    id: string,
    /**
     * Component identifier
     */
    component: string,
    /**
     * graph the action targets
     */
    graph: string,
    /**
     * Metadata object
     */
    metadata: PositionMetadata,
    /**
     * access token to authorize the client
     */
    secret?: string
}

export type RemoveEdge = {
    graph: string,
    secret?: string,
    src: {
        node: string,
        port: string,
        index?: number
    },
    tgt: {
        node: string,
        port: string,
        index?: number
    }
}

/**
 * Remove a node from a graph.
 */
export type RemoveNode = {
    /**
     * identifier for the node being removed
     */
    id: string,
    /**
     * graph the action targets
     */
    graph: string,
    /**
     * access token to authorize the client
     */
    secret?: string
}

/**
 * Change the ID of a node in the graph
 */
export type RenameNode = {
    /**
     * original identifier for the node
     */
    from: string,
    /**
     * new identifier for the node
     */
    to: string,
    /**
     * graph the action targets
     */
    graph: string,
    /**
     * access token to authorize the client
     */
    secret?: string
}

export type ChangeNode = {
    id: string,
    graph: string,
    secret?: string,
    /**
     * All the metadata to be applied to the node. This needs to be atomic, meaning that all metadata should be applied at once
     */
    metadata: object

}

export type Error = {
    message: string
}

export type AddInport = {
    /**
     * The exported name of the port
     */
    public: string,
    /**
     * The node ID
     */
    node: string,
    /**
     * Internal port name
     */
    port: string,
    metadata: TypeDefinition,

    graph: string,
    secret?: string
}

export type AddEdge = {
    graph: string,
    secret?: string,

    src: {
        node: string,
        port: string,
        index?: number
    },
    tgt: {
        node: string,
        port: string,
        index?: number
    },
    metadata: unknown
}

/**
 * Remove an exported port from the graph
 */
export type RemoveInport = {
    public: string,
    graph: string,
    secret?: string
}

/**
 * Add an exported outport to the graph
 */
export type AddOutport ={
    public: string,
    /**
     * @deprecated
     * Not in our implementation
     */
    node: string,
    port: string,
    metadata: TypeDefinition,
    graph:string,
    secret?: string
}

export type RemoveOutport = {
    public:string,
    graph: string,
    secret?: string   
}

/**
 * Adds an initial data packet to the graph
 */
export type AddInitial = {
    graph: string,
    metadata:{
        /**
         * Route identifier of a graph entity
         * @deprecated
         */
        route: number,
        /**
         * JSON schema associated with a graph entity.
         * Note that the original FPB spec specifies this as a string, but we pass through the json object
         * @overload
         */
        schema: object,
        /**
         * @deprecated
         * Whether graph entity data should be treated as secure
         */
        secure: boolean
    },
    /**
     * source data for the edge
     */
    src:{
        data:unknown,
    },
    /**
     * target node/port for the edge
     */
    tgt:{
        node:string,
        port:string
        index?:number
    },
    secret?: string 

}