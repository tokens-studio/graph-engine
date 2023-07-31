import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface InputState {
  //Key is the id of the node
  [key: string]: Record<string, any>;
}

export const inputState = createModel<RootModel>()({
  state: {} as InputState,
  reducers: {
    //Removes all tracked input states
    clear: (state) => {
      return {};
    },
    set(state, payload: { id: string; value: any }) {
      return {
        ...state,
        [payload.id]: payload.value,
      };
    },
    /**
     * Removes a named input from the node
     * @param state
     * @param payload
     * @returns
     */
    remove(state, payload: { id: string; key: string }) {
      const { [payload.key]: _, ...rest } = state[payload.id];
      return {
        ...state,
        [payload.id]: {
          ...rest,
        },
      };
    },
    updateInput(state, payload: { id: string; key: string; value: any }) {
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id],
          [payload.key]: payload.value,
        },
      };
    },
    setState(state, payload) {
      return payload;
    },
  },
  effects: (dispatch) => ({}),
});
