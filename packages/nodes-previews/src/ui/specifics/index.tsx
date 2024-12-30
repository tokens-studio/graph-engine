import { IconButton } from "@tokens-studio/ui/IconButton.js";
import { useOpenPanel } from "@tokens-studio/graph-editor";
import ColorScalePreview from "../panels/colorScale.js";
import Eye from '@tokens-studio/icons/Eye.js';
import React from 'react';


const ColorScale = ({ node }) => {
    const { toggle } = useOpenPanel();

    return <IconButton onClick={() => {
        toggle({
            group: 'popout',
            title: 'Test Preview',
            id: node.id,
            content: <ColorScalePreview inputs={node.inputs} />
        })

    }} icon={<Eye />} tooltip="Toggle Preview" />

}

export const specifics = {
    'studio.tokens.previews.colorScale': ColorScale
};