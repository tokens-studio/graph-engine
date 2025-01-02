import { Volume } from 'memfs';
import {
	WebAudioCapability,
	icons as audioIcons
} from '@tokens-studio/graph-engine-nodes-audio';
import { audioEnabled } from '@/lib/featureFlags.ts';
import { defaultControls, defaultSpecifics } from '@tokens-studio/graph-editor';
import {
	controls as designControls,
	icons as designIcons,
	specifics as designSpecifics
} from '@tokens-studio/graph-engine-nodes-design-tokens';
import { specifics as previewSpecifics } from '@tokens-studio/graph-engine-nodes-preview';
import type { CapabilityFactory, Node } from '@tokens-studio/graph-engine';

export const fs = Volume.fromJSON({
	'/files/readme.md': 'Hello World'
});

/**
 * In this case the fs capability is common to all graphs
 */
export const capabilities: CapabilityFactory[] = [
	WebAudioCapability,
	{
		name: 'fs',
		register: () => {
			return fs;
		}
	}
];

export const icons = {
	...(audioEnabled ? audioIcons : {}),
	...designIcons
};

export const controls = [...designControls, ...defaultControls];

export const specifics = {
	...defaultSpecifics,
	...designSpecifics,
	...previewSpecifics
} as Record<string, React.FC<{ node: Node }>>;

export { menu } from './menu.tsx';
export { panelItems } from './panelItems.tsx';
export { previewItems } from './previewItem.tsx';
export { nodeTypes } from './nodeTypes.tsx';
