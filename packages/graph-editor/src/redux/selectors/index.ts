import { RootState } from '../store.tsx';

export const stateSelector = (id: string) => (state: RootState) =>
  state.node[id];
export const inputSelector = (id: string) => (state: RootState) =>
  state.input[id];
