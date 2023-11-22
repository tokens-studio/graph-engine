import { Schema } from "../schema/types.js";

export interface IInputProps<T> {
    name?: string;
    type: Schema;
    defaultValue: T;
}