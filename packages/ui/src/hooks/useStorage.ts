import { StorageType } from '#/types/storageType.ts';
import { useCallback } from 'react';
import { useDispatch } from './useDispatch.ts';

type SetStorageTypeOptions = {
  provider: StorageType;
};

export default function useStorage() {
  const dispatch = useDispatch();

  const setStorageType = useCallback(
    ({ provider }: SetStorageTypeOptions) => {
      dispatch.storageState.setStorageType(provider);
    },
    [dispatch],
  );

  return { setStorageType };
}
