import { z } from 'zod';
import { Node } from '../node/index.js';

export interface IInputProps<T extends z.ZodTypeAny> {
    name?: string;
    type: T;
    value?: z.infer<T>
    defaultValue?: z.infer<T>;
}

export class Input<T extends z.ZodTypeAny = z.ZodTypeAny> {
    /** 
     * Name to show in the side panel.Optional
     * */
    public name?: string;
    /** Type */
    public type: T;
    /** 
     * Default Value 
     * */
    public defaultValue?: z.infer<T>;

    public value: z.infer<T>;
    /**
     * Whether to show this Input in the side panel
     */
    public visible: boolean = true;

    public node: Node;

    /**
     * Whether this port is variadic. Can only be used with a type that is an array
     */
    public variadic :boolean = false;

    constructor(props: IInputProps<T>) {
        this.name = props.name;
        this.type = props.type;

        this.defaultValue = props.defaultValue;
        this.value = props.value || props.defaultValue;
    }

    setNode(node: Node) {
        this.node = node;
    }
    get(): z.infer<T> {
        return this.type.parse(this.value);
    }

    serialize() {
        return {
            name: this.name,
            value: this.value
        }
    }

    /**
     * Returns the description of the input as relayed through the zod type
     */
    get description() {
        return this.type.description;
    }
}