import {
	AnySchema,
	convertSchemaTypeExtended,
	getConversionDescriptionExtended
} from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';

/**
 * A node that converts between different types automatically.
 * This node is typically inserted automatically when connecting incompatible but convertible types.
 */
export default class NodeDefinition<TInput = any, TOutput = any> extends Node {
	static title = 'Type Converter';
	static type = 'studio.tokens.generic.typeConverter';
	static description = 'Automatically converts between compatible types';

	declare inputs: ToInput<{
		value: TInput;
	}>;
	declare outputs: ToOutput<{
		value: TOutput;
	}>;

	private sourceType: any = AnySchema;
	private targetType: any = AnySchema;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('value', {
			type: AnySchema
		});
		this.addOutput('value', {
			type: AnySchema
		});
	}

	/**
	 * Sets the source and target types for this converter
	 */
	setConversionTypes(sourceType: any, targetType: any) {
		this.sourceType = sourceType;
		this.targetType = targetType;

		// Update the input and output types using the proper API
		this.inputs.value.setType(sourceType);
		this.outputs.value.setType(targetType);

		// Store conversion info in annotations for UI display
		this.annotations['conversion.source'] = sourceType.$id;
		this.annotations['conversion.target'] = targetType.$id;
		this.annotations['conversion.description'] =
			getConversionDescriptionExtended(sourceType, targetType);
	}

	/**
	 * Gets the conversion description for display
	 */
	getConversionDescription(): string {
		return (this.annotations['conversion.description'] as string) || 'ANY→ANY';
	}

	execute(): void | Promise<void> {
		const input = this.inputs.value;
		const convertedValue = convertSchemaTypeExtended(
			this.sourceType,
			this.targetType,
			input.value
		);
		this.outputs.value.set(convertedValue, this.targetType);
	}
}
