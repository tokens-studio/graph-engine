import {
    AddDropdown,
    AlignDropdown,
    DownloadToolbarButton,
    HelpDropdown,
    type ImperativeEditorRef,
    LayoutDropdown,
    PlayControls,
    SettingsToolbarButton,
    ToolbarSeparator,
    UploadToolbarButton,
    ZoomDropdown,
    mainGraphSelector,
    useOpenPanel
} from '@tokens-studio/graph-editor';

import { AiSummary } from './ai.tsx';
import { IconButton, Tooltip } from '@tokens-studio/ui';
import { Preview } from '../../panels/preview.tsx';
import { client } from '@/api/sdk/index.ts';
import { useErrorToast } from '@/hooks/useToast.tsx';
import { useSelector } from 'react-redux';
import FloppyDisk from '@tokens-studio/icons/FloppyDisk.js';
import React from 'react';
import XrayView from '@tokens-studio/icons/XrayView.js';



export const SaveButton = ({ id }) => {
    const mainGraph = useSelector(mainGraphSelector);
    const graphRef = mainGraph?.ref as ImperativeEditorRef | undefined;
    const { mutateAsync, isPending, error } =
        client.graph.updateGraph.useMutation();

    useErrorToast(error);

    const onSave = async () => {
        if (!graphRef || isPending) return;

        const saved = graphRef!.save();

        await mutateAsync({
            params: {
                id
            },
            body: {
                graph: saved as any
            }
        });
    };

    return (
        <Tooltip label='Save' side='bottom'>
            <IconButton
                emphasis='low'
                loading={isPending}
                onClick={onSave}
                icon={<FloppyDisk />}
            />
        </Tooltip>
    );
};


export const PreviewButton = () => {
    const { toggle } = useOpenPanel();
    return (
        <Tooltip label='Preview' side='bottom'>
            <IconButton
                emphasis='low'
                onClick={() =>
                    toggle({
                        group: 'popout',
                        title: 'Preview',
                        id: 'preview',
                        content: <Preview />
                    })
                }
                icon={<XrayView />}
            />
        </Tooltip>
    );
};

export const createToolbarButtons = (buttons?: React.ReactElement) => {
    return (
        <>
            <AddDropdown />
            <ToolbarSeparator />
            <ZoomDropdown />
            <ToolbarSeparator />
            <AlignDropdown />
            <ToolbarSeparator />
            <PlayControls />
            <ToolbarSeparator />
            <LayoutDropdown />
            <SettingsToolbarButton />
            <HelpDropdown />
            <AiSummary />
            <PreviewButton />
            <ToolbarSeparator />
            <DownloadToolbarButton />
            <UploadToolbarButton />
            {buttons}
        </>
    );
};
