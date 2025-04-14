import { FlowtraceJson } from "flowtrace/dist/lib/Flowtrace"

export type Start = {
    /**
     * access token to authorize the client
     */
    secret?: string,
    /**
     * Graph identifier the message targets
     */
    graph: string,
    /**
     * Size of tracing buffer to keep. In bytes
     */
    buffersize: number,
}

export type Stop = {
    /**
     * access token to authorize the client
     */
    secret?: string,
    /**
     * Graph identifier the message targets
     */
    graph: string,
}

export type Dump = {
    /**
     * String describing type of trace.
     */
    type: string,
    /**
     * Graph identifier the message targets
     */
    graph: string,
    /**
     * A Flowtrace file of `type`
     */
    flowtrace: FlowtraceJson
}

/**
 * Clear current tracing buffer.
 */
export type Clear = {
    /**
     * access token to authorize the client
     */
    secret?: string,
    /**
     * Graph identifier the message targets
     */
    graph: string,
}

/**
 * Error response to a command on trace protoco
 */
export type Error = {
    /**
     * Error message describing what went wrong
     */
    message: string
}