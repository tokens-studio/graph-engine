import {
    EventEmitter,
} from 'events';
import { Runtime } from '../../src/runtime';

/**
 * An internal testing client
 */
export class Client extends EventEmitter {

    name: string;
    runtime: Runtime<Client>;

    constructor(runtime: Runtime<Client>, name?: string) {
        super();
        this.name = name;
        this.runtime = runtime;
        if (!this.name) { this.name = 'Unnamed client'; }
    }

    connect() {
        return this.runtime._connect(this);
    }

    disconnect() {
        return this.runtime._disconnect(this);
    }

    send(protocol, topic, payload) {
        return new Promise((resolve, reject) => {
            const m = {
                protocol,
                command: topic,
                payload,
            };
            const onMsg = (msg) => {
                if (msg.protocol !== protocol) {
                    // Unrelated, wait for next
                    this.once('message', onMsg);
                }
                if (msg.command === 'error') {
                    reject(new Error(msg.payload.message));
                    return;
                }
                resolve(msg.payload);
            };
            this.once('message', onMsg);
            this.emit('send', m);
        });
    }

    _receive(message) {
        return setTimeout(() => {
            this.emit('message', message);
        }, 1);
    }
}
