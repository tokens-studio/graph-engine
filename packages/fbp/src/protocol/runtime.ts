import { Context } from '../interfaces/context';
import {
    EventEmitter,
} from 'events';
import { GetRuntime, Packet, PacketSent, Ports, Runtime } from '../messages/runtime';
import { Graph, Input, Output, Port } from '@tokens-studio/graph-engine';
import { Network } from './network';
import { PortDefinition } from '../interfaces/port';
import { ServerMessage } from '../messages/util';
import { Transport } from '../interfaces/transport';
import {autorun} from 'mobx'
import { findOutput, getGraphID } from '../utils';

function sendToInport(port: Input, event, payload: unknown) {

    switch (event) {
        case 'begingroup': throw new Error('unimplemented');
        case 'endgroup': throw new Error('unimplemented');
        case 'data': port.setValue(payload);; break;
        default: {
            // Ignored
        }
    }
}

function findPort(network: Network, name: string, inPort: boolean): Port {
    let internalPort;
    if (!network || !network.graph) { return null; }

    //Find the input and output nodes
    const input = Object.values(network.graph.nodes).find((node) => node.factory.type === 'studio.tokens.generic.input');
    const output = Object.values(network.graph.nodes).find((node) => node.factory.type === 'studio.tokens.generic.output');

    if (inPort) {
        internalPort = input.inputs[name];
    } else {
        internalPort = output.outputs[name];
    }

    return internalPort;
}



function portToPayload(portName: string, port: Port): PortDefinition {
    const def = {
        id: portName,
        type: 'all',
        addressable: false,
        required: false,
    } as PortDefinition;
    if (!port) { return def; }
    //Todo this needs to be more complex
    def.type = port.type.type || 'any';
    def.schema = port.type.$id;

    //Assume the description exists on the json schema 
    def.description = port.annotations['engine.description'] || port.type.description;
    def.addressable = (port as Input).variadic || false;
    //TODO we don't support this yet
    def.required = true;
    return def;
}

/**
 * Extracts the ports from a graph
 * @param graphId 
 * @param network 
 * @returns 
 */
function portsPayload(graphId: string, network: Network) {
    const payload = {
        graph: graphId,
        inPorts: [],
        outPorts: [],
    };
    if (!(network != null ? network.graph : undefined)) { return payload; }

    //Find the input and output nodes 

    //We assume it can be found 
    const input = Object.values(network.graph.nodes).find((node) => node.factory.type === 'studio.tokens.generic.input');
    const output = Object.values(network.graph.nodes).find((node) => node.factory.type === 'studio.tokens.generic.output');

    Object.values(input.inputs).forEach((port) => {
        payload.inPorts.push(portToPayload(port.name, port))
    });
    Object.values(output.inputs).forEach((port) => {
        payload.inPorts.push(portToPayload(port.name, port))
    });
    return payload;
}


export type RuntimeDefinition = {
    type: string;
    version: string;
    id: string;
    label?: string;
    namespace?: string;
    repository?: string;
    repositoryVersion?: string;
    allCapabilities?: string[];
    capabilities?: string[];
    graph?: string

}

type MessageLookup = {
    ports: Ports,
    error: Error,
    runtime: ServerMessage<Runtime>,
    packet: Packet,
    packetsent: PacketSent
}

type MessageType<T extends keyof MessageLookup> = MessageLookup[T];



export class RuntimeProtocol extends EventEmitter {

    transport: Transport;
    outputSockets: Record<string, Record<string, Output>>
    /**
     * The main graph of the runtime
     */
    mainGraph: Graph | null;

    constructor(transport: Transport) {
        super();
        this.transport = transport;
        this.outputSockets = {}; // graphId -> portName -> Output
        this.mainGraph = null;

        this.transport.network.on('removenetwork', () => {
            //TODO handle unsubscribe
        });
    }

    registerNetwork(name, network) {
        this.subscribeExportedPorts(name, network, true);
        this.subscribeOutPorts(name, network);
        this.sendPorts(name, network);

        if (network.isStarted()) {
            // processes don't exist until started
            this.subscribeToOutputData(name, network, true);
        }
        network.once('start', () => {
            // processes don't exist until started
            this.subscribeToOutputData(name, network, true);
        });
    }

    send<P extends keyof MessageLookup = keyof MessageLookup>(topic: P, payload: MessageType<P>, context?: Context) {
        return this.transport.send('runtime', topic, payload, context);
    }

    sendAll<P extends keyof MessageLookup = keyof MessageLookup>(topic: P, payload: MessageType<P>, context?: Context) {
        return this.transport.sendAll('runtime', topic, payload, context);
    }

    sendError(err, context) {
        return this.send('error', err, context);
    }

    async receive(topic, payload, context) {
        switch (topic) {
            case 'getruntime': return this.getRuntime(payload, context);
            case 'packet':
                try {
                    await this.sendPacket(payload);
                    this.send('packetsent', payload as Packet, context);
                } catch (err) {
                    this.sendError(err, context);
                }
                break;
            default: return this.send('error', new Error(`runtime:${topic} not supported`), context);
        }
    }

    getRuntimeDefinition(): RuntimeDefinition {
        const {
            type,
        } = this.transport.options;

        const payload: RuntimeDefinition = {
            id: this.transport.options.id || 'unknown',
            type,
            version: this.transport.version,
        };


        // Add project metadata if available
        if (this.transport.options.label) { payload.label = this.transport.options.label; }
        if (this.transport.options.namespace) { payload.namespace = this.transport.options.namespace; }
        if (this.transport.options.repository) {
            payload.repository = this.transport.options.repository;
        }
        if (this.transport.options.repositoryVersion) {
            payload.repositoryVersion = this.transport.options.repositoryVersion;
        }

        return payload;
    }

    getRuntime(request: GetRuntime, context: Context) {
        const payload = this.getRuntimeDefinition();

        const {
            capabilities,
        } = this.transport.options;
        const secret = request ? request.secret : null;
        payload.allCapabilities = capabilities;
        payload.capabilities = capabilities.filter(
            (capability) => this.transport.canDo(capability, secret),
        );

        if (this.mainGraph) {
            payload.graph = getGraphID(this.mainGraph);
        }

        this.send('runtime', payload as Runtime, context);
        // send port info about currently set up networks
        return (() => {
            const result = [];
            Object.keys(this.transport.network.networks).forEach((name) => {
                const network = this.transport.network.getNetwork(name);
                result.push(this.sendPorts(name, network, context));
            });
            return result;
        })();
    }

    sendPorts(graphId: string, network: Network, context?: Context) {
        const payload = portsPayload(graphId, network);
        this.emit('ports', payload);

        if (!context) {
            return this.sendAll('ports', payload);
        }
        return this.send('ports', payload, context);
    }

    setMainGraph(graph: Graph) {
        this.mainGraph = graph;
    }
    // XXX: should send updated runtime info?

    subscribeExportedPorts(name, network, add) {
        const sendExportedPorts = () => this.sendPorts(name, network);
        const dependencies = [
            'addInport',
            'addOutport',
            'removeInport',
            'removeOutport',
        ];
        dependencies.forEach((d) => {
            network.graph.removeListener(d, sendExportedPorts);
        });

        if (add) {
            const result = [];
            dependencies.forEach((d) => {
                result.push(network.graph.on(d, sendExportedPorts));
            });
        }
    }

    subscribeOutPorts(name: string, network: Network) {
        const portRemoved = () => this.subscribeToOutputData(name, network, false);
        const portAdded = () => this.subscribeToOutputData(name, network, true);

        const {
            graph,
        } = network;


        graph.on('outputPortAdded', portAdded);
        graph.on('outputPortRemoved', portRemoved);

    }

    subscribeToOutputData(graphId: string, network: Network, add: boolean) {
        // Unsubscribe all
        if (!this.outputSockets[graphId]) {
            this.outputSockets[graphId] = {};
        }
        let graphSockets = this.outputSockets[graphId];



        graphSockets = {};

        if (!add) { return; }
        
        //Find the input and output nodes


    

   
        const output =  findOutput(network.graph);


autorun

        Object.keys(output.outputs).forEach((pub) => {
            const internal = network.graph.outports[pub];
            const socket = noflo.internalSocket.createSocket();
            graphSockets[pub] = socket;
            const {
                component,
            } = network.processes[internal.process];
            if (!(component != null ? component.outPorts[internal.port] : undefined)) {
                throw new Error(`Exported outport ${internal.port} in node ${internal.process} not found`);
            }
            component.outPorts[internal.port].attach(socket);
            let event;
            socket.on('ip', (ip) => {
                switch (ip.type) {
                    case 'openBracket':
                        event = 'begingroup';
                        break;
                    case 'closeBracket':
                        event = 'endgroup';
                        break;
                    default:
                        event = ip.type;
                }
                this.emit('packet', {
                    port: pub,
                    event,
                    graph: graphId,
                    payload: ip.data,
                });
                this.sendAll('packet', {
                    port: pub,
                    event,
                    graph: graphId,
                    payload: ip.data,
                } as Packet);
            });
        });
    }

    /**
     * Sends a packet into a port
     */
    sendPacket(payload: Packet) {
        return new Promise<void>((resolve, reject) => {
            const network = this.transport.network.getNetwork(payload.graph);
            if (!network) {
                reject(new Error(`Cannot find network for graph ${payload.graph}`));
                return;
            }
            const port = findPort(network, payload.port, true);
            if (!port) {
                reject(new Error(`Cannot find internal port for ${payload.port}`));
                return;
            }
            sendToInport(port as Input, payload.event, payload.payload);
            resolve();
        });
    }
}
