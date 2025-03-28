import { Client } from "../utils/client";
import { Runtime } from "../../src/runtime";

describe('Graph protocol', () => {
  let runtime = null;
  let client = null;
  let client2 = null;
  let runtimeEvents = [];

  beforeEach(() => {
    runtime = new Runtime({
      permissions: {
        foo: ['protocol:graph'],
      }
    });
    runtime.graph.on('updated', (msg) => runtimeEvents.push(msg));
    client = new Client(runtime);
    client.connect();
    client2 = new Client(runtime);
    client2.connect();
  });
  afterEach(() => {
    client.disconnect();
    client = null;
    client2.disconnect();
    client2 = null;
    runtime = null;
  });

  describe('sending graph:clear', () => {
    it('should fail without proper authentication', () => {
      const payload = {
        id: 'mygraph',
        main: true,
      };
      return client.send('graph', 'clear', payload)
        .then(
          () => Promise.reject(new Error('Unexpected success')),
          () => true,
        );
    });
    it('should respond with graph:clear', () => {
      const payload = {
        id: 'mygraph',
        main: true,
        secret: 'foo',
      };
      return client.send('graph', 'clear', payload)
        .then((msg) => {
          expect(msg).toHaveProperty('id');
          expect(msg.id).toEqual(payload.id);
        });
    });
    it('should send to all clients', (done) => {
      const payload = {
        id: 'mygraph',
        main: true,
        secret: 'foo',
      };
      client2.once('message', (msg) => {
        expect(msg.protocol).toEqual('graph');
        expect(msg.command).toEqual('clear');
        expect(msg.payload).toHaveProperty('id');
        expect(msg.payload.id).toEqual(payload.id);
        done();
      });
      client.send('graph', 'clear', payload)
        .catch(done);
    });
  });

  describe('sending graph:addnode', () => {
    const graph = 'graphwithnodes';
    const payload = {
      id: 'node1',
      component: 'core/Repeat',
      graph,
      metadata: {},
    };
    const authenticatedPayload = JSON.parse(JSON.stringify(payload));
    authenticatedPayload.secret = 'foo';
    const checkAddNode = function (msg, done) {
      if (msg.command === 'error') {
        done(msg.payload);
        return;
      }
      if (msg.command !== 'addnode') {
        return;
      }
      expect(msg.protocol).toEqual('graph');
      expect(msg.payload).toEqual(payload);
      done();
    };
    afterAll(() => {
      runtimeEvents = [];
    });
    it('should respond with graph:addnode', (done) => {
      client.on('message', (msg) => checkAddNode(msg, done));
      client.send('graph', 'clear', { id: graph, main: true, secret: 'foo' })
        .then(() => client.send('graph', 'addnode', authenticatedPayload))
        .catch(done);
    });
    it('should have emitted an updated event', () => {
      expect(runtimeEvents.length).toEqual(1);
      const event = runtimeEvents.shift();
      expect(event.name).toEqual(graph);
    });
    it('should send to all clients', (done) => {
      client2.on('message', (msg) => checkAddNode(msg, done));
      client.send('graph', 'clear', { id: graph, main: true, secret: 'foo' })
        .then(() => client.send('graph', 'addnode', authenticatedPayload))
        .catch(done);
    });
  });

  describe('sending graph:addnode without an existing graph', () => {
    it('should respond with an error', () => client
      .send('graph', 'addnode', {
        id: 'foo',
        component: 'Bar',
        graph: 'not-found',
        metadata: {},
        secret: 'foo',
      })
      .then(
        () => Promise.reject(new Error('Unexpected success')),
        (err) => {
          expect(err.message).toEqual('Requested graph not found');
        },
      ));
  });
});