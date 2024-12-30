import { Graph } from '../../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/array/remove.js';

describe('array/remove', () => {
    test('removes an item at a positive index', async () => {
        const graph = new Graph();
        const node = new Node({ graph });

        node.inputs.array.setValue([1, 2, 3, 4, 5]);
        node.inputs.index.setValue(2);

        await node.execute();

        expect(node.outputs.array.value).to.eql([1, 2, 4, 5]);
        expect(node.outputs.item.value).to.eql(3);
    });

    test('removes an item at a negative index', async () => {
        const graph = new Graph();
        const node = new Node({ graph });

        node.inputs.array.setValue(['a', 'b', 'c', 'd']);
        node.inputs.index.setValue(-2);

        await node.execute();

        expect(node.outputs.array.value).to.eql(['a', 'b', 'd']);
        expect(node.outputs.item.value).to.eql('c');
    });

    test('does not modify array when index is out of bounds', async () => {
        const graph = new Graph();
        const node = new Node({ graph });

        node.inputs.array.setValue([1, 2, 3]);
        node.inputs.index.setValue(5);

        await node.execute();

        expect(node.outputs.array.value).to.eql([1, 2, 3]);
        expect(node.outputs.item.value).to.be.undefined;
    });

    test('does not mutate the original array', async () => {
        const graph = new Graph();
        const node = new Node({ graph });

        const originalArray = [1, 2, 3, 4];
        node.inputs.array.setValue(originalArray);
        node.inputs.index.setValue(1);

        await node.execute();

        expect(originalArray).to.eql([1, 2, 3, 4]);
    });
}); 