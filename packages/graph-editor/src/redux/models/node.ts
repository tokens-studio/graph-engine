import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface NodeState {
  //Key is the id of the node
  [key: string]: Record<string, any>;
}

export const nodeState = createModel<RootModel>()({
  state: {} as NodeState,
  reducers: {
    clear: () => {
      return {};
    },
    set(state, payload: { id: string; value: any }) {
      let value = payload.value;
      if (typeof payload.value === 'function') {
        value = payload.value(state[payload.id]);
      }

      return {
        ...state,
        [payload.id]: value,
      };
    },
    update(state, payload: { id: string; value: any }) {
      let value = payload.value;
      if (typeof payload.value === 'function') {
        value = payload.value(state[payload.id]);
      }

      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          ...payload.value,
        },
      };
    },
    duplicate(state, payload: { id: string; newId: string }) {
      return {
        ...state,
        [payload.newId]: {
          ...state[payload.id],
        },
      };
    },
    setState(state, payload) {
      return payload;
    },
  },
  effects: (dispatch) => ({
    getState(_, rootState) {
      //@ts-ignore
      return rootState.node;
    },
  }),
});
