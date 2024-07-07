// src/nodes/string/interpolate.ts

import { INodeDefinition, Node } from '../../programmatic/node.js';
import { StringSchema } from '../../schemas/index.js';
import { ToInput, ToOutput } from '../../programmatic';
import { annotatedDynamicInputs } from '../../annotations/index.js';

export default class StringInterpolationNode extends Node {
	static title = 'Interpolation';
	static type = 'studio.tokens.string.interpolate';
	static description = 'Interpolates a string with provided values';

	declare inputs: ToInput<{
		template: string;
	}> &
		ToInput<{
			[key: string]: any;
		}>;

	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.annotations[annotatedDynamicInputs] = true;

		this.addInput('template', {
			type: StringSchema
		});

		this.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { template, ...variables } = this.getAllInputs();

		try {
			const interpolatedString = template.replace(
				/\{(\w+)\}/g,
				(match, key) => {
					if (key in variables) {
						return String(variables[key]);
					}
					return match; // If no replacement found, leave as is
				}
			);

			this.setOutput('value', interpolatedString);
		} catch (error) {
			this.error = new Error(
				`Error during string interpolation: ${error.message}`
			);
		}
	}
}
