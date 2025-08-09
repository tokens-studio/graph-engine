import { Graph, SerializedGraph, nodeLookup } from "@tokens-studio/graph-engine";
import { Runtime } from "../../src/runtime";
import { loader } from "../utils/loader";
import Basic from '../data/basic.json'

describe('Base interface', () => {
    describe('without a graph', () => {
        it('should become ready without network', (done) => {
            const rt = new Runtime({
                loader
            });
            rt.on('ready', (net) => {
                expect(net).toEqual(null);
                done();
            });
        });
    });
    describe('with a working default graph', () => {
        it('should register and run a network', (done) => {

            const graph = new Graph().deserialize(Basic as unknown as SerializedGraph, nodeLookup);
            let readyReceived = false;
            let startReceived = false;

            const rt = new Runtime({
                defaultGraph: graph,
                loader
            });

            rt.on('ready', (net) => {
                expect(typeof net).toEqual('object');
                expect(typeof net.start).toEqual('function');
                expect(typeof net.graph).toEqual(graph);
                readyReceived = true;
            });
            rt.network.on('addnetwork', (network) => {
                network.on('start', () => {
                    startReceived = true;
                });
                network.on('end', () => {
                    expect(readyReceived).toEqual(true);
                    expect(startReceived).toEqual(true);
                    done();
                });
            });

        });
    });
});