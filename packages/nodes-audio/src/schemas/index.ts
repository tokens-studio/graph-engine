import { SchemaObject } from "@tokens-studio/graph-engine";

export const GAIN = "https://schemas.tokens.studio/audio/gain.json";
export const GainSchema: SchemaObject = {
    $id: GAIN,
    title: "Gain",
    type: "object"
};


export const CONTEXT = "https://schemas.tokens.studio/audio/context.json";
export const ContextSchema: SchemaObject = {
    $id: CONTEXT,
    title: "Context",
    type: "object"
};

export const SOURCE = "https://schemas.tokens.studio/audio/source.json";
export const SourceSchema: SchemaObject = {
    $id: SOURCE,
    title: "Source",
    type: "object"
};


export const BUFFER = "https://schemas.tokens.studio/fs/buffer.json";
export const BufferSchema: SchemaObject = {
    $id: BUFFER,
    title: "Buffer",
    type: "object",
    default: null
};



export const NODE = "https://schemas.tokens.studio/audio/node.json";
export const NodeSchema: SchemaObject = {
    $id: NODE,
    title: "Node",
    type: "object",
    default:null
};


export const DESTINATION = "https://schemas.tokens.studio/audio/destination.json";
export const DestinationSchema: SchemaObject = {
    $id: DESTINATION,
    title: "Destination",
    type: "object"
};


export const OSCILLATOR = "https://schemas.tokens.studio/audio/oscillator.json";
export const OscillatorSchema: SchemaObject = {
    $id: OSCILLATOR,
    title: "Oscillator",
    type: "object"
};