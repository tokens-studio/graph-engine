import { createSelector } from 'reselect';
import { registry } from './roots.js';

export const icons = createSelector(registry, (state) => state.icons);
export const inputControls = createSelector(
  registry,
  (state) => state.inputControls,
);
export const controls = createSelector(registry, (state) => state.controls);

export const nodeSpecifics = createSelector(
  registry,
  (state) => state.nodeSpecifics,
);

export const panelItemsSelector = createSelector(
  registry,
  (state) => state.panelItems,
);

export const capabilitiesSelector = createSelector(
  registry,
  (state) => state.capabilities,
);

export const nodeTypesSelector = createSelector(
  registry,
  (state) => state.nodeTypes,
);

export const ToolBarButtonsSelector = createSelector(
  registry,
  (state) => state.toolbarButtons,
);

export const SchemaSelector = createSelector(
  registry,
  (state) => state.schemas,
);
