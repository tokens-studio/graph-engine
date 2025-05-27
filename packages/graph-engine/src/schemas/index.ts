import { arrayOf } from './utils.js';

export const variadicId = (id: string) => id.replace('.json', '-variadic.json');

export type SchemaObject = {
	[key: string]: any;
};

export const createVariadicSchema = baseSchema => {
	return {
		// Currently we don't set the id here because we don't want to register this schema. Its likely that its structural and that anything that introspects it attempts to read the id from the baseschema
		title: baseSchema.title + '[]',
		type: 'array',
		items: baseSchema
	};
};

export const NUMBER = 'https://schemas.tokens.studio/number.json';
export const NumberSchema: SchemaObject = {
	$id: NUMBER,
	title: 'Number',
	type: 'number'
};

export const STRING = 'https://schemas.tokens.studio/string.json';
export const StringSchema: SchemaObject = {
	$id: STRING,
	title: 'String',
	type: 'string'
};

export const COLOR = 'https://schemas.tokens.studio/color.json';
export const ColorSchema: SchemaObject = {
	$id: COLOR,
	title: 'Color',
	type: 'object',
	properties: {
		channels: arrayOf(NumberSchema),
		space: StringSchema,
		alpha: NumberSchema
	},
	default: {
		channels: [0, 0, 0],
		space: 'srgb'
	},
	required: ['channels', 'space']
};

export const COLOR_OBJECT = 'https://schemas.tokens.studio/colorObject.json';
export const ColorObjectSchema: SchemaObject = {
	$id: COLOR,
	title: 'Color Object',
	type: 'string'
};

export const DIMENSION = 'https://schemas.tokens.studio/dimension.json';
export const DimensionSchema: SchemaObject = {
	$id: DIMENSION,
	title: 'Dimension',
	type: 'object',
	properties: {
		value: {
			type: NumberSchema
		},
		unit: {
			type: StringSchema
		}
	}
};

export const ANY = 'https://schemas.tokens.studio/any.json';
export const AnySchema: SchemaObject = {
	$id: ANY,
	title: 'Any'
	//We don't specify a type here because we want to allow any type
};

export const ANY_ARRAY = 'https://schemas.tokens.studio/anyArray.json';
export const AnyArraySchema: SchemaObject = {
	title: 'Any[]',
	type: 'array',
	items: AnySchema,
	default: []
	//We don't specify a type here because we want to allow any type
};

export const BOOLEAN = 'https://schemas.tokens.studio/boolean.json';
export const BooleanSchema: SchemaObject = {
	$id: BOOLEAN,
	title: 'Boolean',
	type: 'boolean',
	default: false
};

export const OBJECT = 'https://schemas.tokens.studio/object.json';
export const ObjectSchema: SchemaObject = {
	$id: OBJECT,
	title: 'Object',
	type: 'object'
};

export const FLOATCURVE = 'https://schemas.tokens.studio/floatCurve.json';
export const FloatCurveSchema: SchemaObject = {
	$id: FLOATCURVE,
	title: 'Float curve',
	type: 'object',
	default: {
		controlPoints: [
			[
				[0.25, 0.25],
				[0.75, 0.75]
			]
		],
		segments: [
			[0, 0],
			[1, 1]
		]
	},
	properties: {
		segments: {
			type: 'array',
			items: {
				type: 'array',
				items: {
					type: 'array',
					items: [
						{
							type: 'number'
						},
						{
							type: 'number'
						}
					]
				}
			}
		},
		controlPoints: {
			type: 'array',
			items: {
				type: 'array',
				items: [
					{
						type: 'number'
					},
					{
						type: 'number'
					}
				]
			}
		}
	}
};

export const CURVE = 'https://schemas.tokens.studio/curve.json';
export const CurveSchema: SchemaObject = {
	$id: CURVE,
	title: 'Curve',
	type: 'object',
	default: {
		curves: [
			{
				type: 'bezier',
				points: [
					[0, 0],
					[0.25, 0.6],
					[0.75, 0.4],
					[1, 1]
				]
			}
		]
	},
	properties: {
		curves: {
			type: 'array',
			items: [
				{
					type: 'object',
					properties: {
						type: {
							type: 'string'
						},
						points: {
							type: 'array',
							items: [
								{
									type: 'array',
									items: [
										{
											type: 'integer'
										},
										{
											type: 'integer'
										}
									]
								},
								{
									type: 'array',
									items: [
										{
											type: 'number'
										},
										{
											type: 'number'
										}
									]
								},
								{
									type: 'array',
									items: [
										{
											type: 'number'
										},
										{
											type: 'number'
										}
									]
								},
								{
									type: 'array',
									items: [
										{
											type: 'integer'
										},
										{
											type: 'integer'
										}
									]
								}
							]
						}
					},
					required: ['type', 'points']
				}
			]
		}
	},
	required: ['curves']
};

export const VEC2 = 'https://schemas.tokens.studio/vec2.json';
export const Vec2Schema: SchemaObject = {
	$id: VEC2,
	title: 'Vec2',
	type: 'array',
	minItems: 2,
	maxItems: 2,
	items: NumberSchema,
	default: [0, 0]
};

export const VEC3 = 'https://schemas.tokens.studio/vec3.json';
export const Vec3Schema: SchemaObject = {
	$id: VEC3,
	title: 'Vec3',
	type: 'array',
	minItems: 3,
	maxItems: 3,
	items: NumberSchema,
	default: [0, 0, 0]
};

export const GRADIENT_STOP = 'https://schemas.tokens.studio/gradientStop.json';
export const GradientStopSchema: SchemaObject = {
	$id: GRADIENT_STOP,
	title: 'Gradient Stop',
	type: 'object',
	default: null,
	properties: {
		position: {
			type: 'number'
		},
		color: {
			type: 'string'
		}
	}
};

export const GRADIENT = 'https://schemas.tokens.studio/gradient.json';
export const GradientSchema: SchemaObject = {
	$id: GRADIENT,
	title: 'Gradient',
	type: 'object',
	default: null,
	properties: {
		type: {
			type: 'string',
			enum: ['linear', 'radial', 'angular', 'diamond']
		},
		positions: {
			type: 'array',
			items: [
				{
					type: 'array',
					items: [
						{
							type: 'number'
						},
						{
							type: 'number'
						}
					]
				}
			]
		},
		stops: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					position: {
						type: 'number'
					},
					color: {
						type: ColorSchema
					}
				},
				required: ['position', 'color']
			}
		}
	}
};

export const BUFFER = 'https://schemas.tokens.studio/buffer.json';
export const BufferSchema: SchemaObject = {
	$id: BUFFER,
	title: 'Buffer',
	type: 'object',
	default: null,
	//Listing all the properties of a buffer is not practical
	properties: {}
};

/**
 * Checks whether a schema can be converted to another schema
 * @param src
 * @param target
 * @returns
 */
export const canConvertSchemaTypes = (
	src: SchemaObject,
	target: SchemaObject
) => {
	if (src.$id === target.$id) return true;
	//Any can always accept anything
	if (target.$id === ANY) return true;
	if (src.$id === ANY) return true;

	if (src.type == 'array' && target.$id == ANY_ARRAY) {
		return true;
	}
	if (src.type == 'array' && target.type == 'array') {
		if (target.items?.$id === ANY) return true;
	}

	switch (src.$id) {
		case NUMBER:
			switch (target.$id) {
				case STRING:
				case BOOLEAN:
				case COLOR:
				case VEC2:
				case VEC3:
					return true;
			}
			break;
		case STRING:
			switch (target.$id) {
				case NUMBER:
				case BOOLEAN:
				case COLOR:
				case OBJECT:
				case ANY_ARRAY:
					return true;
			}
			break;
		case BOOLEAN:
			switch (target.$id) {
				case STRING:
				case NUMBER:
					return true;
			}
			break;
		case COLOR:
			switch (target.$id) {
				case STRING:
				case VEC3:
				case NUMBER:
					return true;
			}
			break;
		case VEC2:
			switch (target.$id) {
				case STRING:
				case NUMBER:
				case VEC3:
					return true;
			}
			break;
		case VEC3:
			switch (target.$id) {
				case STRING:
				case NUMBER:
				case VEC2:
				case COLOR:
					return true;
			}
			break;
		case OBJECT:
			switch (target.$id) {
				case STRING:
					return true;
			}
			break;
		case ANY_ARRAY:
			switch (target.$id) {
				case STRING:
					return true;
			}
			break;
		case CURVE:
			switch (target.$id) {
				case STRING:
					return true;
			}
			break;
		case GRADIENT:
			switch (target.$id) {
				case STRING:
					return true;
			}
			break;
		case FLOATCURVE:
			switch (target.$id) {
				case STRING:
					return true;
			}
			break;
	}
	return false;
};

/**
 * Helper function to parse color from string
 */
const parseColorFromString = (str: string) => {
	try {
		// Handle hex colors
		if (str.startsWith('#')) {
			const hex = str.slice(1);
			if (hex.length === 3) {
				const r = parseInt(hex[0] + hex[0], 16) / 255;
				const g = parseInt(hex[1] + hex[1], 16) / 255;
				const b = parseInt(hex[2] + hex[2], 16) / 255;
				return { channels: [r, g, b], space: 'srgb' };
			} else if (hex.length === 6) {
				const r = parseInt(hex.slice(0, 2), 16) / 255;
				const g = parseInt(hex.slice(2, 4), 16) / 255;
				const b = parseInt(hex.slice(4, 6), 16) / 255;
				return { channels: [r, g, b], space: 'srgb' };
			}
		}
		// Handle rgb() format
		if (str.startsWith('rgb(')) {
			const values = str
				.slice(4, -1)
				.split(',')
				.map(v => parseFloat(v.trim()));
			if (values.length >= 3) {
				return {
					channels: [values[0] / 255, values[1] / 255, values[2] / 255],
					space: 'srgb'
				};
			}
		}
		// Fallback to black
		return { channels: [0, 0, 0], space: 'srgb' };
	} catch {
		return { channels: [0, 0, 0], space: 'srgb' };
	}
};

/**
 * Helper function to convert color to hex string
 */
const colorToHex = (color: any) => {
	if (!color || !color.channels || !Array.isArray(color.channels)) {
		return '#000000';
	}
	const [r, g, b] = color.channels;
	const toHex = (n: number) => {
		const hex = Math.round(Math.max(0, Math.min(255, n * 255))).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Handles the actual conversion of a value from one schema to another
 * @param srcSchema
 * @param targetSchema
 * @param src
 * @returns
 */
export const convertSchemaType = (
	srcSchema: SchemaObject,
	targetSchema: SchemaObject,
	src: any
) => {
	switch (srcSchema.$id) {
		case NUMBER:
			switch (targetSchema.$id) {
				case STRING:
					return String(src);
				case BOOLEAN:
					return Boolean(src);
				case COLOR:
					return { channels: [src, src, src], space: 'srgb' };
				case VEC2:
					return [src, src];
				case VEC3:
					return [src, src, src];
			}
			break;
		case STRING:
			switch (targetSchema.$id) {
				case NUMBER:
					return parseFloat(src) || 0;
				case BOOLEAN:
					return Boolean(src);
				case COLOR:
					return parseColorFromString(src);
				case OBJECT:
					try {
						return JSON.parse(src);
					} catch {
						return {};
					}
				case ANY_ARRAY:
					try {
						return JSON.parse(src);
					} catch {
						return [];
					}
			}
			break;
		case BOOLEAN:
			switch (targetSchema.$id) {
				case STRING:
					return String(src);
				case NUMBER:
					return Number(src);
			}
			break;
		case COLOR:
			switch (targetSchema.$id) {
				case STRING:
					return colorToHex(src);
				case VEC3:
					return src?.channels || [0, 0, 0];
				case NUMBER:
					return src?.channels?.[0] || 0;
			}
			break;
		case VEC2:
			switch (targetSchema.$id) {
				case STRING:
					return JSON.stringify(src);
				case NUMBER:
					return Array.isArray(src) ? src[0] || 0 : 0;
				case VEC3:
					return Array.isArray(src) ? [...src, 0] : [0, 0, 0];
			}
			break;
		case VEC3:
			switch (targetSchema.$id) {
				case STRING:
					return JSON.stringify(src);
				case NUMBER:
					return Array.isArray(src) ? src[0] || 0 : 0;
				case VEC2:
					return Array.isArray(src) ? [src[0] || 0, src[1] || 0] : [0, 0];
				case COLOR:
					return {
						channels: Array.isArray(src) ? src : [0, 0, 0],
						space: 'srgb'
					};
			}
			break;
		case OBJECT:
			switch (targetSchema.$id) {
				case STRING:
					return JSON.stringify(src);
			}
			break;
		case ANY_ARRAY:
			switch (targetSchema.$id) {
				case STRING:
					return JSON.stringify(src);
			}
			break;
		case CURVE:
			switch (targetSchema.$id) {
				case STRING:
					return JSON.stringify(src);
			}
			break;
		case GRADIENT:
			switch (targetSchema.$id) {
				case STRING:
					return JSON.stringify(src);
			}
			break;
		case FLOATCURVE:
			switch (targetSchema.$id) {
				case STRING:
					return JSON.stringify(src);
			}
			break;
	}
	return src;
};

/**
 * Gets a human-readable description of the conversion between two schema types
 * @param srcSchema
 * @param targetSchema
 * @returns
 */
export const getConversionDescription = (
	srcSchema: SchemaObject,
	targetSchema: SchemaObject
): string => {
	const getShortName = (schema: SchemaObject): string => {
		switch (schema.$id) {
			case NUMBER:
				return 'NUM';
			case STRING:
				return 'STR';
			case BOOLEAN:
				return 'BOOL';
			case COLOR:
				return 'COL';
			case VEC2:
				return 'V2';
			case VEC3:
				return 'V3';
			case OBJECT:
				return 'OBJ';
			case ANY_ARRAY:
				return 'ARR';
			case CURVE:
				return 'CRV';
			case GRADIENT:
				return 'GRAD';
			case FLOATCURVE:
				return 'FCRV';
			case ANY:
				return 'ANY';
			default:
				return 'UNK';
		}
	};

	return `${getShortName(srcSchema)}→${getShortName(targetSchema)}`;
};

/**
 * Type for conversion extension functions
 */
export type ConversionExtension = {
	canConvertSchemaTypes?: (src: SchemaObject, target: SchemaObject) => boolean;
	convertSchemaType?: (
		srcSchema: SchemaObject,
		targetSchema: SchemaObject,
		src: any
	) => any;
	getConversionDescription?: (
		srcSchema: SchemaObject,
		targetSchema: SchemaObject
	) => string;
};

/**
 * Registry for conversion extensions
 */
const conversionExtensions: ConversionExtension[] = [];

/**
 * Register a conversion extension
 */
export const registerConversionExtension = (extension: ConversionExtension) => {
	conversionExtensions.push(extension);
};

/**
 * Extended canConvertSchemaTypes that checks extensions
 */
export const canConvertSchemaTypesExtended = (
	src: SchemaObject,
	target: SchemaObject
): boolean => {
	// Check base conversions first
	if (canConvertSchemaTypes(src, target)) {
		return true;
	}

	// Check extensions
	for (const extension of conversionExtensions) {
		if (extension.canConvertSchemaTypes?.(src, target)) {
			return true;
		}
	}

	return false;
};

/**
 * Extended convertSchemaType that uses extensions
 */
export const convertSchemaTypeExtended = (
	srcSchema: SchemaObject,
	targetSchema: SchemaObject,
	src: any
): any => {
	// Try extensions first
	for (const extension of conversionExtensions) {
		if (extension.canConvertSchemaTypes?.(srcSchema, targetSchema)) {
			const result = extension.convertSchemaType?.(
				srcSchema,
				targetSchema,
				src
			);
			if (result !== undefined) {
				return result;
			}
		}
	}

	// Fall back to base conversion
	return convertSchemaType(srcSchema, targetSchema, src);
};

/**
 * Extended getConversionDescription that uses extensions
 */
export const getConversionDescriptionExtended = (
	srcSchema: SchemaObject,
	targetSchema: SchemaObject
): string => {
	// Try extensions first
	for (const extension of conversionExtensions) {
		if (extension.canConvertSchemaTypes?.(srcSchema, targetSchema)) {
			const result = extension.getConversionDescription?.(
				srcSchema,
				targetSchema
			);
			if (result) {
				return result;
			}
		}
	}

	// Fall back to base description
	return getConversionDescription(srcSchema, targetSchema);
};

export type GraphSchema = SchemaObject;

export const AllSchemas = [
	FloatCurveSchema,
	NumberSchema,
	StringSchema,
	ColorSchema,
	AnySchema,
	BooleanSchema,
	ObjectSchema,
	CurveSchema,
	Vec2Schema,
	Vec3Schema,
	GradientStopSchema
];
