import {
  AddDropdown,
  AlignDropdown,
  HelpDropdown,
  LayoutDropdown,
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
      <LayoutDropdown />
      <SettingsToolbarButton />
      <HelpDropdown />
    </>
  );
};
