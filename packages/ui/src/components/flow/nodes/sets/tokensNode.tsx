/* eslint-disable no-nested-ternary */
import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { Box, IconButton, Stack, Text } from '@tokens-studio/ui';
import {
  ClipboardCopyIcon,
  Cross1Icon,
  DownloadIcon,
} from '@radix-ui/react-icons';
import { Handle, HandleContainer } from '../../handles.tsx';
import { IResolvedToken, flatTokensRestoreToMap } from '#/utils/index.ts';
import { NodeProps } from 'reactflow';
import {
  SET_ID,
  node,
} from '@tokens-studio/graph-engine/nodes/set/inlineTokens.js';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { processTokensFile } from '#/utils/tokenFiles.ts';
import PreviewToken from '../../preview/token.tsx';
import copy from 'copy-to-clipboard';

const getTypographyValue = (data) => {
  if (typeof data.value == 'string') {
    return data.value;
  }
  return `<Complex Typography>`;
};
const getNodeValue = (data) => {
  switch (data.type) {
    case 'typography':
      return getTypographyValue(data);
    case 'composition':
      return 'Composition';
    case 'border':
      return 'Border';
    case 'boxShadow':
      return 'Shadow';
    default:
      return data.value;
  }
};
const getToolTipData = (data) => {
  if (typeof data == 'object') {
    return JSON.stringify(data, null, 4);
  }

  return data.value;
};

type TokenSetData = {
  tokens: IResolvedToken[];
  name: string;
};

const InlineSetNode: FC<NodeProps<TokenSetData>> = ({ id, data }) => {
  const { setControls, setTitle, state, output, setState } = useNode();

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

  const handles = useMemo(() => {
    if (!tokens) {
      return null;
    }

    return tokens.map((token) => {
      return (
        <Stack
          direction="row"
          css={{ width: '100%' }}
          key={token.name}
          align="center"
        >
          <Box
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              flexGrow: 1,
              alignItems: 'center',
              gap: '$2',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <PreviewToken token={token} />
          </Box>
          <Handle id={token.name}>
            <Box
              title={getToolTipData(token)}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: '200px',
                textOverflow: 'ellipsis',
              }}
            >
              {getNodeValue(token)}
            </Box>
          </Handle>
        </Stack>
      );
    });
  }, [tokens]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    const data = await processTokensFile(file);
    setState(() => data);
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
  }, [onCopyClipboard, onDownload]);

  useEffect(() => {
    state.title && setTitle(state.title);
  }, [state.title]);

  return (
    <div onDragOver={onDragOver} onDrop={onDrop}>
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
        {handles}
      </HandleContainer>
    </div>
  );
};

export default WrapNode(InlineSetNode, {
  ...node,
  title: 'Token Set',
});
