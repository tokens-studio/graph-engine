import { ComponentProtocol } from "../protocol/component"
import { Context } from "./context"
import { Graph } from "@tokens-studio/graph-engine"
import { GraphProtocol } from "../protocol/graph"
import { Loader } from "./loader"
import { NetworkProtocol } from "../protocol/network"
import { RuntimeProtocol } from "../protocol/runtime"
import { TraceProtocol } from "../protocol/trace"



export interface TransportConfig {
    /**
 * A lookup of permissions for each user
 */
    permissions?: Record<string, string[]>,
    defaultGraph?: Graph

    defaultPermissions?: string[],
    capabilities?: string[],
    loader: Loader
    /**
     * Runtime ID
     */
    id?: string,
    /**
     * Type of Transport
     */
    type?: string,
    /**
     * Human readable label 
     */
    label?: string,
    /**
     * Optional namespace
     */
    namespace?: string,
    /**
     * Optional repository
     */
    repository?: string,

    repositoryVersion?: string

}

export interface Transport {

    options: TransportConfig,
    component: ComponentProtocol,
    runtime: RuntimeProtocol,
    trace: TraceProtocol,
    network: NetworkProtocol,
    graph: GraphProtocol,

    version: string,

    send(type: string, topic: string, data: unknown, context: Context): void
    sendAll(type: string, topic: string, data: unknown, context?: Context): void

    canDo(capability: string, secret?: string)
}