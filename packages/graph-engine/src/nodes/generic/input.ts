import { IDeserializeOpts } from '../../graph/types.js';
import { INodeDefinition } from '../../programmatic/node.js';
import { Node } from '../../programmatic/node.js';
import {
	annotatedDynamicInputs,
	annotatedSingleton
} from '../../annotations/index.js';
import { getAllOutputs } from '@/utils/node.js';

/**
 * Acts as an output node for the graph. There can only be a single output node per graph.
 *
 * @example
 *
 * ```json
 * {"nodes":[{"id":"06820963-bbea-4a11-9d63-5e99dbcb27f7","type":"studio.tokens.generic.input","inputs":[{"name":"MyNumber","value":43,"type":{"$id":"https://schemas.tokens.studio/number.json","title":"Number","type":"number"},"annotations":{"ui.deletable":true}},{"name":"IsWorking","value":true,"type":{"$id":"https://schemas.tokens.studio/boolean.json","title":"Boolean","type":"boolean","default":false},"annotations":{"ui.deletable":true}},{"name":"BackgroundColor","value":"#2cd6d8","type":{"$id":"https://schemas.tokens.studio/color.json","title":"Color","type":"string"},"annotations":{"ui.deletable":true}},{"name":"SomeName","value":"Foo Bar","type":{"$id":"https://schemas.tokens.studio/string.json","title":"String","type":"string"},"annotations":{"ui.deletable":true}}],"annotations":{"engine.singleton":true,"engine.dynamicInputs":true,"ui.position.x":160.45137532552098,"ui.position.y":261.9444427490234}},{"id":"7dcf7462-3f8f-4144-9b2f-e9a7770495d4","type":"studio.tokens.generic.note","inputs":[],"annotations":{"ui.position.x":165.78470865885419,"ui.position.y":134.40046183268234,"ui.nodeType":"studio.tokens.generic.note","ui.description":"Inputs are the primary way information is passed into your graph. You should only have one of them per graph."}}],"edges":[],"annotations":{"engine.id":"efa13f81-66dc-4d9e-8651-a18e750773c5","engine.version":"0.12.0","ui.viewport":{"x":0,"y":0,"zoom":1.5},"ui.version":"2.9.4"}}
 * ```
 */
export default class NodeDefinition extends Node {
	static title = 'Input';
	static type = 'studio.tokens.generic.input';

	static description =
		'Allows you to provide initial values for the whole graph. An input node can be used only once at the start of the graph. You can use this node to set brand decisions or any initial values.';

	constructor(props: INodeDefinition) {
		super(props);
		//By default we don't define any ports, these are all dynamic
		this.annotations[annotatedSingleton] = true;
		this.annotations[annotatedDynamicInputs] = true;
	}

	static override async deserialize(opts: IDeserializeOpts) {
		const node = await super.deserialize(opts);
		//Create the outputs immediately
		Object.keys(node.inputs).forEach(input => {
			const rawInput = node.inputs[input];
			node.addOutput(input, {
				type: rawInput.type
			});
		});

		return node;
	}

	execute(): void | Promise<void> {
		const inputs = this.getAllInputs();
		const outputs = getAllOutputs(this);

		//Passthrough all
		Object.keys(inputs).forEach(input => {
			const rawInput = this.inputs[input];

			if (!(input in outputs)) {
				this.addOutput(input, {
					type: rawInput.type
				});
			} else {
				this.outputs[input].set(rawInput.value, rawInput.type);
			}

			this.outputs[input].set(rawInput.value, rawInput.type);
		});

		Object.keys(outputs).forEach(output => {
			if (!(output in inputs)) {
				delete this.outputs[output];
			}
		});
	}
}
