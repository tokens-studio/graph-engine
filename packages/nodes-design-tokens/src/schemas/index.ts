import { SchemaObject, StringSchema } from "@tokens-studio/graph-engine";

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