import { controls as AudioControls, ImageCapability, icons as ImageIcons, specifics as imageSpecifics } from '@tokens-studio/graph-engine-nodes-image';
import { CapabilityFactory, Node } from '@tokens-studio/graph-engine';
import { Volume } from 'memfs';
import { WebAudioCapability, icons as audioIcons } from '@tokens-studio/graph-engine-nodes-audio';
import { defaultControls, defaultSpecifics } from '@tokens-studio/graph-editor';
import { controls as designControls, icons as designIcons, specifics as designSpecifics } from '@tokens-studio/graph-engine-nodes-design-tokens';


export const fs = Volume.fromJSON({
    '/files/readme.md': 'Hello World'
});


/**
 * In this case the fs capability is common to all graphs
 */
export const capabilities: CapabilityFactory[] = [WebAudioCapability,ImageCapability, {
    name: 'fs',
    register: () => {
        return fs
    }
}];

export const icons = {
    ...audioIcons,
    ...designIcons,
    ...ImageIcons
}

export const controls = [
    ...designControls,
    ...AudioControls,
    ...defaultControls
]

export const specifics = {
    ...defaultSpecifics,
    ...designSpecifics, 
    ...imageSpecifics
} as Record<string, React.FC<{ node: Node }>>


export { menu } from './menu.tsx';
export { panelItems } from './panelItems.tsx';
export { nodeTypes } from './nodeTypes.tsx';
