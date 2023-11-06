import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { GitBranchIcon } from '@primer/octicons-react';
import { useUIDSeed } from 'react-uid';
import {
  BranchSwitchMenu,
  BranchSwitchMenuContent,
  BranchSwitchMenuItem,
  BranchSwitchMenuMainTrigger,
  BranchSwitchMenuTrigger,
  BranchSwitchMenuRadioGroup,
  BranchSwitchMenuArrow,
} from './switchMenu.tsx';
import {
  branchSelector,
  localApiStateBranchSelector,
  apiSelector,
  localApiStateSelector,
} from '#/redux/selectors/index.ts';
import useRemoteTokens from '../store/remoteTokens';
import useConfirm from '#/hooks/useConfirm.ts';
import CreateBranchModal from './modals/CreateBranchModal';
import { BranchSwitchMenuRadioElement } from './radioElement.tsx';
import { compareLastSyncedState } from '#/storage/utils/compareLastSynccedState.ts';
import { isGitProvider } from '#/storage/utils/isGitProvider.ts';
import { StorageTypeCredentials } from '#/types/storageType.ts';
import { useDispatch } from '#/hooks/useDispatch.ts';
import { lastSynccedState, provider } from '#/redux/selectors/storage/index.ts';
import { branch, branches } from '#/redux/selectors/branch/index.ts';

const BranchSwitchMenuItemElement: React.FC<{
  branch: string;
  createNewBranchFrom: (branch: string) => void;
}> = ({ branch, createNewBranchFrom }) => {
  const onSelect = React.useCallback(
    () => createNewBranchFrom(branch),
    [branch, createNewBranchFrom],
  );

  return (
    <BranchSwitchMenuItem
      data-cy={`branch-selector-create-branch-from-branch-${branch}`}
      onSelect={onSelect}
    >
      <GitBranchIcon size={12} />
      {` ${branch}`}
    </BranchSwitchMenuItem>
  );
};

export default function BranchSelector() {
  const seed = useUIDSeed();
  const { confirm } = useConfirm();
  const { pullTokens, pushTokens } = useRemoteTokens();
  const dispatch = useDispatch();
  const providerValue = useSelector(provider);

  const branchesValue = useSelector(branches);
  const currentBranch = useSelector(branch);

  const branchState = useSelector(branchSelector);
  const lastSyncedStateValue = useSelector(lastSynccedState);

  const storageProvider = useSelector(provider);

  const localApiState = useSelector(localApiStateSelector);
  const localApiStateBranch = useSelector(localApiStateBranchSelector);
  const apiData = useSelector(apiSelector);
  const [startBranch, setStartBranch] = useState<string | null>(null);
  const [menuOpened, setMenuOpened] = useState(false);
  const [createBranchModalVisible, setCreateBranchModalVisible] =
    useState(false);
  const [isCurrentChanges, setIsCurrentChanges] = useState(false);

  const checkForChanges = React.useCallback(() => {
    const hasChanged = !compareLastSyncedState(lastSyncedStateValue, [{}, []]);
    return hasChanged;
  }, [lastSyncedStateValue, storageProvider]);

  const hasChanges = React.useMemo(() => checkForChanges(), [checkForChanges]);

  const askUserIfPushChanges = React.useCallback(async () => {
    const confirmResult = await confirm({
      text: 'You have unsaved changes',
      description: (
        <div>
          If you create or switch your branch without pushing your local changes
          <br /> to your repository, the changes will be lost.
        </div>
      ),
      confirmAction: 'Discard changes',
      cancelAction: 'Cancel',
    });
    if (confirmResult) {
      return confirmResult.result;
    }
    return null;
  }, [confirm]);

  const createBranchByChange = React.useCallback(() => {
    setMenuOpened(false);
    setIsCurrentChanges(true);
    setStartBranch(currentBranch ?? null);
    setCreateBranchModalVisible(true);
  }, [currentBranch]);

  const createNewBranchFrom = React.useCallback(
    async (branch: string) => {
      setMenuOpened(false);

      if (hasChanges && (await askUserIfPushChanges())) {
        await pushTokens();
      }

      setStartBranch(branch);
      setCreateBranchModalVisible(true);
    },
    [hasChanges, askUserIfPushChanges, pushTokens],
  );

  const changeAndPull = React.useCallback(
    async (branch: string) => {
      if (isGitProvider(apiData) && isGitProvider(localApiState)) {
        setMenuOpened(false);
        dispatch.branch.setBranch(branch);
        dispatch.uiState.setApiData({ ...apiData, branch });
        dispatch.uiState.setLocalApiState({ ...localApiState, branch });
        await pullTokens({
          context: { ...apiData, branch },
          usedTokenSet,
          activeTheme,
        });
        setStorageType({
          provider: { ...apiData, branch } as StorageTypeCredentials,
          shouldSetInDocument: true,
        });
      }
    },
    [apiData, localApiState, pullTokens, dispatch],
  );

  const onBranchSelected = React.useCallback(
    async (branch: string) => {
      if (hasChanges) {
        if (await askUserIfPushChanges()) {
          await changeAndPull(branch);
        } else setMenuOpened(false);
      } else {
        await changeAndPull(branch);
      }
    },
    [hasChanges, askUserIfPushChanges, changeAndPull],
  );

  // @params
  /*
   ** branch: branch name which is just created.
   ** branches: a list of branch names before new branch is created.
   */
  const onCreateBranchModalSuccess = React.useCallback(
    (branch: string, branches: string[]) => {
      setCreateBranchModalVisible(false);
      dispatch.branch.setBranch(branch);
      if (isGitProvider(apiData) && isGitProvider(localApiState)) {
        dispatch.branchState.setBranches(
          branches.includes(branch) ? branches : [...branches, branch],
        );
        dispatch.uiState.setApiData({ ...apiData, branch });
        dispatch.uiState.setLocalApiState({ ...localApiState, branch });
      }
    },
    [dispatch, apiData, localApiState],
  );

  const handleToggleMenu = React.useCallback(() => {
    setMenuOpened(!menuOpened);
  }, [menuOpened]);

  const handleCloseModal = React.useCallback(() => {
    setCreateBranchModalVisible(false);
  }, []);

  return currentBranch ? (
    <BranchSwitchMenu open={menuOpened} onOpenChange={handleToggleMenu}>
      <BranchSwitchMenuMainTrigger data-cy="branch-selector-menu-trigger">
        <GitBranchIcon size={16} />
        <span>{currentBranch}</span>
      </BranchSwitchMenuMainTrigger>

      <BranchSwitchMenuContent side="top" sideOffset={5}>
        <BranchSwitchMenuRadioGroup
          className="content content-dark scroll-container"
          css={{ maxHeight: '$dropdownMaxHeight' }}
          value={currentBranch}
        >
          {branchesValue.length > 0 &&
            branchesValue.map((branch, index) => (
              <BranchSwitchMenuRadioElement
                key={`radio_${seed(index)}`}
                branch={branch}
                branchSelected={onBranchSelected}
              />
            ))}
        </BranchSwitchMenuRadioGroup>
        <BranchSwitchMenu>
          <BranchSwitchMenuTrigger data-cy="branch-selector-create-new-branch-trigger">
            Create new branch from
            <ChevronRightIcon />
          </BranchSwitchMenuTrigger>
          <BranchSwitchMenuContent
            className="content scroll-container"
            css={{ maxHeight: '$dropdownMaxHeight' }}
            side="right"
            align="end"
          >
            {hasChanges && (
              <BranchSwitchMenuItem
                data-cy="branch-selector-create-new-branch-from-current-change"
                onSelect={createBranchByChange}
              >
                Current changes
              </BranchSwitchMenuItem>
            )}
            {branchesValue.length > 0 &&
              branchesValue.map((branch, index) => (
                <BranchSwitchMenuItemElement
                  key={seed(index)}
                  branch={branch}
                  createNewBranchFrom={createNewBranchFrom}
                />
              ))}
          </BranchSwitchMenuContent>
        </BranchSwitchMenu>
        <BranchSwitchMenuArrow offset={12} />
      </BranchSwitchMenuContent>
      {createBranchModalVisible && startBranch && (
        <CreateBranchModal
          isOpen={createBranchModalVisible}
          onClose={handleCloseModal}
          onSuccess={onCreateBranchModalSuccess}
          startBranch={startBranch}
          isCurrentChanges={isCurrentChanges}
        />
      )}
    </BranchSwitchMenu>
  ) : (
    <div />
  );
}
