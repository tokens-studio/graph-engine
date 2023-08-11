import React from 'react';
import { useSelector } from 'react-redux';
import { DownloadIcon, UploadIcon } from '@primer/octicons-react';

import DocsIcon from '#/icons/docs.svg';

import FeedbackIcon from '#/icons/feedback.svg';

import { Box, IconButton, Link, Stack } from '@tokens-studio/ui';
import { isGitProvider } from '#/storage/utils/isGitProvider.ts';
import { provider } from '#/redux/selectors/storage/index.ts';
import { branches } from '#/redux/selectors/branch/index.ts';
import BranchSelector from '../branchSelector/index.tsx';

export const Footer = () => {
  const providerValue = useSelector(provider);
  const branchesValue = useSelector(branches);

  return (
    <Box
      css={{
        background: '$bgSurface',
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid $borderMuted',
        justifyContent: 'space-between',
        flexShrink: 0,
        padding: '$3',
      }}
    >
      <Stack direction="row" align="center" gap={2}>
        {providerValue &&
          isGitProvider(providerValue) &&
          branchesValue.length && (
            <>
              <BranchSelector />
              <IconButton
                icon={<DownloadIcon />}
                // onClick={onPullButtonClicked}
                tooltipSide="top"
                tooltip={`Pull from ${provider.name}`}
              />
              <IconButton
                icon={<UploadIcon />}
                // onClick={onPushButtonClicked}
                tooltipSide="top"
                tooltip={`Push to ${provider.name}`}
              />
            </>
          )}
      </Stack>
      <Stack direction="row" gap={4} align="center">
        <Stack direction="row" gap={2}>
          <Link href="https://docs.graph.tokens.studio/">
            <IconButton
              icon={<DocsIcon height={16} width={16} />}
              tooltip="Docs"
            />
          </Link>
          <Link href="https://github.com/tokens-studio/graph-engine">
            <IconButton
              icon={<FeedbackIcon height={16} width={16} />}
              tooltip="Feedback"
            />
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};
