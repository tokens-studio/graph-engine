import { Graph } from '../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Passthrough from '../../../src/nodes/generic/passthrough.js';


describe('Graph/topologic', () => {
	test('should throw an error if a connection would result in multiple connections', async () => {
		const graph = new Graph();

		const a = new Passthrough({ id: 'a', graph });
		const b = new Passthrough({ id: 'b', graph });
		const c = new Passthrough({ id: 'c', graph });

		expect(() => {
			a.outputs.value.connect(b.inputs.value);
			c.outputs.value.connect(b.inputs.value);
		}).to.throw();
	});
});
