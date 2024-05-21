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