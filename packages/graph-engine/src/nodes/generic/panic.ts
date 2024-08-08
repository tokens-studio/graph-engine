import { AnySchema } from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput } from '../../index.js';

/**
 * @example
 *
 * ```json
 * {"nodes":[{"id":"b9fe0c33-d89e-4fad-85cc-eb000e269622","type":"studio.tokens.generic.constant","inputs":[{"name":"value","value":false,"type":{"$id":"https://schemas.tokens.studio/any.json","title":"Any"},"dynamicType":{"$id":"https://schemas.tokens.studio/boolean.json","title":"Boolean","type":"boolean","default":false},"annotations":{"ui.resetable":true}}],"annotations":{"ui.position.x":35.11804199218733,"ui.position.y":246.32638579631532}},{"id":"4c5e0b58-1d11-4d79-b488-bcddf5ea5e2c","type":"studio.tokens.generic.panic","inputs":[{"name":"trigger","value":false,"type":{"$id":"https://schemas.tokens.studio/any.json","title":"Any"},"dynamicType":{"$id":"https://schemas.tokens.studio/boolean.json","title":"Boolean","type":"boolean","default":false},"visible":true}],"annotations":{"ui.position.x":429.1180419921875,"ui.position.y":244.32638579631532}},{"id":"1e615f42-87e1-4110-a541-b5dd9523dc52","type":"studio.tokens.generic.note","inputs":[],"annotations":{"ui.position.x":231.78470865885424,"ui.position.y":22.326385796315336,"ui.nodeType":"studio.tokens.generic.note","ui.description":"The Panic node will trigger an error if any truthy value is set to it. Try changing the value of the constant to true to see it in action. \n\nThis can be used for things like input validation or other complex error conditions to fail a graph."}}],"edges":[{"id":"5acad9fa-ef6a-48e1-b402-68bbf1e68044","source":"b9fe0c33-d89e-4fad-85cc-eb000e269622","sourceHandle":"value","target":"4c5e0b58-1d11-4d79-b488-bcddf5ea5e2c","targetHandle":"trigger"}],"annotations":{"engine.id":"184283f1-ffce-469f-9712-de360aecfc9f","engine.capabilities.web-audio":"0.0.0","engine.capabilities.fs":"0.0.0","engine.version":"0.12.0","ui.viewport":{"x":0,"y":111.11111405455044,"zoom":1.5},"ui.version":"2.9.4"}}
 * ```
 */
export default class NodeDefinition extends DataflowNode {
	static title = 'Panic';
	static type = 'studio.tokens.generic.panic';
	static description = 'Panics if passed a truthy value';

	declare inputs: ToInput<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		trigger: any;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('trigger', {
			type: AnySchema
		});
	}

	execute(): void | Promise<void> {
		const { trigger } = this.getAllInputs();

		if (trigger) {
			throw new Error(`Panic! Received ${trigger}`);
		}
	}
}
