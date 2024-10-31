import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema } from '../../schemas/index.js';

/**
 * @example
 *
 * ```json
 * {"nodes":[{"id":"dad17632-5b26-4583-b3ea-03c5567be7f4","type":"studio.tokens.math.add","inputs":[{"name":"a","value":5,"type":{"$id":"https://schemas.tokens.studio/number.json","title":"Number","type":"number"},"visible":true},{"name":"b","value":2,"type":{"$id":"https://schemas.tokens.studio/number.json","title":"Number","type":"number"},"visible":true}],"annotations":{"ui.position.x":575,"ui.position.y":108}},{"id":"741ab9e6-1ef2-4e8b-afb6-a16bfc155f49","type":"studio.tokens.generic.constant","inputs":[{"name":"value","value":5,"type":{"$id":"https://schemas.tokens.studio/any.json","title":"Any"},"dynamicType":{"$id":"https://schemas.tokens.studio/number.json","title":"Number","type":"number"},"annotations":{"ui.resetable":true}}],"annotations":{"ui.position.x":173,"ui.position.y":194.16666666666669}},{"id":"7552b3dd-cb1f-4ddc-945e-6f5942c771a6","type":"studio.tokens.generic.constant","inputs":[{"name":"value","value":2,"type":{"$id":"https://schemas.tokens.studio/any.json","title":"Any"},"dynamicType":{"$id":"https://schemas.tokens.studio/number.json","title":"Number","type":"number"},"annotations":{"ui.resetable":true}}],"annotations":{"ui.position.x":173,"ui.position.y":194.16666666666669}}],"edges":[{"id":"81092f62-40b0-4fa8-acb2-d7096953a794","source":"741ab9e6-1ef2-4e8b-afb6-a16bfc155f49","sourceHandle":"value","target":"dad17632-5b26-4583-b3ea-03c5567be7f4","targetHandle":"a"},{"id":"19a46899-78ca-4e65-8b7a-b5af30b59e4a","source":"7552b3dd-cb1f-4ddc-945e-6f5942c771a6","sourceHandle":"value","target":"dad17632-5b26-4583-b3ea-03c5567be7f4","targetHandle":"b"}],"annotations":{"engine.id":"25df5d50-c097-444d-941e-8152a443927b","engine.capabilities.web-audio":"0.0.0","engine.capabilities.fs":"0.0.0","engine.version":"0.12.0","ui.viewport":{"x":10.228731796548118,"y":221.02227938493957,"zoom":1.1023008602108806},"ui.version":"2.9.4"}}
 * ```
 */
export default class NodeDefinition extends Node {
	static title = 'Add';
	static type = 'studio.tokens.math.add';
	static description = 'Add node allows you to add two numbers.';
	declare inputs: ToInput<{
		a: number;
		b: number;
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('a', {
			type: NumberSchema
		});
		this.addInput('b', {
			type: NumberSchema
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const { a, b } = this.getAllInputs();
		this.outputs.value.set(a + b);
	}
}
