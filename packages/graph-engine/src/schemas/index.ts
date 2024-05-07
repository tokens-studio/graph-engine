import type { SchemaObject } from "ajv";


export const variadicId = (id: string) => id.replace(".json", "-variadic.json")

export const createVariadicSchema = (baseSchema) => {
  return {
    $id: variadicId(baseSchema.$id),
    title: baseSchema.title + "[]",
    type: "array",
    items: baseSchema
  };
}

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

export const TEXT = "https://schemas.tokens.studio/text.json";
export const TextSchema: SchemaObject = {
  $id: TEXT,
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

export const GRADIENT_STOP = "https://schemas.tokens.studio/gradientStop.json";
export const GradientStopSchema: SchemaObject = {
  $id: GRADIENT_STOP,
  title: "Gradient Stop",
  type: "object",
  default: null,
  properties: {
    position: {
      type: "number",
    },
    color: {
      type: "string",
    }
  },
};

export const GRADIENT_HANDLE_POSITION = "https://schemas.tokens.studio/gradientHandlePosition.json";
export const GradientHandlePositionSchema: SchemaObject = {
  $id: GRADIENT_HANDLE_POSITION,
  title: "Gradient Handle Position",
  type: "object",
  default: null,
  properties: {
    positions: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
             x: {
              type: "number",
            },
             y: {
              type: "number",
            },
          },
        },
      ],
    },
  },
};

export const GRADIENT = "https://schemas.tokens.studio/gradient.json";
export const GradientSchema: SchemaObject = {
  $id: GRADIENT,
  title: "Gradient",
  type: "object",
  default: null,
  properties: {
    stops: {
      type: "array",
      items: GradientStopSchema,
    },
    color: {
      type: "string",
    }
  },
};

export const BUFFER = "https://schemas.tokens.studio/buffer.json";
export const BufferSchema: SchemaObject = {
  $id: BUFFER,
  title: "Buffer",
  type: "object",
  default: null,
  //Listing all the properties of a buffer is not practical
  properties: {
  },
}


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

  if (src.type == "array" && target.$id == ANY_ARRAY) {
    return true;
  }

  switch (src.$id) {
    case COLOR:
      switch (target.$id) {
        case STRING:
          return true;
      }
      break;

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
  ObjectSchema,
  CurveSchema,
  Vec2Schema,
  Vec3Schema,
  GradientStopSchema,
];
