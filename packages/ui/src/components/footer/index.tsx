import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { DownloadIcon, UploadIcon } from '@primer/octicons-react';
import BranchSelector from '../branchSelector/index.tsx';
import useRemoteTokens from '#/hooks/useRemoteStorage.ts';
import {
  localApiStateSelector,
  editProhibitedSelector,
  storageTypeSelector,
  usedTokenSetSelector,
  projectURLSelector,
} from '#/redux/selectors/index.ts';
import DocsIcon from '#/icons/docs.svg';

import FeedbackIcon from '#/icons/feedback.svg';

import { transformProviderName } from '@/utils/transformProviderName';
import { Box, IconButton, Link, Stack, Text, Tooltip } from '@tokens-studio/ui';
import { isGitProvider } from '#/utils/isGitProvider.ts';

export const Footer = () => {
  const storageType = useSelector(storageTypeSelector);
  const editProhibited = useSelector(editProhibitedSelector);
  const localApiState = useSelector(localApiStateSelector);
  const usedTokenSet = useSelector(usedTokenSetSelector);

  const { pullTokens, pushTokens } = useRemoteTokens();

  const onPushButtonClicked = React.useCallback(
    () => pushTokens(),
    [pushTokens],
  );
  const onPullButtonClicked = React.useCallback(
    () => pullTokens({ usedTokenSet }),
    [pullTokens, usedTokenSet],
  );
  const handlePullTokens = useCallback(() => {
    pullTokens({ usedTokenSet });
  }, [pullTokens, usedTokenSet]);

  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        padding: '$3',
      }}
    >
      <Stack direction="row" align="center" gap={2}>
        {isGitProvider(localApiState) && localApiState.branch && (
          <>
            <BranchSelector />
            <IconButton
              icon={<DownloadIcon />}
              onClick={onPullButtonClicked}
              tooltipSide="top"
              tooltip={`Pull from ${transformProviderName(
                storageType.provider,
              )}`}
            />
            <IconButton
              icon={<UploadIcon />}
              onClick={onPushButtonClicked}
              tooltipSide="top"
              disabled={!!editProhibited}
              tooltip={`Push to ${transformProviderName(storageType.provider)}`}
            />
          </>
        )}
      </Stack>
      <Stack direction="row" gap={4} align="center">
        <Stack direction="row" gap={1}>
          <Link href="https://docs.tokens.studio/?ref=pf">
            <IconButton icon={<DocsIcon />} tooltip="Docs" />
          </Link>
          <Link href="https://github.com/tokens-studio/figma-plugin">
            <IconButton icon={<FeedbackIcon />} tooltip="Feedback" />
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};
