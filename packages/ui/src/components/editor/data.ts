import { CapabilityFactory } from '@tokens-studio/graph-engine';
import { Volume } from 'memfs';
import { icons as designIcons } from '@tokens-studio/graph-engine-nodes-design-tokens';


export const fs = Volume.fromJSON({
    '/files/readme.md': 'Hello World'
});


/**
 * In this case the fs capability is common to all graphs
 */
export const capabilities: CapabilityFactory[] = [ {
    name: 'fs',
    register: () => {
        return fs
    }
}];

export const icons = {
    ...designIcons
}


export { menu } from './menu.tsx';
export { panelItems } from './panelItems.tsx';
export { nodeTypes } from './nodeTypes.tsx';
