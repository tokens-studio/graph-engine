import { BaseTransport } from './base';


export type RawMessage = {
    protocol: string,
    command: string,
    payload: unknown,
}

export interface Client {
    on(event: 'send', listener: (msg: unknown) => void): this;
    _receive(msg: RawMessage): void;
}

export class Runtime<TClient extends Client> extends BaseTransport {

    clients: TClient[];

    constructor(options) {
        super(options);
        this.clients = [];
    }

    _connect(client: TClient) {
        this.clients.push(client);
        client.on('send', (msg) => {
            // Capture context
            this._receive(msg, { client });
        });
    }

    _disconnect(client) {
        if (this.clients.indexOf(client) === -1) { return; }
        this.clients.splice(this.clients.indexOf(client), 1);
        client.removeAllListeners('send'); // XXX: a bit heavy
    }

    _receive(msg, context) {
        // Forward to Base
        this.receive(msg.protocol, msg.command, msg.payload, context);
    }

    send(protocol, topic, payload, context) {
        if (!context || !context.client) { return; }
        const m = {
            protocol,
            command: topic,
            payload,
        };
        context.client._receive(m);
    }

    sendAll(protocol, topic, payload) {
        const m = {
            protocol,
            command: topic,
            payload,
        };
        this.clients.forEach((client) => {
            client._receive(m);
        });
    }
}
