import { ControlFlowSpy, getFullyFeaturedGraph } from '@tests/utils/index.js';
import { describe, expect, test } from 'vitest';
import Node from '@/nodes/network/delay.js';

describe('network/delay', () => {
	test('provides the value after being triggered', async () => {
		const graph = getFullyFeaturedGraph();
		const node = new Node({ graph });
		const spy = new ControlFlowSpy({ graph });

		// Set the delay to 10ms
		node.inputs.delay.setValue(10);

		//Connect the delay node to the spy
		node.outputs.value.connect(spy.inputs.value);

		//Then trigger the value
		node.inputs.value.trigger('foo');

		//Create a promise to wait for the value to be triggered
		await new Promise(resolve => {
			setTimeout(() => {
				//Expect the value to be triggered after the delay
				expect(spy.spiedFunction).toBeCalledTimes(1);
				expect(spy.spiedFunction.mock.calls[0][0]).toBe('foo');
				resolve(0);
			}, 10);
		});
	});
});
