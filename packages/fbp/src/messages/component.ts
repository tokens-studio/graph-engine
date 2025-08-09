export type Error = {
    message: string
}

/**
 * Request for the source code of a given component. Will be responded with a `source` message.
 */
export type GetSource = {
    /**
     * Name of the component to for which to get source code.Should contain the library prefix
     * @example studio.tokens.generic.input
     */
    name: string,
    secret?: string
}

/**
 * Source code for a component. In cases where a runtime receives a `source` message, it should do whatever operations are needed for making that component available for graphs, including possible compilation.
 */
export type Source = {
    name: string,
    /**
     * The programming language used for the component code
     */
    language: string,
    /**
     * Component library identifier
     * 
     * Note that we diverge from the initial FBP spec here. This is the name of the npm package that contains the component. 
     */
    library: string,

    code: string,
    tests: string
}


export type Component = {

    name: string,
    description: string,
    icon?: string,
    subgraph?: boolean,
    inPorts: {
        id: string,
        type: string,
        schema: string,
        required: boolean,
        addressable: boolean,
        description:       string,
        /**
         * @deprecated
         */
        values?: unknown[],
        default:unknown
    }[],
    outPorts: {
        id: string,
        type: string,
        schema: string,
        required: boolean,
        addressable: boolean,
        description: string,
        /**
         * @deprecated
         */
        values?: unknown[],
        default: unknown
    }[]
}


export type ComponentsReady ={
    //Nothing at the moment
}