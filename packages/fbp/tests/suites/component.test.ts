import { Client } from "../utils/client";
import { Runtime } from "../../src/runtime";

describe('Component protocol', () => {
    let runtime = null;
    let client = null;
    let client2 = null;
    let runtimeEvents = [];

    beforeEach(() => {
        runtime = new Runtime({
            permissions: {
                foo: [
                    'protocol:component',
                    'component:setsource',
                    'component:getsource',
                ],
            },
        });
        runtime.component.on('updated', (msg) => runtimeEvents.push(msg));
        client = new Client(runtime);
        client.connect();
        client2 = new Client(runtime);
        return client2.connect();
    });
    afterEach(() => {
        client.disconnect();
        client = null;
        client2.disconnect();
        client2 = null;
        runtime = null;
    });

    describe('sending component:list', () => {
        it('should fail without proper authentication', () => {
            const payload = {};
            return client.send('component', 'list', payload)
                .then(
                    () => Promise.reject(new Error('Unexpected success')),
                    () => true,
                );
        });
        return it('should respond with list of components and a componentsready', (done) => {
            const payload = { secret: 'foo' };
            let componentsReceived = 0;
            const listener = (msg) => {
                expect(msg.protocol).toEqual('component');
                expect([
                    'component',
                    'componentsready',
                ]).toContain(msg.command);
                if (msg.command === 'componentsready') {
                    expect(msg.payload).toEqual(componentsReceived);
                    done();
                    return;
                }
                componentsReceived += 1;
                client.once('message', listener);
            };
            client.once('message', listener);
            client.send('component', 'list', payload);
        });
    });

    describe('sending component:getsource', () => {
        it('should fail without proper authentication', () => {
            const payload = { name: 'core/Repeat' };
            return client.send('component', 'getsource', payload)
                .then(
                    () => Promise.reject(new Error('Unexpected success')),
                    () => true,
                );
        });
        return it('should respond with the source code of the component', () => {
            const msg = {
                name: 'core/Repeat',
                secret: 'foo',
            };
            return client.send('component', 'getsource', msg)
                .then((payload) => {
                    expect(payload.library).toEqual('core');
                    expect(payload.name).toEqual('Repeat');
                    expect([
                        'javascript',
                        'coffeescript',
                    ]).toContain(payload.language);
                    expect(typeof payload.code).toEqual('string');
                });
        });
    });

    return describe('sending component:source', () => {
        const source = `\
var noflo = require('noflo');
exports.getComponent = function () {
  return noflo.asComponent(Math.random);
};\
`;
        beforeAll(() => runtimeEvents = []);
        afterAll(() => runtimeEvents = []);
        it('should fail without proper authentication', () => {
            const payload = {
                name: 'GetRandom',
                library: 'math',
                language: 'javascript',
                code: source,
                tests: '',
            };
            return client.send('component', 'source', payload)
                .then(
                    () => Promise.reject(new Error('Unexpected success')),
                    () => true,
                );
        });
        it('should not have emitted updated events', () => expect(runtimeEvents).toEqual([]));
        it('should respond with a new component', (done) => {
            const payload = {
                name: 'GetRandom',
                library: 'math',
                language: 'javascript',
                code: source,
                tests: '',
                secret: 'foo',
            };
            client.once('message', (msg) => {
                expect(msg.protocol).toEqual('component');
                expect(msg.command).toEqual('component');
                expect(msg.payload.name).toEqual('math/GetRandom');
                return done();
            });
            client.send('component', 'source', payload);
        });
        return it('should have emitted a updated event', () => {
            expect(runtimeEvents.length).toEqual(1);
            const event = runtimeEvents.shift();
            expect(event.name).toEqual('GetRandom');
            expect(event.library).toEqual('math');
            expect(event.language).toEqual('javascript');
            expect(event.code).toEqual(source);
        });
    });
});