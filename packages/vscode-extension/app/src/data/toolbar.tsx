import {
  AddDropdown,
  AlignDropdown,
  HelpDropdown,
  LayoutDropdown,
  PlayControls,
  SettingsToolbarButton,
  ToolbarSeparator,
  ZoomDropdown,
} from '@tokens-studio/graph-editor';
import React from 'react';

export const Toolbar = () => {
  return (
    <>
      <AddDropdown />
      <ToolbarSeparator />
      <ZoomDropdown />
      <ToolbarSeparator />

      <AlignDropdown />
      <ToolbarSeparator />
      <PlayControls />
      <ToolbarSeparator />
      <LayoutDropdown />
      <SettingsToolbarButton />
      <HelpDropdown />
    </>
  );
};
