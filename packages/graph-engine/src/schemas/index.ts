import type { SchemaObject } from "ajv";

export type { SchemaObject } from "ajv";

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

export const COLOR_ARRAY = "https://schemas.tokens.studio/color.json";
export const ColorArraySchema: SchemaObject = {
  $id: COLOR,
  title: "Color[]",
  type: "array",
  items: ColorSchema,
};

export const STRING_ARRAY = "https://schemas.tokens.studio/string-array.json";
export const StringArraySchema: SchemaObject = {
  $id: STRING_ARRAY,
  title: "String[]",
  type: "array",
  items: StringSchema,
  default: [],
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
  type: "array",
  default: [],
  //We don't specify a type here because we want to allow any type
};

export const BOOLEAN = "https://schemas.tokens.studio/boolean.json";
export const BooleanSchema: SchemaObject = {
  $id: BOOLEAN,
  title: "Boolean",
  type: "boolean",
  default: false,
};

export const TOKEN = "https://schemas.tokens.studio/token.json";
export const TokenSchema: SchemaObject = {
  $id: TOKEN,
  title: "Token",
  type: "object",
  properties: {
    name: StringSchema,
    value: StringSchema,
    type: StringSchema,
  },
};

export const TOKEN_ARRAY = "https://schemas.tokens.studio/tokenArray.json";
export const TokenArraySchema: SchemaObject = {
  $id: TOKEN_ARRAY,
  title: "Token[]",
  type: "array",
  default: [],
  items: TokenSchema,
};

export const TOKEN_ARRAY_ARRAY =
  "https://schemas.tokens.studio/tokenArrayArray.json";
export const TokenArrayArraySchema: SchemaObject = {
  $id: TOKEN_ARRAY_ARRAY,
  title: "Token[][]",
  type: "array",
  default: [],
  items: TokenArraySchema,
};

export const TOKEN_SET = "https://schemas.tokens.studio/tokenSet.json";
export const TokenSetSchema: SchemaObject = {
  $id: TOKEN_SET,
  title: "Token Set",
  type: "object",
  properties: {
    name: StringSchema,
    token: StringSchema,
  },
};

export const OBJECT = "https://schemas.tokens.studio/object.json";
export const ObjectSchema: SchemaObject = {
  $id: OBJECT,
  title: "Object",
  type: "object",
};

export const CURVE = "https://schemas.tokens.studio/curve.json";
export const CurveSchema: SchemaObject = {
  $id: CURVE,
  title: "Curve",
  type: "object",
  default: {
    curves: [
      {
        type: "bezier",
        points: [
          [0, 0],
          [0.25, 0.6],
          [0.75, 0.4],
          [1, 1],
        ],
      },
    ],
  },
  properties: {
    curves: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            type: {
              type: "string",
            },
            points: {
              type: "array",
              items: [
                {
                  type: "array",
                  items: [
                    {
                      type: "integer",
                    },
                    {
                      type: "integer",
                    },
                  ],
                },
                {
                  type: "array",
                  items: [
                    {
                      type: "number",
                    },
                    {
                      type: "number",
                    },
                  ],
                },
                {
                  type: "array",
                  items: [
                    {
                      type: "number",
                    },
                    {
                      type: "number",
                    },
                  ],
                },
                {
                  type: "array",
                  items: [
                    {
                      type: "integer",
                    },
                    {
                      type: "integer",
                    },
                  ],
                },
              ],
            },
          },
          required: ["type", "points"],
        },
      ],
    },
  },
  required: ["curves"],
};
export type Curve = {
  curves: {
    type: string;
    points: [number, number][];
  }[];
};

export const VEC2 = "https://schemas.tokens.studio/vec2.json";
export const Vec2Schema: SchemaObject = {
  $id: VEC2,
  title: "Vec2",
  type: "array",
  minItems: 2,
  maxItems: 2,
  items: NumberSchema,
  default: [0, 0],
};

export const VEC3 = "https://schemas.tokens.studio/vec3.json";
export const Vec3Schema: SchemaObject = {
  $id: VEC3,
  title: "Vec3",
  type: "array",
  minItems: 3,
  maxItems: 3,
  items: NumberSchema,
  default: [0, 0, 0],
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

  switch (src.$id) {
    case NUMBER_ARRAY:
      switch (target.$id) {
        case STRING_ARRAY:
          return true;
      }
      break;
    case NUMBER:
      switch (target.$id) {
        case NUMBER_ARRAY:
          return true;
        case STRING:
          return true;
        case BOOLEAN:
          return true;
      }
      break;
    case STRING: {
      switch (target.$id) {
        case STRING_ARRAY:
          return true;
        case NUMBER:
          return true;
        case BOOLEAN:
          return true;
      }
    }
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

export type GraphSchema = SchemaObject;

export const AllSchemas = [
  NumberSchema,
  StringSchema,
  ColorSchema,
  NumberArraySchema,
  StringArraySchema,
  ColorArraySchema,
  AnySchema,
  AnyArraySchema,
  BooleanSchema,
  TokenSchema,
  CurveSchema,
  Vec2Schema,
  Vec3Schema,
];
