import {
  AllSchemas,
  Node,
  SchemaObject,
} from '@tokens-studio/graph-engine';
import { RootModel } from './root.js';
import { createModel } from '@rematch/core';

import { inputControls } from '@/registry/inputControls.js';

export interface RegistryState {
  inputControls: Record<string, React.FC<{ node: Node }>>;
  schemas: SchemaObject[];
}

export const registryState = createModel<RootModel>()({
  state: {
    inputControls: { ...inputControls },
    schemas: AllSchemas,
  } as unknown as RegistryState,
  reducers: {
    setSchemas(state, schemas: SchemaObject[]) {
      return {
        ...state,
        schemas,
      };
    },
  },
});
