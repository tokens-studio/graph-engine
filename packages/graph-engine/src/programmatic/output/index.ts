import { Graph } from '@/index.js';
import { z } from 'zod';
import { v4 } from 'uuid';
import { Input } from '../input/index.js';
import { Node } from '../node/index.js';

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

    /**
     * Whether to show this Output in the side panel
     */
    public visible: boolean = true;

    constructor(props: IOutputProps<T>) {
        this.name = props.name;
        this.type = props.type;
        this.value = props.value;
    }

    setNode(node: Node) {
        this.node = node;
    }

    set(value: z.infer<T>) {
        this.value = value;
    }

    setDynamic(key: string, value: z.infer<T>) {
        if (!this.dynamic) {
            throw new Error('Cannot set dynamic value on non-dynamic output');
        }
    }

    connect(target: Input, key: string = "") {
        if (this.dynamic && key === "") {
            throw new Error('Cannot connect to dynamic output without key');
        }
        this.graph.connect(this, target);
    }


}