import React, { FC, useCallback, useEffect, useState } from 'react';
import { IconButton, Spinner, Stack, Text } from '@tokens-studio/ui';
import { ClipboardCopyIcon, DownloadIcon } from '@radix-ui/react-icons';
import { Handle, HandleContainer } from '../../handles.tsx';
import { flatTokensRestoreToMap } from '#/utils/index.ts';
import { NodeProps } from 'reactflow';
import {
  EXTERNAL_SET_ID,
  node,
} from '@tokens-studio/graph-engine/nodes/set/externalTokens.js';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import copy from 'copy-to-clipboard';
import { TokenSetHandles } from './tokensHandles.tsx';
import { EditorExternalSet } from '#/context/ExternalDataContext.tsx';

const ExternalSetNode: FC<NodeProps<EditorExternalSet>> = () => {
  const { setControls, setTitle, state, output, loadingEphemeralData } =
    useNode();

  const tokens = output && output[EXTERNAL_SET_ID];

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

  if (loadingEphemeralData) {
    return (
      <Stack
        css={{ width: '100%', padding: '$2' }}
        dir="row"
        align="center"
        justify="center"
      >
        <Spinner />
      </Stack>
    );
  }

  return (
    <div onDragOver={onDragOver}>
      <Stack direction="row" gap={2} justify="end">
        <HandleContainer type="source">
          <Handle id={EXTERNAL_SET_ID}>
            <Text>
              <i>As Set</i>{' '}
            </Text>
          </Handle>
        </HandleContainer>
      </Stack>
      <HandleContainer full type="source">
        {<TokenSetHandles tokens={tokens} />}
      </HandleContainer>
    </div>
  );
};

export default WrapNode(ExternalSetNode, {
  ...node,
});
