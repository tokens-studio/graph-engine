import type { SchemaObject } from "ajv";

export const NUMBER = "https://schemas.tokens.studio/number.json";
export const NumberSchema: SchemaObject = {
  $id: NUMBER,
  title: "Number",
  type: "number",
};

export const NUMBER_ARRAY = "https://schemas.tokens.studio/number-array.json";
export const NumberArraySchema: SchemaObject = {
  $id: NUMBER_ARRAY,
  title: "Number[]",
  type: "array",
  items: NumberSchema,
};

export const STRING = "https://schemas.tokens.studio/string.json";
export const StringSchema: SchemaObject = {
  $id: STRING,
  title: "String",
  type: "string",
};


export const COLOR = "https://schemas.tokens.studio/color.json";
export const ColorSchema: SchemaObject = {
  $id: COLOR,
  title: "Color",
  type: "string",
};



export const STRING_ARRAY = "https://schemas.tokens.studio/string-array.json";
export const StringArraySchema: SchemaObject = {
  $id: STRING_ARRAY,
  title: "String[]",
  type: "array",
  items: StringSchema,
};

export const ANY = "https://schemas.tokens.studio/any.json";
export const AnySchema: SchemaObject = {
  $id: ANY,
  title: "Any",
  //We don't specify a type here because we want to allow any type
};

export const ANY_ARRAY = "https://schemas.tokens.studio/anyArray.json";
export const AnyArraySchema: SchemaObject = {
  $id: ANY_ARRAY,
  title: "Any[]",
  type: 'array'
  //We don't specify a type here because we want to allow any type
};

export const BOOLEAN = "https://schemas.tokens.studio/boolean.json";
export const BooleanSchema: SchemaObject = {
  $id: BOOLEAN,
  title: "Boolean",
  type: "boolean",
};

export const TOKEN = "https://schemas.tokens.studio/token.json";
export const TokenSchema: SchemaObject = {
  $id: TOKEN,
  title: "Token",
  type: "object",
  properties: {
    name: StringSchema,
    token: StringSchema,
  },
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
  switch (src.$id) {
    case NUMBER_ARRAY:
      switch (target.$id) {
        case STRING_ARRAY:
          return true;
      }
      break;
    case NUMBER:
      switch (target.$id) {
        case STRING:
          return true;
        case BOOLEAN:
          return true;
      }
      break;
    case STRING:
      return target.$id === BOOLEAN;
  }
  return false;
};

/**
 * Handles the actual conversion of a value from one schema to another
 * @param srcSchema
 * @param targetSchema
 * @param src
 * @param target
 * @returns
 */
export const convertSchemaType = (
  srcSchema: SchemaObject,
  targetSchema: SchemaObject,
  src: any,
  target: any
) => {
  switch (srcSchema.$id) {
    case NUMBER_ARRAY:
      switch (targetSchema.$id) {
        case STRING_ARRAY:
          return src.map((v: number) => String(v));
      }
      break;
    case NUMBER:
      switch (targetSchema.$id) {
        case STRING:
          return String(src);
        case BOOLEAN:
          return Boolean(src);
      }
      break;
    case STRING:
      switch (targetSchema.$id) {
        case BOOLEAN:
          return Boolean(src);
      }
      break;
  }
  return src;
};

export const AllSchemas = [
  NumberSchema,
  StringSchema,
  BooleanSchema,
  TokenSchema,
];
