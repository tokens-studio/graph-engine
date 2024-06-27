import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { NumberSchema, createVariadicSchema } from '../../schemas/index.js';

/**
 * @example
 *
 * ```json
 * {"nodes":[{"id":"69cba311-a27f-4809-8fe4-496d42486c08","type":"studio.tokens.math.addVariadic","inputs":[{"name":"inputs","value":[42,3],"type":{"title":"Number[]","type":"array","items":{"$id":"https://schemas.tokens.studio/number.json","title":"Number","type":"number"},"default":[]},"variadic":true,"visible":true}],"annotations":{"ui.position.x":385.11804199218744,"ui.position.y":160.4004618326823}},{"id":"ec280cbe-bc87-4bff-9cbc-530e511e3cac","type":"studio.tokens.generic.constant","inputs":[{"name":"value","value":42,"type":{"$id":"https://schemas.tokens.studio/any.json","title":"Any"},"dynamicType":{"$id":"https://schemas.tokens.studio/number.json","title":"Number","type":"number"},"annotations":{"ui.resetable":true}}],"annotations":{"ui.position.x":-22.8819580078125,"ui.position.y":359.7337951660156}},{"id":"75487ffd-7671-44a7-88b4-71798cdebf8c","type":"studio.tokens.generic.constant","inputs":[{"name":"value","value":3,"type":{"$id":"https://schemas.tokens.studio/any.json","title":"Any"},"dynamicType":{"$id":"https://schemas.tokens.studio/number.json","title":"Number","type":"number"},"annotations":{"ui.resetable":true}}],"annotations":{"ui.position.x":-22.8819580078125,"ui.position.y":359.7337951660156}},{"id":"9e3bf536-f1ff-49d3-9291-d8ec91dfe916","type":"studio.tokens.generic.constant","inputs":[{"name":"value","value":6,"type":{"$id":"https://schemas.tokens.studio/any.json","title":"Any"},"dynamicType":{"$id":"https://schemas.tokens.studio/number.json","title":"Number","type":"number"},"annotations":{"ui.resetable":true}}],"annotations":{"ui.position.x":-22.8819580078125,"ui.position.y":359.7337951660156}},{"id":"d28e91e4-918f-4928-8221-c33b7fd81ce2","type":"studio.tokens.generic.note","inputs":[],"annotations":{"ui.position.x":136.36369921737844,"ui.position.y":-14.385675110158786,"ui.nodeType":"studio.tokens.generic.note","ui.description":"Try connect the last constant to the `inputs +` handle."}}],"edges":[{"id":"b0c3194a-7817-4724-b51b-aca20af7c2c9","source":"ec280cbe-bc87-4bff-9cbc-530e511e3cac","sourceHandle":"value","target":"69cba311-a27f-4809-8fe4-496d42486c08","targetHandle":"inputs","annotations":{"engine.index":0}},{"id":"ad6e165c-7514-44b1-90f9-9d21df4720cc","source":"75487ffd-7671-44a7-88b4-71798cdebf8c","sourceHandle":"value","target":"69cba311-a27f-4809-8fe4-496d42486c08","targetHandle":"inputs","annotations":{"engine.index":1}}],"annotations":{"engine.id":"f4a6a09d-0550-414f-a183-389a7d241402","engine.capabilities.web-audio":"0.0.0","engine.capabilities.fs":"0.0.0","engine.version":"0.12.0","ui.viewport":{"x":175.36324003942718,"y":143.45803479766573,"zoom":1.1023008602108806},"ui.version":"2.9.4"}}
 * ```
 */
export default class NodeDefinition extends Node {
	static title = 'Add Node (Variadic)';
	static type = 'studio.tokens.math.addVariadic';
	static description = 'Add node allows you to add two or more numbers.';

	declare inputs: ToInput<{
		inputs: number[];
	}>;
	declare outputs: ToOutput<{
		value: number;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('inputs', {
			type: {
				...createVariadicSchema(NumberSchema),
				default: []
			},
			variadic: true
		});
		this.addOutput('value', {
			type: NumberSchema
		});
	}

	execute(): void | Promise<void> {
		const inputs = this.getInput('inputs') as number[];
		const output = inputs.reduce((acc, curr) => acc + curr, 0);
		this.setOutput('value', output);
	}
}
