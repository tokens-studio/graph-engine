import {
	BooleanSchema,
	ColorSchema,
	NumberSchema,
	SchemaObject,
	StringSchema
} from '@tokens-studio/graph-engine';
import { arrayOf } from './utils';

export const TOKEN = 'https://schemas.tokens.studio/token.json';
export const TokenSchema: SchemaObject = {
	$id: TOKEN,
	title: 'Token',
	type: 'object',
	properties: {
		name: StringSchema,
		value: StringSchema,
		type: StringSchema
	}
};

export const REFERENCE = "https://schemas.tokens.studio/reference.json";
export const ReferenceSchema: SchemaObject = {
  $id: REFERENCE,
  title: "Reference",
  type: "string",
};

export const TOKEN_TYPOGRAPHY = "https://schemas.tokens.studio/tokenTypography.json";
export const TokenTypographySchema: SchemaObject = {
  $id: TOKEN_TYPOGRAPHY,
  title: "Typography Token",
  type: "object",
  properties: {
    fontFamily: StringSchema,
    fontWeight: StringSchema,
    fontSize: StringSchema,
    lineHeight: StringSchema,
    letterSpacing: StringSchema,
    paragraphSpacing: StringSchema,
    textDecoration: StringSchema,
    textCase: StringSchema,
  },
};

export const TOKEN_BORDER = "https://schemas.tokens.studio/tokenBorder.json";
export const TokenBorderSchema: SchemaObject = {
  $id: TOKEN_BORDER,
  title: "Border Token",
  type: "object",
  properties: {
    color: StringSchema,
    width: StringSchema,
    style: StringSchema,
  },
};

export const TOKEN_COLOR = "https://schemas.tokens.studio/tokenColor.json";
export const TokenColorSchema: SchemaObject = {
  $id: TOKEN_COLOR,
  title: "Color Token",
  type: "object",
  properties: {
    name: StringSchema,
    description: StringSchema,
    type: StringSchema,
    value: ColorSchema,
    reference: ReferenceSchema,
  },
};


export const TOKEN_BOX_SHADOW = "https://schemas.tokens.studio/tokenBoxShadow.json";
export const TokenBoxShadowSchema: SchemaObject = {
  $id: TOKEN_BOX_SHADOW,
  title: "Box Shadow Token",
  type: "object",
  properties: {
    x: StringSchema,
    y: StringSchema,
    blur: StringSchema,
    spread: StringSchema,
    type: StringSchema
  },
};


export const TOKEN_SET = "https://schemas.tokens.studio/tokenSet.json";
export const TokenSetSchema: SchemaObject = {
	$id: TOKEN_SET,
	title: 'Token Set',
	type: 'object',
	properties: {
		name: StringSchema,
		token: StringSchema
	}
};

export const LEONARDO_COLOR =
	'https://schemas.tokens.studio/design/leonardo/color.json';
export const LeonardoColorSchema: SchemaObject = {
	$id: LEONARDO_COLOR,
	type: 'object',
	properties: {
		smooth: BooleanSchema,
		name: StringSchema,
		colorKeys: arrayOf(ColorSchema),
		ratios: arrayOf(NumberSchema)
	}
};
