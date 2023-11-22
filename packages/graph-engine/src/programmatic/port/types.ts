import { Type } from "../types";

export interface IPortProps<TType extends Type> {
    id?: string;
    name: string;
    type: TType;
}

export interface IPortSerialized<TType extends Type> {
    id: string;
    name: string;
    type: TType;
}