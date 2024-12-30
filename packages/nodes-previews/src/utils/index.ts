import { Color, toColor, toHex } from '@tokens-studio/graph-engine';


export const arrayOf = (schema: object) => {
    return {
        type: 'array',
        items: schema
    };
};


export const castToHex = (col: Color) => {
    try {
        return toHex(toColor(col));
    } catch {
        return '';
    }
};