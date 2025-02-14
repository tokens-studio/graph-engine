import { Graph, annotatedPlayState, annotatedVariadicIndex } from "@tokens-studio/graph-engine";
import { Transport } from "../interfaces/transport";

import { Context } from "../interfaces/context";
import { Data, Debug, Error as ErrorMessage, Persist, ProcessError, Start, Started, Status, Stopped } from "../messages/network";
import {
    EventEmitter,
} from 'events';
import { Flowtrace } from "flowtrace";



type MessageLookup = {
    data: Data,
    status: Status,
    error: ErrorMessage,
    stopped: Stopped
    started: Started,
    processerror: ProcessError
}
type MessageType<T extends keyof MessageLookup> = MessageLookup[T];

type Events = {
    addnetwork: (network: Network, graphID: string, networks: Record<string, Network>) => void,
    removenetwork: (network: Network, graphID: string, networks: Record<string, Network>) => void,
}


export class Network {

    graph: Graph
    debug = false
    startTime = -1
    started = false
    flowTrace?: Flowtrace

    constructor(graph: Graph) {
        this.graph = graph;
    }

    setDebug(enable: boolean) {
        this.debug = enable;
    }
    isDebug() {
        return this.debug
    }
    uptime() {
        return Date.now() - this.startTime
    }

    getNode(id: string) {
        return this.graph.getNode(id);
    }

    async start() {
        this.startTime = Date.now();
        this.started = true;
        this.graph.start()
    }
    isStarted() {
        return this.started
    }
    /**
     * If isStarted is true and isRunning is not, it is indicative of a crash
     */
    isRunning() {
        return this.graph.annotations[annotatedPlayState] == 'playing'
    }
    /**
     * This is currently async because it is possible to have async operations in the future 
     */
    async stop() {
        this.graph.stop();
    }



    setFlowtrace(flowTrace: Flowtrace) {
        this.flowTrace = flowTrace;
        //TODO we should have the tracer listen to emitted events for tracing
    };

}


export interface NetworkProtocolEvents {
    //Declare a strongly typed event emitter handler for 'on'
    on<T extends keyof Events>(event: T, listener: Events[T]): this;

    //Declare a strongly typed event emitter handler for 'emit'
    emit<T extends keyof Events>(event: T, ...args: Parameters<Events[T]>): boolean;

}

/**
 * Handles communications related to running a FBP graph
 */
export class NetworkProtocol extends EventEmitter implements NetworkProtocolEvents {

    transport: Transport;

    networks: Record<string, Network>

    constructor(transport: Transport) {
        super();
        this.transport = transport;
        this.networks = {};
    }

    send<P extends keyof MessageLookup = keyof MessageLookup>(topic: P, payload: MessageType<P>, context: Context) {
        return this.transport.send('network', topic, payload, context);
    }

    sendAll<P extends keyof MessageLookup = keyof MessageLookup>(topic: P, payload: MessageType<P>, context: Context) {
        return this.transport.sendAll('network', topic, payload, context);
    }

    receive(topic, payload, context) {
        const graph = this.resolveGraph(payload, context);
        if (!graph) { return; }
        switch (topic) {
            case 'persist':
                this.persistNetwork(graph, payload, context); break;
            case 'start':
                this.startNetwork(graph, payload, context); break;
            case 'stop':
                this.stopNetwork(graph, payload, context); break;
            case 'edges':
                this.updateEdges(graph, payload, context); break;
            case 'debug':
                this.debugNetwork(graph, payload, context); break;
            case 'getstatus':
                this.getStatus(graph, payload, context); break;
            default: this.send('error', new Error(`network:${topic} not supported`), context);
        }
    }
    /**
     * @TODO
     */
    persistNetwork(graph: Graph, payload: Persist, context: Context) {
        this.send('error', new Error('Not implemented'), context);
    }

    resolveGraph(payload, context) {
        if (!payload.graph) {
            this.send('error', new Error('No graph specified'), context);
            return null;
        }
        if (!this.transport.graph.graphs[payload.graph]) {
            this.send('error', new Error('Requested graph not found'), context);
            return null;
        }
        return this.transport.graph.graphs[payload.graph];
    }

    getNetwork(graphName) {
        if (!graphName) {
            return null;
        }
        if (!this.networks[graphName]) {
            return null;
        }
        return this.networks[graphName];
    }

    updateEdges(graph, payload, context) {

        //We should be interacting with the tracer here and creating a filter for the user

        this.send('error', new Error('Not implemented'), context);
    }


    /**
     * Creates a network instance for a graph
     * @param graph 
     * @param graphID 
     * @param context 
     * @returns 
     */
    async initNetwork(graph: Graph, graphID: string, context: Context) {
        // Ensure we stop previous network
        const existingNetwork = this.getNetwork(graphID);
        if (existingNetwork) {
            await existingNetwork.stop();
            delete this.networks[graphID];
            this.emit('removenetwork', existingNetwork, graphID, this.networks);
            return this.initNetwork(graph, graphID, context);
        }


        //At this moment, a network is just a graph, however in the future this will likely change to include more information

        const network = new Network(graph);
        this.networks[graphID] = network;
        this.emit('addnetwork', network, graphID, this.networks);

        //Add subscriptions on the network for the graph

        //Whenever data is sent, we want to send it to the transport
        graph.on('valueSent', (edges) => {
            edges.map((edge) => {
                this.sendAll('data', {
                    id: edge.id,
                    graph: graphID,
                    //TODO
                    subgraph: [],
                    src: {
                        node: edge.source,
                        port: edge.sourceHandle,
                        
                    },
                    tgt: {
                        node: edge.target,
                        port: edge.targetHandle,
                        index: edge.annotations[annotatedVariadicIndex] as number
                    },

                }, context)
            });
        });

        graph.on('processError', (processError) => {
            //Only emit in debug mode 
            if (network.isDebug()) {
                this.sendAll('processerror', {
                    id: processError.node.id,
                    error: processError.error.message,
                    graph: graphID
                }, context)
            }
        })
    }


    async startNetwork(graph: Graph, payload: Start, context: Context) {

        let network;
        const existingNetwork = this.getNetwork(payload.graph);
        if (existingNetwork) {
            // already initialized
            existingNetwork.start();
            network = existingNetwork;
        } else {
            network = await this.initNetwork(graph, payload.graph, context);
            network.start();
        }

        this.send('started', {
            time: new Date().toISOString(),
            graph: payload.graph,
            running: network.isRunning(),
            started: network.isStarted(),
            debug: network.isDebug(),
        },
            context);
    }

    async stopNetwork(graph, payload, context) {
        const net = this.getNetwork(payload.graph);
        if (!net) {
            this.send('error', new Error(`Network ${payload.graph} not found`), context);
            return;
        }
        if (net.isStarted()) {
            await net.stop()
        }
        // Was already stopped, just send the confirmation
        this.send('stopped', {
            time: new Date().toISOString(),
            graph: payload.graph,
            running: net.isRunning(),
            started: net.isStarted(),
            uptime: net.uptime(),
            debug: net.isDebug()
        },
            context);
    }

    debugNetwork(graph, payload: Debug, context) {
        const net = this.getNetwork(payload.graph);
        if (!net) {
            this.send('error', new Error(`Network ${payload.graph} not found`), context);
            return;
        }
        net.setDebug(payload.enable);
    }

    getStatus(graph, payload, context) {
        const net = this.getNetwork(payload.graph);
        if (!net) {
            this.send('error', new Error(`Network ${payload.graph} not found`), context);
            return;
        }
        this.send('status', {
            graph: payload.graph,
            running: net.isRunning(),
            started: net.isStarted(),
            uptime: net.uptime(),
            debug: net.isDebug(),
        },
            context);
    }
}
