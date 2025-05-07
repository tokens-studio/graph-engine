import { ComponentProtocol } from './protocol/component';
import {
    EventEmitter,
} from 'events';
import { GraphProtocol } from './protocol/graph';
import { Network, NetworkProtocol } from './protocol/network';
import { RuntimeProtocol } from './protocol/runtime';
import { TraceProtocol } from './protocol/trace';
import { Transport, TransportConfig } from './interfaces/transport';


import { Context } from './interfaces/context';
import { Graph } from '@tokens-studio/graph-engine';
import { Loader } from './interfaces/loader';



export enum Protocol {
    GRAPH = 'graph',
    NETWORK = 'network',
    COMPONENT = 'component',
    TRACE = 'trace',
    RUNTIME = 'runtime'
}

export interface PayloadWithSecret {
    secret?: string
}

export type BaseTransportOptions = {
    capabilities?: string[],
    defaultPermissions?: string[],
    /**
     * A lookup of permissions for each user
     */
    permissions?: Record<string, string[]>,
    defaultGraph?: Graph
    loader: Loader

}

export type BaseEvents = {
    ready: (network?: Network) => void,
    error: (err:Error) => void,
}

export interface BaseTransportEvents {
    //Declare a strongly typed event emitter handler for 'on'
    on<T extends keyof BaseEvents>(event: T, listener: BaseEvents[T]): this;

    //Declare a strongly typed event emitter handler for 'emit'
    emit<T extends keyof BaseEvents>(event: T, ...args: Parameters<BaseEvents[T]>): boolean;

}


export class BaseTransport extends EventEmitter implements Transport, BaseTransportEvents {

    component: ComponentProtocol;
    graph: GraphProtocol;
    network: NetworkProtocol;
    runtime: RuntimeProtocol;
    trace: TraceProtocol;
    options: BaseTransportOptions;
    version: string;
    context: Context;

    constructor(options: BaseTransportOptions) {
        super();
        this.options = options ;   

        //This is important, as we currently are running on a slightly modified version than outlined in https://flowbased.github.io/fbp-protocol/#component-source
        this.version = '0.8';
        this.component = new ComponentProtocol(this);
        this.graph = new GraphProtocol(this);
        this.network = new NetworkProtocol(this);
        this.runtime = new RuntimeProtocol(this);
        this.trace = new TraceProtocol(this);
        this.context = null;


        if (!this.options.capabilities) {
            this.options.capabilities = [
                'protocol:graph',
                'protocol:component',
                'protocol:network',
                'protocol:runtime',
                'protocol:trace',
                'component:setsource',
                'component:getsource',
                'graph:readonly',
                'network:data',
                'network:control',
                'network:status',
            ];
        }

        if (!this.options.defaultPermissions) {
            // Default: no capabilities granted for anonymous users
            this.options.defaultPermissions = [];
        }

        if (!this.options.permissions) {
            this.options.permissions = {};
        }

        setTimeout(() => {
            this._startDefaultGraph();
        }, 0);
    }

    // Generate a name for the main graph
    getGraphName(graph: Graph): string {
        return (graph.annotations['engine.title'] || 'unknown') as string;
    }

    async _startDefaultGraph() {
        if (!this.options.defaultGraph) {
            this.emit('ready', null);
            return;
        }

        const graphId = this.options.defaultGraph.annotations['engine.id'] as string;
        try {
            await this.graph.registerGraph(graphId, this.options.defaultGraph, false);
            const network = await this.network.startNetwork(this.options.defaultGraph, {
                graph: graphId,
            }, this.context);
            this.runtime.setMainGraph(this.options.defaultGraph);
            this.emit('ready', network);

        } catch (err) {
            this.emit('error', err);
        }


    }

    // Check if a given user is authorized for a given capability
    //
    // @param [Array] Capabilities to check
    // @param [String] Secret provided by user
    canDo(capability, secret) {
        let checkCapabilities;
        if (typeof capability === 'string') {
            checkCapabilities = [capability];
        } else {
            checkCapabilities = capability;
        }
        const userCapabilities = this.getPermitted(secret);
        const permitted = checkCapabilities.filter((perm) => userCapabilities.includes(perm));
        if (permitted.length > 0) {
            return true;
        }
        return false;
    }

    // Check if a given user is authorized to send a given message
    canInput(protocol, topic, secret) {
        if (protocol === 'graph') {
            // All graph messages are under the same capability
            return this.canDo(['protocol:graph'], secret);
        }
        if (protocol === 'trace') {
            // All trace messages are under the same capability
            return this.canDo(['protocol:trace'], secret);
        }
        const message = `${protocol}:${topic}`;
        switch (message) {
            case 'component:list': return this.canDo(['protocol:component'], secret);
            case 'component:getsource': return this.canDo(['component:getsource'], secret);
            case 'component:source': return this.canDo(['component:setsource'], secret);
            case 'network:edges': return this.canDo(['network:data', 'protocol:network'], secret);
            case 'network:start': return this.canDo(['network:control', 'protocol:network'], secret);
            case 'network:stop': return this.canDo(['network:control', 'protocol:network'], secret);
            case 'network:debug': return this.canDo(['network:control', 'protocol:network'], secret);
            case 'network:getstatus': return this.canDo(['network:status', 'network:control', 'protocol:network'], secret);
            case 'runtime:getruntime': return true;
            case 'runtime:packet': return this.canDo(['protocol:runtime'], secret);
            default: return false;
        }
    }

    // Get enabled capabilities for a user
    //
    // @param [String] Secret provided by user
    getPermitted(secret) {
        if (!secret) {
            return this.options.defaultPermissions;
        }
        return this.options.permissions[secret] || [];
    }

    // Send a message back to the user via the transport protocol.
    //
    // Each transport implementation should provide their own implementation
    // of this method.
    //
    // The context is usually the context originally received from the
    // transport with the request. This could be an iframe origin or a
    // specific WebSocket connection.
    //
    // @param [String] Name of the protocol
    // @param [String] Topic of the message
    // @param [Object] Message payload
    // @param [Object] Message context, dependent on the transport
    send(protocol: Protocol, topic, payload, context: Context) {
        console.log(`${protocol}:${topic}`, payload, context);
    }

    // Send a message to *all users*  via the transport protocol
    //
    // The transport should verify that the recipients are authorized to receive
    // the message by using the `canDo` method.
    //
    // Like send() only it sends to all.
    //
    // @param [String] Name of the protocol
    // @param [String] Topic of the message
    // @param [Object] Message payload
    // @param [Object] Message context, dependent on the transport
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendAll(protocol: Protocol,topic: string, payload:unknown,context:Context) { }

    // This is the entry-point to actual protocol handlers. When receiving
    // a message, the runtime should call this to make the requested actions
    // happen
    //
    // The context is originally received from the transport. This could be
    // an iframe origin or a specific WebSocket connection. The context will
    // be utilized when sending messages back to the requester.
    //
    // @param [String] Name of the protocol
    // @param [String] Topic of the message
    // @param [Object] Message payload
    // @param [Object] Message context, dependent on the transport
    receive(protocol: Protocol, topic, payload: PayloadWithSecret = {}, context: Context) {

        const secret = payload ? payload.secret : null;
        if (!this.canInput(protocol, topic, secret)) {
            this.send(protocol, 'error', new Error(`${protocol}:${topic} is not permitted`), context);
            return;
        }

        this.context = context;
        switch (protocol) {
            case 'runtime': {
                this.runtime.receive(topic, payload, context);
                return;
            }
            case 'graph': {
                this.graph.receive(topic, payload, context);
                return;
            }
            case 'network': {
                this.network.receive(topic, payload, context);
                return;
            }
            case 'component': {
                this.component.receive(topic, payload, context);
                return;
            }
            case 'trace': {
                this.trace.receive(topic, payload, context);
                return;
            }
            default: {
                this.send(protocol, 'error', new Error(`Protocol ${protocol} is not supported`), context);
            }
        }
    }
}