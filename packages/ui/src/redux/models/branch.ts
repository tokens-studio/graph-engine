import { createModel } from '@rematch/core';
import { RootModel } from './root.ts';

export interface BranchState {
  branch: string;
  branches: string[];
}

export const branchState = createModel<RootModel>()({
  state: {
    /**
     * The stored branch
     */
    branch: '',
    branches: [],
  } as BranchState,
  reducers: {
    setBranch: (state, data: string) => ({
      ...state,
      branch: data,
    }),

    setBranches: (state, data: string[]) => ({
      ...state,
      branches: data,
    }),
  },
});
