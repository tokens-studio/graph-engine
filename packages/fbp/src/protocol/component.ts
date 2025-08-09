import { Component, Error as ErrorMessage, Source } from "../messages/component";
import { Context } from "../interfaces/context";
import {
    EventEmitter,
} from 'events';
import { Graph, Input, NodeFactory, Port } from "@tokens-studio/graph-engine";
import { Loader } from "../interfaces/loader";
import { PortDefinition } from "../interfaces/port";
import { ServerMessage } from "../messages/util";
import { Transport } from "../interfaces/transport";
import debounce from 'debounce'


type MessageLookup = {
    error: ErrorMessage,
    component: ServerMessage<Component>
}

type MessageType<T extends keyof MessageLookup> = MessageLookup[T];

export type SourceRequest = {
    library: string,
    name: string
}

export const extractSourceRequest = (component: string): SourceRequest => {
    const parts = component.split('/');
    return {
        library: parts[0],
        name: parts[1],
    };
}




/**
 * Provides  communications about available components and changes to them
 */
export class ComponentProtocol extends EventEmitter {


    transport: Transport;
    loader: Loader
    constructor(transport: Transport) {
        super();
        this.transport = transport;
        this.loader = transport.options.loader;
    }

    send<P extends keyof MessageLookup = keyof MessageLookup>(topic: P, payload: MessageType<P>, context?: Context) {
        return this.transport.send('component', topic, payload, context);
    }

    sendAll<P extends keyof MessageLookup = keyof MessageLookup>(topic: P, payload: MessageType<P>, context?: Context) {
        return this.transport.sendAll('component', topic, payload, context);
    }

    receive(topic, payload, context) {
        switch (topic) {
            case 'list': return this.listComponents(payload, context);
            case 'getsource': return this.getSource(payload, context);
            case 'source': return this.setSource(payload, context);
            default: return this.send('error', new Error(`component:${topic} not supported`), context);
        }
    }

    loadNode = async (sourceRequest: SourceRequest, context: Context): Promise<NodeFactory> => {
        const loader = this.getLoader();
        return this.processComponent(loader, sourceRequest, context);
    }

    getLoader() {
        return this.loader;
    }

    listComponents(payload, context) {

        const loader = this.getLoader();
        loader.listComponents()
            .then((components) => {
                const componentNames = Object.keys(components);
                let processed = 0;
                return Promise.all(componentNames.map((component) => this
                    .processComponent(loader, component, context)
                    .then(() => {
                        processed += 1;
                    }, (error) => {
                        processed += 1;
                        this.send('error', error, context);
                    })))
                    .then(() => {
                        this.send('componentsready', processed, context);
                    });
            }, (err) => {
                this.send('error', err, context);
            });
    }

    getSource(payload, context) {
        const loader = this.getLoader();
        loader.getSource(payload.name)
            .then(
                (src) => src,
                (err) => {
                    // Try one of the registered graphs
                    const nameParts = parseName(payload.name);
                    const graph = this.transport.graph.graphs[payload.name]
                        || this.transport.graph.graphs[nameParts.name];
                    if (!graph) {
                        return Promise.reject(err);
                    }
                    return {
                        name: nameParts.name,
                        library: nameParts.library || '',
                        code: JSON.stringify(graph.toJSON()),
                        language: 'json',
                    };
                },
            )
            .then((component) => {
                this.send('source', component, context);
            }, (err) => {
                this.send('error', err, context);
            });
    }

    async setSource(payload: Source, context: Context) {

        const loader = this.getLoader();
        try {
            await loader.setSource(payload.library, payload.name, payload.code, payload.language);

            this.emit('updated', payload);
            await this.processComponent(
                loader,
                payload,
                context,
            );
        } catch (err) {
            this.send('error', err, context);
        }
    }

    async processComponent(loader: Loader, source: SourceRequest, context: Context): Promise<NodeFactory> {
        const factory = await loader.load(source);

        this.sendComponent(source.name, factory, context);
        return factory;
    }

    processPort(portName: string, port: Port) {
        // Required port properties
        const portDef = {
            id: portName,
            type: port.type.type,
        } as PortDefinition;

        portDef.schema = port.type.$id;
        // TODO fix, we currently do not distinguish between required and optional ports
        portDef.required = true;
        portDef.addressable = (port as Input).variadic || false;
        portDef.description = port.type.description;
        portDef.default = port.type.default;
        return portDef;
    }

    sendComponent(component: string, Factory: NodeFactory, context) {
        const inPorts = [];
        const outPorts = [];

        //Use an empty graph to prevent side effects 
        const graph = new Graph();

        const instance = new Factory({ graph });


        //@TODO make the way we determine inports, etc to be more declarative


        Object.keys(instance.inputs).forEach((portName) => {
            const port = instance.inputs[portName];
            inPorts.push(this.processPort(portName, port));
        });
        Object.keys(instance.outputs).forEach((portName) => {
            const port = instance.outputs[portName];
            outPorts.push(this.processPort(portName, port));
        });

        const icon = instance.getIcon ? instance.getIcon() : 'gear';

        this.send('component', {
            name: component,
            description: instance.description,
            subgraph: instance.isSubgraph(),
            icon,
            inPorts,
            outPorts,
        },
            context);
    }

    async registerGraph(id: string, graph: Graph, context: Context) {
        const loader = this.getLoader();
        const sender = () => this.processComponent(loader, id, context);
        const send = debounce(sender, 10);



        // Send graph info again every time it changes so we get the updated ports
        graph.on('nodeAdded', send);
        graph.on('nodeRemoved', send);
        graph.on('edgeAdded', send);
        graph.on('edgeRemoved', send);
        graph.on('inputPortAdded', send);
        graph.on('inputPortRemoved', send);
        graph.on('outputPortAdded', send);
        graph.on('outputPortRemoved', send);


        await loader.registerComponent(library, name, graph);

        await loader.listComponents()
            .then(() => {

                // Send initial graph info back to client
                send();
            }, (err) => {
                this.send('error', err, context);
            });
    }
} ``
