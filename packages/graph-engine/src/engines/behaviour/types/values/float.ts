import { ValueType } from "./interface.js";


export const FloatValue: ValueType = {
    name: 'float',
    creator: () => 0,
    deserialize: (value: string | number) =>
        typeof value === 'string' ? parseSafeFloat(value, 0) : value,
    serialize: (value: number) => value,
    lerp: (start: number, end: number, t: number) => start * (1 - t) + end * t,
    equals: (a: number, b: number) => a === b,
    clone: (value: number) => value
};
