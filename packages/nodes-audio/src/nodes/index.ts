import { AudioGainNode } from "./gain.js";
import { AudioOscillatorNode } from "./oscillator.js";
import { AudioContextNode } from "./context.js";
import { AudioConnectNode } from "./connect.js";
import { AudioDelayNode } from "./delay.js";
import { AudioSourceNode } from "./source.js";



export const nodeLookup = {
    [AudioContextNode.type]: AudioContextNode,
    [AudioGainNode.type]: AudioGainNode,
    [AudioOscillatorNode.type]: AudioOscillatorNode,
    [AudioConnectNode.type]: AudioConnectNode,
    [AudioDelayNode.type]: AudioDelayNode,
    [AudioSourceNode.type]: AudioSourceNode
}

export { AudioGainNode } from "./gain.js";
export { AudioOscillatorNode } from "./oscillator.js";
export { AudioContextNode } from "./context.js";
export { AudioConnectNode } from "./connect.js";
export { AudioDelayNode } from "./delay.js";
export { AudioSourceNode } from "./source.js";