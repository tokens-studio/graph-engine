/**
 * Runtimes that can be used as remote subgraphs (i.e. ones that have reported supporting the protocol:runtime capability) need to be able to receive and transmit information packets at their exposed ports. These packets can be send from the client to the runtimes input ports, or from runtimes output ports to the client.
 */
export type Packet = {
    port: string,
    event: string,
    /**
     * The data type of the packet
     */
    type: string,
    /**
     * Link to JSON schema describing the format of the data
"https://example.net/schemas/person.json"
     */
    schema: string,
    graph: string,
    /**
     * payload for the packet. Used only with begingroup (for group names) and data packets
     */

    payload: unknown,
    secret?: string
}

export type GetRuntime = {
    secret?: string
}

export type Runtime = {
    /**
     * unique runtime ID. Must be a UUID, version 4 "f18a4924-9d4f-414d-a37c-cd24b39bba10"
     */
    id: string,
    /**
     * Human-readable description of the runtime
     */
    label?: string,
    /**
     * version of the runtime protocol that the runtime supports
     */
    version: string,
    /**
     * capability strings for things the runtime is able to do. May include things not permitted for this client.
     */
    allCapabilities?: string[],
    /**
     * capability strings for things the runtime is able to do for this client.
     */
    capabilities?: string[],
    /**
     * type of the runtime
     * @example "microflo"
     */
    type: string,
    /**
     * ID of the currently configured main graph running on the runtime, if any
     */
    graph: string,
    /**
     * Library namespace of the project running on the runtime, if any. Must match that of components belonging to the (top-level) of project.
     * @example "myproject"
     */
    namespace: string,
    /**
     * Source-code repository URL of the project running on the runtime, if any
     * @example "https://github.com/flowbased/fbp-protocol.git"
     */
    repository: string,
    /**
     * Unique version identifier of the source code of the project, if known. The version should be available in @repository.
     * @example "0.6.3-8-g90edcfc"
     */
    repositoryVersion: string
}

export type Ports = {
    graph: string,
    inPorts:{
        id:string,
        /**
         * Port data type
         */
        type:string,
        
        schema: string,
        required?: boolean,
        addressable?: boolean,
        description?: string,
        values?: unknown[]
        /**
         * default value for the port
         */
        default?: unknown

    }[],
    outPorts: {
        id: string,
        /**
         * Port data type
         */
        type: string,

        schema: string,
        required?: boolean,
        addressable?: boolean,
        description?: string,
        values?: unknown[]
        /**
         * default value for the port
         */
        default?: unknown

    }[]
}

export type Error = {
    message: string
}


/**
 * Confirmation that a packet has been sent
 */
export type PacketSent = {
    port: string,
    event: string,
    /**
     * The basic data type
     */
    type?: string,
    schema?: string,
    graph:string,
    payload: unknown
}