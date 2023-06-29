import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import useStorage from './useStorage';
import { useGitHub } from './providers/github';

import useFile from '@/app/store/providers/file';

import {
  activeTabSelector,
  apiSelector,
  themesListSelector,
  tokensSelector,
} from '@/selectors';
import { AsyncMessageTypes } from '@/types/AsyncMessages';
import { AsyncMessageChannel } from '@/AsyncMessageChannel';
import { StorageProviderType } from '@/constants/StorageProviderType';
import {
  StorageTypeCredentials,
  StorageTypeFormValues,
} from '@/types/StorageType';
import {
  RemoteResponseData,
  RemoteResponseStatus,
} from '@/types/RemoteResponseData';
import { ErrorMessages } from '@/constants/ErrorMessages';
import { saveLastSyncedState } from '@/utils/saveLastSyncedState';
import { applyTokenSetOrder } from '@/utils/tokenset';
import { isEqual } from '@/utils/isEqual';
import usePullDialog from '../hooks/usePullDialog';

type PullTokensOptions = {
  context?: StorageTypeCredentials;
};

// @TODO typings and hooks

export const useRemoteStorage = () => {
  const dispatch = useDispatch();
  const api = useSelector(apiSelector);
  const tokens = useSelector(tokensSelector);
  const themes = useSelector(themesListSelector);
  const activeTab = useSelector(activeTabSelector);
  const { showPullDialog, closePullDialog } = usePullDialog();

  const { setStorageType } = useStorage();

  const {
    addNewGitHubCredentials,
    syncTokensWithGitHub,
    pullTokensFromGitHub,
    pushTokensToGitHub,
    createGithubBranch,
    fetchGithubBranches,
    checkRemoteChangeForGitHub,
  } = useGitHub();
  const { readTokensFromFileOrDirectory } = useFile();

  const pullTokens = useCallback(
    async ({ context = api }: PullTokensOptions) => {
      showPullDialog('loading');
      let remoteData: RemoteResponseData<unknown> | null = null;
      switch (context.provider) {
        case StorageProviderType.GITHUB: {
          remoteData = await pullTokensFromGitHub(context);
          break;
        }
        default:
          throw new Error('Not implemented');
      }
      if (remoteData?.status === 'success') {
        if (
          !isEqual(tokens, remoteData.tokens) ||
          !isEqual(themes, remoteData.themes)
        ) {
          let shouldOverride = false;

          dispatch.tokenState.setChangedState({
            tokens: remoteData.tokens,
            themes: remoteData.themes,
          });
          shouldOverride = !!(await showPullDialog());

          if (shouldOverride) {
            switch (context.provider) {
              case StorageProviderType.GITHUB: {
                dispatch.uiState.setApiData({
                  ...context,
                  ...(remoteData.commitSha
                    ? { commitSha: remoteData.commitSha }
                    : {}),
                });
                break;
              }

              default:
                break;
            }
            saveLastSyncedState(
              dispatch,
              remoteData.tokens,
              remoteData.themes,
              remoteData.metadata,
            );
            dispatch.tokenState.setTokenData({
              values: remoteData.tokens,
              themes: remoteData.themes,
            });
          }
        }
      }
      dispatch.tokenState.resetChangedState();
      closePullDialog();
      return remoteData;
    },
    [
      tokens,
      themes,
      activeTab,
      dispatch,
      api,
      pullTokensFromGitHub,

      showPullDialog,
      closePullDialog,
    ],
  );

  const restoreStoredProvider = useCallback(
    async (context: StorageTypeCredentials) => {
      dispatch.uiState.setLocalApiState(context);
      dispatch.uiState.setApiData(context);
      dispatch.tokenState.setEditProhibited(false);
      setStorageType({ provider: context, shouldSetInDocument: true });
      let content: RemoteResponseData | null = null;
      switch (context.provider) {
        case StorageProviderType.GITHUB: {
          content = await syncTokensWithGitHub(context);
          break;
        }
        default:
          content = await pullTokens({ context });
      }
      if (content?.status === 'failure') {
        return {
          status: 'failure',
          errorMessage: content?.errorMessage,
        };
      }
      if (content) {
        return {
          status: 'success',
        };
      }
      return {
        status: 'failure',
        errorMessage: ErrorMessages.GENERAL_CONNECTION_ERROR,
      };
    },
    [dispatch, setStorageType, pullTokens, syncTokensWithGitHub],
  );

  const pushTokens = useCallback(
    async (context: StorageTypeCredentials = api) => {
      switch (context.provider) {
        case StorageProviderType.GITHUB: {
          await pushTokensToGitHub(context);
          break;
        }
        default:
          throw new Error('Not implemented');
      }
    },
    [api, pushTokensToGitHub],
  );

  const addNewProviderItem = useCallback(
    async (
      credentials: StorageTypeFormValues<false>,
    ): Promise<RemoteResponseStatus> => {
      let content: RemoteResponseData | null = null;
      switch (credentials.provider) {
        case StorageProviderType.GITHUB: {
          content = await addNewGitHubCredentials(credentials);
          break;
        }
        default:
          throw new Error('Not implemented');
      }
      if (content?.status === 'failure') {
        return {
          status: 'failure',
          errorMessage: content?.errorMessage,
        };
      }
      if (content) {
        dispatch.uiState.setLocalApiState(
          credentials as StorageTypeCredentials,
        ); // in JSONBIN the ID can technically be omitted, but this function handles this by creating a new JSONBin and assigning the ID
        dispatch.uiState.setApiData(credentials as StorageTypeCredentials);
        setStorageType({
          provider: credentials as StorageTypeCredentials,
          shouldSetInDocument: true,
        });
        return {
          status: 'success',
        };
      }
      return {
        status: 'failure',
        errorMessage: ErrorMessages.GENERAL_CONNECTION_ERROR,
      };
    },
    [dispatch, addNewGitHubCredentials, setStorageType],
  );

  const addNewBranch = useCallback(
    async (
      context: StorageTypeCredentials,
      branch: string,
      source?: string,
    ) => {
      let newBranchCreated = false;
      switch (context.provider) {
        case StorageProviderType.GITHUB: {
          newBranchCreated = await createGithubBranch(context, branch, source);
          break;
        }

        default:
          throw new Error('Not implemented');
      }
      return newBranchCreated;
    },
    [createGithubBranch],
  );

  const fetchBranches = useCallback(
    async (context: StorageTypeCredentials) => {
      switch (context.provider) {
        case StorageProviderType.GITHUB:
          return fetchGithubBranches(context);
        default:
          return null;
      }
    },
    [fetchGithubBranches],
  );

  const deleteProvider = useCallback((provider) => {
    AsyncMessageChannel.ReactInstance.message({
      type: AsyncMessageTypes.REMOVE_SINGLE_CREDENTIAL,
      context: provider,
    });
  }, []);

  const fetchTokensFromFileOrDirectory = useCallback(
    async ({ files }: { files: FileList | null }) => {
      if (files) {
        const remoteData = await readTokensFromFileOrDirectory(files);
        if (remoteData?.status === 'success') {
          const sortedTokens = applyTokenSetOrder(
            remoteData.tokens,
            remoteData.metadata?.tokenSetOrder ??
              Object.keys(remoteData.tokens),
          );
          dispatch.tokenState.setTokenData({
            values: sortedTokens,
            themes: remoteData.themes,
          });
        }
        return remoteData;
      }
      return null;
    },
    [dispatch, readTokensFromFileOrDirectory],
  );

  const checkRemoteChange = useCallback(
    async (context: StorageTypeCredentials = api): Promise<boolean> => {
      let hasChange = false;
      switch (context?.provider) {
        case StorageProviderType.GITHUB: {
          hasChange = await checkRemoteChangeForGitHub(context);
          break;
        }

        default:
          hasChange = false;
          break;
      }
      return hasChange;
    },
    [api, checkRemoteChangeForGitHub],
  );

  return useMemo(
    () => ({
      restoreStoredProvider,
      deleteProvider,
      pullTokens,
      pushTokens,
      addNewProviderItem,
      fetchBranches,
      addNewBranch,
      fetchTokensFromFileOrDirectory,
      checkRemoteChange,
    }),
    [
      restoreStoredProvider,
      deleteProvider,
      pullTokens,
      pushTokens,
      addNewProviderItem,
      fetchBranches,
      addNewBranch,
      fetchTokensFromFileOrDirectory,
      checkRemoteChange,
    ],
  );
};
