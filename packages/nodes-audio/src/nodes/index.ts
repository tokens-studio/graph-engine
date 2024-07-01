import { AudioConnectNode } from './connect.js';
import { AudioDelayNode } from './delay.js';
import { AudioGainNode } from './gain.js';
import { AudioLoadBufferNode } from './loadBuffer.js';
import { AudioOscillatorNode } from './oscillator.js';
import { AudioOutputNode } from './output.js';
import { AudioSourceNode } from './source.js';
import { AudioWhiteNoiseNode } from './whiteNoise.js';

export const nodeLookup = {
	[AudioOutputNode.type]: AudioOutputNode,
	[AudioGainNode.type]: AudioGainNode,
	[AudioOscillatorNode.type]: AudioOscillatorNode,
	[AudioConnectNode.type]: AudioConnectNode,
	[AudioDelayNode.type]: AudioDelayNode,
	[AudioSourceNode.type]: AudioSourceNode,
	[AudioWhiteNoiseNode.type]: AudioWhiteNoiseNode,
	[AudioLoadBufferNode.type]: AudioLoadBufferNode
};

export { AudioGainNode } from './gain.js';
export { AudioOscillatorNode } from './oscillator.js';
export { AudioOutputNode } from './output.js';
export { AudioConnectNode } from './connect.js';
export { AudioDelayNode } from './delay.js';
export { AudioSourceNode } from './source.js';
export { AudioWhiteNoiseNode } from './whiteNoise.js';
export { AudioLoadBufferNode } from './loadBuffer.js';
