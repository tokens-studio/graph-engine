import { BooleanSchema, ColorSchema, NumberSchema, SchemaObject, StringSchema } from "@tokens-studio/graph-engine";
import { arrayOf } from "./utils";

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

export const LEONARDO_COLOR = "https://schemas.tokens.studio/design/leonardo/color.json";
export const LeonardoColorSchema: SchemaObject = {
    $id: LEONARDO_COLOR,
    type: "object",
    properties: {
        smooth: BooleanSchema,
        name: StringSchema,
        colorKeys: arrayOf(ColorSchema),
        ratios: arrayOf(NumberSchema),
    },
};