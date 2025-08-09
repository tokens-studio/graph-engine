import { Client } from "../utils/client";
import { Runtime } from "../../src/runtime";

describe('Runtime protocol', () => {
    let runtime = null;
    let client = null;

    describe('sending runtime:getruntime', () => {
        beforeEach(() => {
            runtime = new Runtime<Client>({});
            client = new Client(runtime);
            client.connect();
        });
        afterEach(() => {
            client.disconnect();
            client = null;
            runtime = null;
        });
        it('should respond with runtime:runtime for unauthorized user', () => client
            .send('runtime', 'getruntime', null)
            .then((payload) => {
                expect(payload.type).toEqual('noflo');
                expect(payload.capabilities).toEqual([]);
                expect(payload.allCapabilities).toContain('protocol:graph');
            }));
        it('should respond with runtime:runtime for authorized user', () => {
            client.disconnect();
            runtime = new Runtime({
                permissions: {
                    'super-secret': ['protocol:graph', 'protocol:component', 'unknown:capability'],
                    'second-secret': ['protocol:graph', 'protocol:runtime'],
                },
            });
            client = new Client(runtime);
            client.connect();
            return client.send('runtime', 'getruntime', {
                secret: 'super-secret',
            })
                .then((payload) => {
                    expect(payload.type).toEqual('noflo');
                    expect(payload.capabilities).toEqual(['protocol:graph', 'protocol:component']);
                    expect(payload.allCapabilities).toContain('protocol:graph');
                });
        });
    });
    describe('with a graph containing exported ports', () => {
        let ports = null;

        beforeEach(() => {
            runtime = new Runtime({
                permissions: {
                    'second-secret': ['protocol:graph', 'protocol:runtime', 'protocol:network'],
                }
            });
            runtime.runtime.on('ports', (emittedPorts) => {
                ports = emittedPorts;
            });
            client = new Client(runtime);
            client.connect();
        });
        afterEach(() => {
            client.disconnect();
            client = null;
            runtime = null;
            runtime = new Runtime({});
            ports = null;
        });
        it('should be possible to upload graph', () => Promise.resolve()
            .then(() => client.send('graph', 'clear', {
                id: 'bar',
                main: true,
                secret: 'second-secret',
            }))
            .then(() => client.send('graph', 'addnode', {
                id: 'Hello',
                component: 'core/Repeat',
                graph: 'bar',
                secret: 'second-secret',
            }))
            .then(() => client.send('graph', 'addnode', {
                id: 'World',
                component: 'core/Repeat',
                graph: 'bar',
                secret: 'second-secret',
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
                secret: 'second-secret',
            }))
            .then(() => client.send('graph', 'addinport', {
                public: 'in',
                node: 'Hello',
                port: 'in',
                graph: 'bar',
                secret: 'second-secret',
            }))
            .then(() => client.send('graph', 'addoutport', {
                public: 'out',
                node: 'World',
                port: 'out',
                graph: 'bar',
                secret: 'second-secret',
            })));
        it('should be possible to start the network', () => client
            .send('network', 'start', {
                graph: 'bar',
                secret: 'second-secret',
            }));
        it('packets sent to IN should be received at OUT', (done) => {
            const payload = { hello: 'World' };
            client.on('error', (err) => done(err));
            const messageListener = function (msg) {
                if (msg.protocol !== 'runtime') { return; }
                if (msg.command !== 'packet') { return; }
                if (msg.payload.port !== 'out') { return; }
                if (msg.payload.event !== 'data') { return; }
                expect(msg.payload.payload).toEqual(payload);
                client.removeListener('message', messageListener);
                done();
            };
            client.on('message', messageListener);
            client.send('runtime', 'packet', {
                graph: 'bar',
                port: 'in',
                event: 'data',
                payload,
                secret: 'second-secret',
            })
                .catch(done);
        });
        it('should have emitted ports via JS API', () => {
            expect(ports.inPorts.length).toEqual(1);
            expect(ports.outPorts.length).toEqual(1);
        });
        it('packets sent via JS API to IN should be received at OUT', (done) => {
            const payload = { hello: 'JavaScript' };
            runtime.runtime.on('packet', (msg) => {
                if (msg.event !== 'data') { return; }
                expect(msg.payload).toEqual(payload);
                done();
            });
            runtime.runtime.sendPacket({
                graph: 'bar',
                port: 'in',
                event: 'data',
                payload,
                secret: 'second-secret',
            })
                .catch(done);
        });
    });
});