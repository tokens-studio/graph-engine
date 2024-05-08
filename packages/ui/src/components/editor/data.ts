import { CapabilityFactory } from '@tokens-studio/graph-engine';
import { Volume } from 'memfs';
import { WebAudioCapability, icons as audioIcons } from '@tokens-studio/graph-engine-nodes-audio';
import { icons as designIcons, controls as designControls } from '@tokens-studio/graph-engine-nodes-design-tokens';
import {defaultControls} from '@tokens-studio/graph-editor';



export const fs = Volume.fromJSON({
    '/files/readme.md': 'Hello World'
});


/**
 * In this case the fs capability is common to all graphs
 */
export const capabilities: CapabilityFactory[] = [WebAudioCapability, {
    name: 'fs',
    register: () => {
        return fs
    }
}];

export const icons = {
    ...audioIcons,
    ...designIcons
}

export const controls = [
    ...designControls,
    ...defaultControls
]


export { menu } from './menu.tsx';
export { panelItems } from './panelItems.tsx';
export { nodeTypes } from './nodeTypes.tsx';
