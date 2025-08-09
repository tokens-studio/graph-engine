import { Client } from "../utils/client";
import { Runtime } from "../../src/runtime";

describe('Network protocol', () => {
    let runtime = null;
    let client: Client | null = null;
    beforeAll(() => {
        runtime = new Runtime({
            permissions: {
                foo: ['protocol:graph', 'protocol:network'],
            }
        });
    });
    beforeEach(() => {
        client = new Client(runtime);
        client.connect();
    });
    afterEach(() => {
        if (!client) { return; }
        client.removeAllListeners('message');
        client.disconnect();
        client = null;
    });

    describe('defining a graph', () => {
        it('should succeed', () => Promise.resolve()
            .then(() => client.send('graph', 'clear', {
                id: 'bar',
                main: true,
                secret: 'foo',
            }))
            .then(() => client.send('graph', 'addnode', {
                id: 'Hello',
                component: 'core/Repeat',
                graph: 'bar',
                secret: 'foo',
            }))
            .then(() => client.send('graph', 'addnode', {
                id: 'World',
                component: 'core/Drop',
                graph: 'bar',
                secret: 'foo',
            }))
            .then(() => client.send('graph', 'addedge', {
                src: {
                    node: 'Hello',
                    port: 'out',
                },
                tgt: {
                    node: 'World',
                    port: 'in',
                },
                graph: 'bar',
                secret: 'foo',
            }))
            .then(() => client.send('graph', 'addinitial', {
                src: {
                    data: 'Hello, world!',
                },
                tgt: {
                    node: 'Hello',
                    port: 'in',
                },
                graph: 'bar',
                secret: 'foo',
            })));
    });
    describe('starting the network', () => {
        it('should process the nodes and stop when it completes', (done) => {
            const expects = [
                'started',
                'data',
                'data',
                'stopped',
            ];
            client.on('message', (msg) => {
                if (msg.protocol !== 'network') { return; }
                expect(msg.protocol).toEqual('network');
                expect(msg.command).toEqual(expects.shift());
                if (!expects.length) {
                    done();
                }
            });
            client.send('network', 'start', {
                graph: 'bar',
                secret: 'foo',
            })
                .catch(done);
        });
        it('should provide a "finished" status', (done) => {
            client.on('message', (msg) => {
                expect(msg.protocol).toEqual('network');
                expect(msg.command).toEqual('status');
                expect(msg.payload.graph).toEqual('bar');
                expect(msg.payload.running).toEqual(false);
                expect(msg.payload.started).toEqual(false);
                done();
            });
            client.send('network', 'getstatus', {
                graph: 'bar',
                secret: 'foo',
            })
                .catch(done);
        });
        it('should be able to rename a node', () => client
            .send('graph', 'renamenode', {
                from: 'World',
                to: 'NoFlo',
                graph: 'bar',
                secret: 'foo',
            }));
        it('should not be able to add a node with a non-existing component', () => client
            .send('graph', 'addnode', {
                id: 'Nonworking',
                component: '404NotFound',
                graph: 'bar',
                secret: 'foo',
            })
            .then(
                () => Promise.reject(new Error('Unexpected success')),
                (err) => {
                    expect(err.message).toContain('Component 404NotFound not available');
                },
            ));
    });
});