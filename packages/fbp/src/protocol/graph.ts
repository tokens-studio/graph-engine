import { AddEdge, AddInitial, AddInport, AddNode, AddOutport, ChangeNode, Clear, Error as ErrorMessage, RemoveEdge, RemoveInport, RemoveNode, RemoveOutport, RenameNode } from '../messages/graph';
import { Context } from '../interfaces/context';
import {
    EventEmitter,
} from 'events';
import { Graph, annotatedVariadicIndex } from '@tokens-studio/graph-engine';
import { ServerMessage } from '../messages/util';
import { Transport } from '../interfaces/transport';
import { extractSourceRequest } from './component';
import { findInput, findOutput } from '../utils';
import { graphID } from '../annotations';

type MessageLookup = {
    error: ErrorMessage,
    clear: ServerMessage<Clear>,
    addnode: ServerMessage<AddNode>,
    addedge: ServerMessage<AddEdge>,
    removenode: ServerMessage<RemoveNode>,
    addinport: ServerMessage<AddInport>,
    addoutport: ServerMessage<AddOutport>,
    removeedge: ServerMessage<RemoveEdge>,
    removeinport: ServerMessage<RemoveInport>,
    removeoutport: ServerMessage<RemoveOutport>
}

type MessageType<T extends keyof MessageLookup> = MessageLookup[T];






export class GraphProtocol extends EventEmitter {

    transport: Transport;
    graphs: Record<string, Graph>

    constructor(transport: Transport) {
        super();
        this.transport = transport;
        this.graphs = {};
    }

    send<P extends keyof MessageLookup = keyof MessageLookup>(topic: P, payload: MessageType<P>, context?: Context) {
        return this.transport.send('graph', topic, payload, context);
    }

    sendAll<P extends keyof MessageLookup = keyof MessageLookup>(topic: P, payload: MessageType<P>, context?: Context) {
        return this.transport.sendAll('graph', topic, payload, context);
    }

    receive(topic, payload, context) {
        // Find locally stored graph by ID
        let graph: Graph;
        if (topic !== 'clear') {
            graph = this.resolveGraph(payload, context);
            if (!graph) { return; }
        }

        switch (topic) {
            case 'clear': this.initGraph(payload, context); break;
            case 'addnode': this.addNode(graph, payload, context); break;
            case 'removenode': this.removeNode(graph, payload, context); break;
            case 'renamenode': this.renameNode(graph, payload, context); break;
            case 'changenode': this.changeNode(graph, payload, context); break;
            case 'addedge': this.addEdge(graph, payload, context); break;
            case 'removeedge': this.removeEdge(graph, payload, context); break;
            case 'changeedge': this.changeEdge(graph, payload, context); break;
            case 'addinitial': this.addInitial(graph, payload, context); break;
            case 'removeinitial': this.removeInitial(graph, payload, context); break;
            case 'addinport': this.addInport(graph, payload, context); break;
            case 'removeinport': this.removeInport(graph, payload, context); break;
            case 'renameinport': this.renameInport(graph, payload, context); break;
            case 'addoutport': this.addOutport(graph, payload, context); break;
            case 'removeoutport': this.removeOutport(graph, payload, context); break;
            case 'renameoutport': this.renameOutport(graph, payload, context); break;
            case 'addgroup': this.addGroup(graph, payload, context); break;
            case 'removegroup': this.removeGroup(graph, payload, context); break;
            case 'renamegroup': this.renameGroup(graph, payload, context); break;
            case 'changegroup': this.changeGroup(graph, payload, context); break;
            default: this.send('error', new Error(`graph:${topic} not supported`), context);
        }
    }

    resolveGraph(payload, context): Graph | null {
        if (!payload.graph) {
            this.send('error', new Error('No graph specified'), context);
            return null;
        }

        if (!this.graphs[payload.graph]) {
            this.send('error', new Error('Requested graph not found'), context);
            return null;
        }
        return this.graphs[payload.graph];
    }

    getLoader() {
        return this.transport.component.getLoader();
    }


    initGraph(payload: Clear, context) {
        if (!payload.id) {
            this.send('error', new Error('No graph ID provided'), context);
            return;
        }
        const graph = new Graph();


        graph.annotations[graphID] = payload.id;
        graph.annotations['engine.main'] = payload.main;
        graph.annotations['engine.title'] = payload.name || 'Unnamed Graph';


        const { library } = payload;
        if (library) {
            //TODO this is currently unused
        }
        if (payload.icon) {
            graph.annotations['ui.icon'] = payload.icon;
        }
        if (payload.description) {
            graph.annotations['engine.main'] = payload.description;
        }

        this.registerGraph(payload.id, graph, context, true)
            .catch((err: Error) => {
                this.send('error', err, context);
            });
    }

    async registerGraph(id: string, graph: Graph, context = null, propagate = true) {
        // Prepare the network
        try {
            const network = await this.transport.network.initNetwork(graph, id, context)

            this.subscribeGraph(id, graph, context);
            this.graphs[id] = graph;


            const graphName = graph.annotations['engine.title'] as string;
            const main = !!graph.annotations['engine.main'];
            const icon = graph.annotations['ui.icon'] as string | undefined;
            const description = graph.annotations['engine.description'] as string | undefined;

            this.sendAll('clear', {
                id,
                name: graphName,
                //TODO currently unused
                library: '',
                main,
                icon,
                description,
            });

            if (!propagate) {
                return;
            }

            // Register for runtime exported ports
            this.transport.runtime.registerNetwork(id, network);


        } catch (err) {
            this.send('error', err, context);
            return Promise.reject(err);
        }
    }

    subscribeGraph(id: string, graph: Graph, context: Context) {
        graph.on('nodeAdded', (node) => {
            this.sendAll('addnode', {
                id: node.id,
                component: node.factory.type,
                metadata: node.annotations,
                graph: id,
            } as AddNode, context);
        });
        graph.on('nodeRemoved', (id) => {
            const nodeData = {
                id,
                graph: id,
            };
            this.sendAll('removenode', nodeData, context);
        });

        graph.on('edgeAdded', (edge) => {
            const edgeData: AddEdge = {
                src: {
                    node: edge.source,
                    port: edge.sourceHandle,
                },
                tgt: {
                    node: edge.target,
                    port: edge.targetHandle,
                },
                //Currently none
                metadata: undefined,
                graph: id,
            };

            if (edge.annotations[annotatedVariadicIndex]) {
                edgeData.tgt.index = edge.annotations[annotatedVariadicIndex] as number;
            }

            this.sendAll('addedge', edgeData, context);
        });
        graph.on('edgeRemoved', (edge) => {
            const edgeData = {
                src: {
                    node: edge.source,
                    port: edge.sourceHandle,
                },
                tgt: {
                    node: edge.target,
                    port: edge.targetHandle,
                },
                graph: id,
            };
            this.sendAll('removeedge', edgeData, context);
        });
        graph.on('inputPortAdded', (port) => {
            const data: AddInport = {
                public: port.name,
                node: port.node.id,
                port: port.name,
                metadata: {
                    ...port.fullType(),
                    ...port.annotations
                },
                graph: id,
            };
            this.sendAll('addinport', data, context);
        });
        graph.on('outputPortAdded', (port) => {
            const data = {
                public: port.name,
                node: port.node.id,
                port: port.name,
                metadata: {
                    ...port.fullType(),
                    ...port.annotations
                },
                graph: id,
            };
            this.sendAll('addoutport', data, context);
        });
        graph.on('inputPortRemoved', (input) => {

            if (input.node.factory.type === 'studio.tokens.generic.input') {
                const data = {
                    public: input.name,
                    graph: id,
                };
                this.sendAll('removeinport', data, context);
            }

        });
        graph.on('outputPortRemoved', (output) => {
            if (output.node.factory.type === 'studio.tokens.generic.output') {
                const data = {
                    public: output.name,
                    graph: id,
                };
                this.sendAll('removeoutport', data, context);
            }
        });

    }

    addInport(graph: Graph, payload: AddInport, context) {
        if (!payload.public && !payload.node && !payload.port) {
            this.send('error', new Error('Missing exported inport information'), context);
            return;
        }
        /**
         * Ensure the node exists
         */
        const node = graph.getNode(payload.node);
        if (!node) {
            this.send('error', new Error(`Node ${payload.node} not found`), context);
            return;
        }

        node.addInput(payload.port, payload.metadata);
    }

    async addNode(graph: Graph, payload: AddNode, context: Context) {
        if (!payload.id && !payload.component) {
            this.send('error', new Error('No ID or component supplied'), context);
            return;
        }



        const request = extractSourceRequest(payload.component)
        const Factory = await this.transport.component.loadNode(request, context);

        const node = new Factory({
            id: payload.id,
            graph
        });
        //Note that we are spreading annotations here. This is so that node specific ones do not get overriden and we add them
        node.annotations = {
            ...node.annotations,
            'ui.position.x': payload.metadata.x,
            'ui.position.y': payload.metadata.y,
        };
    }



    removeNode(graph: Graph, payload: RemoveNode, context: Context) {
        if (!payload.id) {
            this.send('error', new Error('No ID supplied'), context);
            return;
        }
        graph.removeNode(payload.id);
    }

    renameNode(graph: Graph, payload: RenameNode, context: Context) {
        this.send('error', new Error('Unimplemented'), context);
    }

    changeNode(graph: Graph, payload: ChangeNode, context) {
        if (!payload.id && !payload.metadata) {
            this.send('error', new Error('No id or metadata supplied'), context);
            return;
        }
        //Get the node 
        // const node = graph.getNode(payload.id);

        this.send('error', new Error('Unimplemented'), context);
    }

    addEdge(graph: Graph, edge: AddEdge, context: Context) {
        if (!edge.src && !edge.tgt) {
            this.send('error', new Error('No src or tgt supplied'), context);
            return;
        }

        const source = graph.getNode(edge.src.node);
        const srcHandle = source.outputs[edge.src.port];
        const target = graph.getNode(edge.tgt.node);
        const tgtHandle = target.inputs[edge.tgt.port];
        const variadicIndex = edge.tgt.index || -1;


        graph.connect(source, srcHandle, target, tgtHandle, variadicIndex);
    }

    removeEdge(graph: Graph, edge, context) {
        if (!edge.src && !edge.tgt) {
            this.send('error', new Error('No src or tgt supplied'), context);
            return;
        }

        //Note this is different to how the protocol specifies it as we do not care about the individual ids
        this.send('error', new Error('Unimplemented'), context);
    }

    changeEdge(graph: Graph, edge, context) {
        if (!edge.src && !edge.tgt) {
            this.send('error', new Error('No src or tgt supplied'), context);
            return;
        }
        this.send('error', new Error('Unimplemented'), context);
    }

    addInitial(graph: Graph, payload: AddInitial, context: Context) {
        if (!payload.src && !payload.tgt) {
            this.send('error', new Error('No src or tgt supplied'), context);
            return;
        }

        const node = graph.getNode(payload.tgt.node);
        if (!node) {
            this.send('error', new Error(`Node ${payload.tgt.node} not found`), context);
            return;
        }

        //Look for the input
        const input = node.inputs[payload.tgt.port];
        if (!input) {
            this.send('error', new Error(`Input ${payload.tgt.port} not found`), context);
            return;
        }

        //TODO handle variadic updates variadic 

        input.setValue(payload.src.data);
    }

    removeInitial(graph: Graph, payload, context) {
        if (!payload.tgt) {
            this.send('error', new Error('No tgt supplied'), context);
            return;
        }

        const node = graph.getNode(payload.tgt.node);
        if (!node) {
            this.send('error', new Error(`Node ${payload.tgt.node} not found`), context);
            return;
        }

        //Look for the input
        const input = node.inputs[payload.tgt.port];
        if (!input) {
            this.send('error', new Error(`Input ${payload.tgt.port} not found`), context);
            return;
        }
        //TODO handle variadic updates variadic 
        input.reset();
    }

    removeInport(graph: Graph, payload: RemoveInport, context) {
        if (!payload.public) {
            this.send('error', new Error('Missing exported inport name'), context);
            return;
        }

        //Find the input port
        const inputNode = findInput(graph);
        inputNode?.removeInput(payload.public);
    }

    renameInport(graph: Graph, payload, context) {
        if (!payload.from && !payload.to) {
            this.send('error', new Error('No from or to supplied'), context);
            return;
        }
        //TODO we currently do not support renaming inports due to atomic concerns
        this.send('error', new Error('Unimplemented'), context);
    }

    addOutport(graph: Graph, payload: AddOutport, context: Context) {
        if (!payload.public && !payload.node && !payload.port) {
            this.send('error', new Error('Missing exported outport information'), context);
            return;
        }

        const output = findOutput(graph);

        output.addInput(payload.public, payload.metadata);
    }

    removeOutport(graph: Graph, payload: RemoveOutport, context) {
        if (!payload.public) {
            this.send('error', new Error('Missing exported outport name'), context);
            return;
        }
        const output = findOutput(graph);
        output.removeInput(payload.public);
    }

    renameOutport(graph: Graph, payload, context) {
        if (!payload.from && !payload.to) {
            this.send('error', new Error('No from or to supplied'), context);
            return;
        }
        //TODO we currently do not support renaming inports due to atomic concerns
        this.send('error', new Error('Unimplemented'), context);
    }

    addGroup(graph: Graph, payload, context) {
        if (!payload.name && !payload.nodes && !payload.metadata) {
            this.send('error', new Error('No name or nodes or metadata supplied'), context);
            return;
        }
        this.send('error', new Error('Unimplemented'), context);
    }

    removeGroup(graph: Graph, payload, context) {
        if (!payload.name) {
            this.send('error', new Error('No name supplied'), context);
            return;
        }
        this.send('error', new Error('Unimplemented'), context);
    }

    renameGroup(graph: Graph, payload, context) {
        if (!payload.from && !payload.to) {
            this.send('error', new Error('No from or to supplied'), context);
            return;
        }
        this.send('error', new Error('Unimplemented'), context);
    }

    changeGroup(graph: Graph, payload, context) {
        if (!payload.name && !payload.metadata) {
            this.send('error', new Error('No name or metadata supplied'), context);
            return;
        }
        this.send('error', new Error('Unimplemented'), context);
    }
}