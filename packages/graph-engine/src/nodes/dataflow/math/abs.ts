import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { NumberSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

/**
 * @example
 *
 * ```json
 * {"nodes":[{"id":"9cfd3826-4570-493c-a672-ed8b642ed537","type":"studio.tokens.math.abs","inputs":[{"name":"input","value":-100,"type":{"$id":"https://schemas.tokens.studio/number.json","title":"Number","type":"number"},"visible":true}],"annotations":{"ui.position.x":444.45137532552087,"ui.position.y":215.06712849934894}},{"id":"0a1e0778-47b0-423d-8d21-57230bd84b6d","type":"studio.tokens.generic.constant","inputs":[{"name":"value","value":-100,"type":{"$id":"https://schemas.tokens.studio/any.json","title":"Any"},"dynamicType":{"$id":"https://schemas.tokens.studio/number.json","title":"Number","type":"number"},"annotations":{"ui.resetable":true}}],"annotations":{"ui.position.x":53.11804199218744,"ui.position.y":214.4004618326823}}],"edges":[{"id":"f076c4f6-536c-4ddc-bfee-6b658eab3036","source":"0a1e0778-47b0-423d-8d21-57230bd84b6d","sourceHandle":"value","target":"9cfd3826-4570-493c-a672-ed8b642ed537","targetHandle":"input"}],"annotations":{"engine.id":"81cead46-1d98-478a-adcc-074d90c81f9f","engine.capabilities.web-audio":"0.0.0","engine.capabilities.fs":"0.0.0","engine.version":"0.12.0","ui.viewport":{"x":145.0460710070189,"y":146.7716604603002,"zoom":1.1023008602108806},"ui.version":"2.9.4"}}
 * ```
 */
export default class NodeDefinition extends DataflowNode {
	static title = 'Absolute';
	static type = 'studio.tokens.math.abs';
	static description =
		'Absolute node allows you to get the absolute value of a number. Turning a negative number to positive.';

	declare inputs: ToInput<{
		input: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('input', {
			type: NumberSchema
		});
		this.dataflow.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const input = this.inputs.input.value;
		this.outputs.value.set(Math.abs(input));
	}
}
