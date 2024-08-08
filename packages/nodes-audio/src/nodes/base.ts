import { DataflowNode } from '@tokens-studio/graph-engine';
export class AudioBaseNode extends DataflowNode {
	//All audio nodes need the web-audio capability
	static annotations = {
		'engine.capability.web-audio': true
	};
	getAudioCtx(): AudioContext {
		return this.getGraph().capabilities['web-audio'];
	}
}
