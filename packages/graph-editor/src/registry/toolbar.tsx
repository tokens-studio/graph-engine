import { AddDropdown } from '@/components/toolbar/dropdowns/add.js';
import { AlignDropdown } from '@/components/toolbar/dropdowns/align.js';
import { DownloadToolbarButton } from '@/components/toolbar/buttons/download.js';
import { HelpDropdown } from '@/components/toolbar/dropdowns/help.js';
import { LayoutDropdown } from '@/components/toolbar/dropdowns/layout.js';
import { SettingsToolbarButton } from '@/components/toolbar/buttons/settings.js';
import { ToolbarSeparator } from '@/components/toolbar/index.js';
import { UploadToolbarButton } from '@/components/toolbar/buttons/upload.js';
import { ZoomDropdown } from '@/components/toolbar/dropdowns/zoom.js';
import React from 'react';

export const DefaultToolbarButtons = () => [
  <AddDropdown />,
  <ToolbarSeparator />,
  <ZoomDropdown />,
  <ToolbarSeparator />,
  <AlignDropdown />,
  <ToolbarSeparator />,
  <LayoutDropdown />,
  <SettingsToolbarButton />,
  <HelpDropdown />,
  <ToolbarSeparator />,
  <DownloadToolbarButton />,
  <UploadToolbarButton />,
];
