import { Graph } from '../../../src/graph/graph.js';
import { describe, expect, test } from 'vitest';
import Passthrough from '../../../src/nodes/generic/passthrough.js';

describe('Graph/options', () => {
	test('throws an error if strict mode is enabled', async () => {
		const graph = new Graph();

		new Passthrough({ id: 'a', graph });
		let thrown;
		try {
			await graph.execute({
				strict: true,
				inputs: {
					foo: {
						value: 1
					}
				}
			});
		} catch (err) {
			thrown = err;
		} finally {
			expect(thrown).toBeDefined();
			expect(thrown.message).toEqual('No input node found');
		}
	});
});
