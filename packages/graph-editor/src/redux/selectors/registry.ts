import { createSelector } from 'reselect';
import { registry } from './roots.js';

export const inputControls = createSelector(
  registry,
  (state) => state.inputControls,
);

export const ToolBarButtonsSelector = createSelector(
  registry,
  (state) => state.toolbarButtons,
);

export const SchemaSelector = createSelector(
  registry,
  (state) => state.schemas,
);
