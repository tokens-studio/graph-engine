import { AISummary } from '../../panels/aiSummary.tsx';
import { IconButton, Tooltip } from '@tokens-studio/ui';
import {
    useOpenPanel
} from '@tokens-studio/graph-editor';
import React from 'react';
import Sparks from '@tokens-studio/icons/Sparks.js';

export const AiSummary = () => {
    const { toggle } = useOpenPanel();
    return (
        <Tooltip label='Artificial intelligence' side='bottom'>
            <IconButton
                emphasis='low'
                onClick={() =>
                    toggle({
                        group: 'popout',
                        title: 'Artificial intelligence',
                        id: 'ai',
                        content: <AISummary />
                    })
                }
                icon={<Sparks />}
            />
        </Tooltip>
    );
};
