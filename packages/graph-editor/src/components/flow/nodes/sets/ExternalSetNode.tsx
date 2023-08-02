import React, { FC, useCallback, useEffect } from 'react';
import { IconButton, Stack, Text } from '@tokens-studio/ui';
import {
    ClipboardCopyIcon,
    DownloadIcon,
} from '@radix-ui/react-icons';
import { Handle, HandleContainer } from '../../handles.tsx';
import { flatTokensRestoreToMap } from '#/utils/index.ts';
import { NodeProps } from 'reactflow';
import {
    SET_ID,
    node,
} from '@tokens-studio/graph-engine/nodes/set/externalTokens.js';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import copy from 'copy-to-clipboard';
import { TokenSetHandles } from './tokensHandles.tsx';


type ExternalSetData = {
    urn: string
    name: string;
};

const ExternalSetNode: FC<NodeProps<ExternalSetData>> = () => {
    const { setControls, setTitle, state, output } = useNode();

    const tokens = output && output[SET_ID];

    const onDownload = useCallback(() => {
        const fileContent = JSON.stringify(flatTokensRestoreToMap(tokens), null, 4);
        const blob = new Blob([fileContent], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tokens.json';
        document.body.appendChild(link);
        link.click();

        // Clean up the URL and link
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }, [tokens]);

    const onCopyClipboard = useCallback(() => {
        const fileContent = JSON.stringify(flatTokensRestoreToMap(tokens), null, 4);
        const worked = copy(fileContent);

        if (!worked) {
            alert('Failed to copy to clipboard');
        }
    }, [tokens]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);


    useEffect(() => {
        setControls(
            <>
                <IconButton
                    size="small"
                    variant="invisible"
                    onClick={onDownload}
                    icon={<DownloadIcon />}
                />
                <IconButton
                    size="small"
                    variant="invisible"
                    onClick={onCopyClipboard}
                    icon={<ClipboardCopyIcon />}
                />
            </>,
        );
    }, [onCopyClipboard, onDownload, setControls]);

    useEffect(() => {
        state?.title && setTitle(state.title);
    }, [state?.title, setTitle]);

    return (
        <div onDragOver={onDragOver}>
            <Stack direction="row" gap={2}>
                <HandleContainer type="target">
                    <Handle id="input">
                        <Text>
                            <i>Input</i>{' '}
                        </Text>
                    </Handle>
                </HandleContainer>
                <HandleContainer type="source">
                    <Handle id={SET_ID}>
                        <Text>
                            <i>As Set</i>{' '}
                        </Text>
                    </Handle>
                </HandleContainer>
            </Stack>
            <HandleContainer full type="source">
                <TokenSetHandles tokens={tokens} />
            </HandleContainer>
        </div>
    );
};

export default WrapNode(ExternalSetNode, {
    ...node,
});
