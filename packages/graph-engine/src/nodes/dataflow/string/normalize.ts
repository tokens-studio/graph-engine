import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '@/programmatic/nodes/node.js';
import { StringSchema } from '../../../schemas/index.js';
import { ToInput } from '@/programmatic/dataflow/input.js';
import { ToOutput } from '@/programmatic/dataflow/output.js';

export enum NormalizationForm {
	NFD = 'NFD',
	NFC = 'NFC',
	NFKD = 'NFKD',
	NFKC = 'NFKC'
}

/**
 * This node normalizes strings and can remove diacritical marks (accents)
 */
export default class NodeDefinition extends DataflowNode {
	static title = 'Normalize';
	static type = 'studio.tokens.string.normalize';
	static description =
		'Normalizes strings and optionally removes diacritical marks';

	declare inputs: ToInput<{
		string: string;
		form: NormalizationForm;
		removeAccents: boolean;
	}>;
	declare outputs: ToOutput<{
		string: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('string', {
			type: StringSchema
		});
		this.addInput('form', {
			type: {
				...StringSchema,
				enum: Object.values(NormalizationForm),
				default: NormalizationForm.NFC
			}
		});
		this.addInput('removeAccents', {
			type: {
				type: 'boolean',
				title: 'Remove Accents',
				description: 'Whether to remove diacritical marks',
				default: true
			}
		});
		this.addOutput('string', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { string, form, removeAccents } = this.getAllInputs();

		let result = string.normalize(form);

		if (removeAccents) {
			// Remove combining diacritical marks
			result = result
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.normalize(form);
		}

		this.outputs.string.set(result);
	}
}
