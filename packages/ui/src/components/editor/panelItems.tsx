import {
    PanelGroup,
    PanelItem,
    defaultPanelGroupsFactory,
} from '@tokens-studio/graph-editor';
import { nodeLookup as audioLookup } from '@tokens-studio/graph-engine-nodes-audio';
import { nodes as designNodes } from '@tokens-studio/graph-engine-nodes-design-tokens';
import { nodes as imageNodes } from '@tokens-studio/graph-engine-nodes-image';

export const panelItems = defaultPanelGroupsFactory();


panelItems.groups.push(new PanelGroup({
    title: 'Audio',
    key: 'audio',
    items:
        Object.values(audioLookup).map((node) => new PanelItem({
            type: node.type,
            icon: '??',
            text: node.title,
            description: node.description,
            docs: '',
        })),

}));

panelItems.groups.push(new PanelGroup({
    title: 'Image',
    key: 'image',
    items:
        imageNodes.map((node) => new PanelItem({
            type: node.type,
            icon: '??',
            text: node.title,
            description: node.description,
            docs: '',
        })),

}));


panelItems.groups.push(new PanelGroup({
    title: 'Design Tokens',
    key: 'designTokens',
    items:
        designNodes.map((node) => new PanelItem({
            type: node.type,
            icon: '??',
            text: node.title,
            description: node.description,
            docs: '',
        })),
}))


