import { Graph } from '@/index.js';
import { z } from 'zod';
import { Input } from '../input/index.js';
import { Node } from '../node/index.js';
import { Type } from '../types/index.js';

export interface IOutputProps<T extends z.ZodTypeAny> {
    id?: string;
    name?: string;
    type: T;
    value?: z.infer<T>
}

export class Output<T extends z.ZodTypeAny = z.ZodTypeAny> {
    /** 
     * Name to show in the side panel.Optional
     * */
    public name?: string;
    /**
     * An optional description for the Output
     */
    public description?: string;
    /** Type */
    public type: T;

    public value: z.infer<T>;
    public graph: Graph;
    public node: Node;
    /**
     * Whether this port has dynamic keys 
     */
    public dynamic: boolean = false;

    private dynamicValues: Map<string, any> = new Map();

    /**
     * Whether to show this Output in the side panel
     */
    public visible: boolean = true;

    /**
     * The runtime type of the value. This might change if the value is dynamic, a union ,etc
     */
    private runtimeType: Type;

    constructor(props: IOutputProps<T>) {
        this.name = props.name;
        this.type = props.type;
        this.value = props.value;
    }

    setNode(node: Node) {
        this.node = node;
    }

    set(value: z.infer<T>, type?: Type) {

        this.value = value;
        this.runtimeType = type;
    }

    clear() {
        this.dynamicValues.clear();
    }

    setDynamic(key: string, value: z.infer<T>, type: Type) {
        if (!this.dynamic) {
            throw new Error('Cannot set dynamic value on non-dynamic output');
        }

        this.dynamicValues.set(key, {
            value,
            type
        });
    }

    getDynamics() {
        if (!this.dynamic) {
            throw new Error('Not a dynamic value');
        }
        return this.dynamicValues;
    }

    /**
     * Use a key to access dynamic values off the port
     * @param target 
     * @param key 
     */
    connect(target: Input, key: string = "") {
        if (this.dynamic && key === "") {
            throw new Error('Cannot connect to dynamic output without key');
        }
        this.graph.connect(this.node, this, target.node, target, key);
    }
}