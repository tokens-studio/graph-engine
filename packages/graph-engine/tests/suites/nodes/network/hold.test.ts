import { StringSchema } from '../../../../src';
import { describe, expect, test } from 'vitest';
import { getFullyFeaturedGraph } from '@tests/utils/index.js';
import Node from '@/nodes/network/hold.js';

describe('network/hold', () => {
	test('Holds the provided value', async () => {
		const graph = getFullyFeaturedGraph();
		const node = new Node({ graph });
		//Then trigger the value
		node.inputs.value.trigger('foo', StringSchema);
		expect(node.outputs.value.value).to.equal('foo');
	});
});
