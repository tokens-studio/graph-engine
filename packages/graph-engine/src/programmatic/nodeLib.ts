import { node } from '../nodes/accessibility/baseFontSize.js'


export interface INode<TInput = Record<string, any>> {
    id: string
    state?: TInput
}

export abstract class Node<TInput = Record<string, any>, TOutput = Record<string, any>> {


    public readonly id: string;
    /** Node Inputs */
    public abstract inputs: Record<keyof TInput, Input>;
    /** Node Outputs */
    public abstract outputs: Record<keyof TOutput, Input>;

    public readonly type: string;

    private state: TInput = {};

    public abstract process(input: TInput, ephemeral: Record<string, any>): TOutput | Promise<TOutput>;

    constructor(opts: INode<TInput>) {
        this.id = opts.id;
        this.state = opts.state || {} as TInput;
    }


    public async execute(ephemeral: Record<string, any>): TOutput | Promise<TOutput> {
        const input = this.getInputValues();

        const final = {
            ...this.state,
            ...input,
        }

        let output = this.process(input, ephemeral);

        if (output instanceof Promise) {
            output = await output;
        }

        this.setOutputValues(output);
    }

    setValue<TValue extends TypeDefinition>(input: Input<TValue>, value: TValue) {
        input.defaultValue = value;
    }

    serialize() {
        return {
            id: this.id,
            type: this.type,
        }
    }
}

export class Input<TValue extends TypeDefinition = TypeDefinition>
{
    public id: string;
    public readonly type: string;
    public defaultValue: TValue;

    public connection?: Connection<any, TValue>;

    constructor(definition: TypeDefinition) {
        this.defaultValue = definition.default;
        this.type = definition.type
    }
}

export class Output<TValue extends TypeDefinition = TypeDefinition>
{
    public id: string;
    public readonly type: string;
    public defaultValue: TValue;
    public connections: Connection<TValue, any>[] = [];
    constructor(definition: TypeDefinition) {
        this.defaultValue = definition.default;
        this.type = definition.type
    }
}

export class Connection<TFrom extends TypeDefinition = TypeDefinition, TTo extends TypeDefinition = TypeDefinition> {
    /** Identifier */
    public id: string;
    /** Output */
    public from: Output<TFrom>;
    /** Input */
    public to: Input<TTo>;
    /** Determines type compatibility */
    public static isTypeCompatible<TFrom extends TypeDefinition, TTo extends TypeDefinition>(from: Output<TFrom>, to: Input<TTo>) {
        return from.type === to.type;
    }

    constructor(id: string, from: Output<TFrom>, to: Input<TTo>) {
        this.id = id;
        if (!Connection.isTypeCompatible(from, to)) {
            throw new Error('Connection origin & target has incompatible types');
        }
        this.from = from;
        this.to = to;
        this.from.connections.push(this);
        this.to.connection = this;
    }

}

export enum ValueType {
    STRING = 'string',
    ARRAY = 'array',
    OBJECT = 'object',
    NUMBER = 'number',
    BOOLEAN = 'boolean'
}

type IInput = {
    visualAcuity: number,
    lightingCondition: number,
    distance: number,
    xHeightRatio: number,
    ppi: number,
    pixelDensity: number,
    correctionFactor: number,
}

interface IOutput {
    output: number
}

class Test extends Node<IInput, IOutput> {

    inputs = {
        visualAcuity: new Input({
            type: ValueType.NUMBER,
            default: 0.7,
        }),
        correctionFactor: new Input({
            type: ValueType.NUMBER,
            default: 13,
        }),
        lightingCondition: new Input({
            type: ValueType.NUMBER,
            default: 0.83,
        }),
        distance: new Input({
            type: ValueType.NUMBER,
            default: 30,
        }),
        xHeightRatio: new Input({
            type: ValueType.NUMBER,
            default: 0.53,
        }),
        ppi: new Input({
            type: ValueType.NUMBER,
            default: 458,
        }),
        pixelDensity: new Input({
            type: ValueType.NUMBER,
            default: 3,
        }),
    }
    outputs = {
        output: new Output({
            type: ValueType.NUMBER,
        })
    }

    process = (input: IInput) => {
        const {
            visualAcuity,
            lightingCondition,
            distance,
            xHeightRatio,
            ppi,
            pixelDensity,
            correctionFactor,
        } = input;

        const visualCorrection =
            correctionFactor * (lightingCondition / visualAcuity);
        const xHeightMM =
            Math.tan((visualCorrection * Math.PI) / 21600) * (distance * 10) * 2;
        const xHeightPX = (xHeightMM / 25.4) * (ppi / pixelDensity);
        // const fontSizePT = (2.83465 * xHeightMM * 1) / xHeightRatio;
        const fontSizePX = (1 * xHeightPX) / xHeightRatio;

        return {
            output: fontSizePX,
        };

    }
}

const x = new Test({ id: '1' });
const z = x.inputs.correctionFactor.connection?.from;

x.inputs.


/**
 * Type definitions are used to provide strong typing for node values
 */
export type TypeDefinition = {
    description?: string;
    type: ValueType;
    //Whether the value is exposed to the user in the UI
    hidden?: boolean;
    default?: any;
    //Used when the type is an array
    items?: TypeDefinition;
}



export interface NodeDefinition {
    /**
     * Typed values that are exposed to the user
     */
    inputs: TypeDefinition[];
    outputs: TypeDefinition[];

    /**
     * A markdown based description of the node
     */
    description?: string;
    /**
     * Reverse domain name notation for the node
     */
    type: string;

    process: (
        input: Record<string, any>,
        ephemeral: Record<string, any>,
    ) => Record<string, any> | Promise<Record<string, any>>;
}
