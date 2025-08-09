import { Clear, Dump, Error as ErrorMessage, Start, Stop } from '../messages/trace';
import { Context } from '../interfaces/context';
import  { Flowtrace } from 'flowtrace';
import { Network } from './network';
import { Transport } from '../interfaces/transport';


type MessageLookup = {
    error: ErrorMessage,
    start: Start,
    stop: Stop,
    dump: Dump,
    clear: Clear
}

type MessageType<T extends keyof MessageLookup> = MessageLookup[T];

/**
 * Provides communications related to tracing a FBP network
 */
export class TraceProtocol {
    transport: Transport
    /**
     * Lookup for traces by graph ID
     */
    traces: Record<string, Flowtrace>
    constructor(transport: Transport) {
        this.transport = transport;
        this.traces = {};
    }

    send<P extends keyof MessageLookup = keyof MessageLookup>(topic: P, payload: MessageType<P>, context:Context) {
        return this.transport.send('trace', topic, payload, context);
    }

    sendAll<P extends keyof MessageLookup = keyof MessageLookup>(topic: P, payload: MessageType<P>) {
        return this.transport.sendAll('trace', topic, payload);
    }

    receive(topic, payload, context) {
        switch (topic) {
            case 'start': {
                this.start(payload, context);
                break;
            }
            case 'stop': {
                this.stop(payload, context);
                break;
            }
            case 'dump': {
                this.dump(payload, context);
                break;
            }
            case 'clear': {
                this.clear(payload, context);
                break;
            }
            default: {
                this.send('error', new Error(`trace:${topic} not supported`), context);
            }
        }
    }

    resolveTracer(graph: string, context:Context) {
        if (!graph) {
            this.send('error', new Error('No graph specified'), context);
            return null;
        }
        if (!this.traces[graph]) {
            this.send('error', new Error(`Trace for requested graph '${graph}' not found`), context);
            return null;
        }
        return this.traces[graph];
    }

    startTrace(graphId: string, network: Network, buffersize = 400) {
        const metadata = this.transport.runtime.getRuntimeDefinition();
        const tracer = this.traces[graphId] = this.traces[graphId] || new Flowtrace(metadata, buffersize);
        network.setFlowtrace(tracer);
        return tracer;
    }

    start(payload, context) {
        const network = this.transport.network.getNetwork(payload.graph);
        if (!network) {
            this.send('error', new Error(`Network for requested graph '${payload.graph}' not found`), context);
            return;
        }
        const buffersize = payload.buffersize || 400;
        this.startTrace(payload.graph, network, buffersize);
        this.sendAll('start', {
            graph: payload.graph,
            buffersize,
        });
    }

    stop(payload:Stop, context:Context) {
        const tracer = this.resolveTracer(payload.graph, context);
        if (!tracer) {
            return;
        }
        const network = this.transport.network.getNetwork(payload.graph);
        if (!network) {
            this.send('error', new Error(`Network for requested graph '${payload.graph}' not found`), context);
            return;
        }
        network.setFlowtrace(null);
        this.sendAll('stop', {
            graph: payload.graph,
        });
    }

    dump(payload:Dump, context:Context) {
        const tracer = this.resolveTracer(payload.graph, context);
        if (!tracer) {
            return;
        }
        this.send('dump', {
            graph: payload.graph,
            type: 'flowtrace.json',
            flowtrace: tracer.toJSON(),
        }, context);
    }

    clear(payload: Clear, context:Context) {
        const tracer = this.resolveTracer(payload.graph, context);
        if (!tracer) {
            return;
        }
        tracer.clear();
        this.sendAll('clear', {
            graph: payload.graph,
        });
    }
}
