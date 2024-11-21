import {
  Accessibility,
  Calculator,
  CodeBrackets,
  CodeBracketsSquare,
  Css3,
  EaseCurveControlPoints,
  EditPencil,
  EmptyPage,
  EyeSolid,
  FillColor,
  SigmaFunction,
  SoundHigh,
  Star,
  Text,
  TwoPointsCircle,
  Type,
} from '@tokens-studio/icons';
import {
  PanelGroup,
  PanelItem,
  defaultPanelGroupsFactory,
} from '@tokens-studio/graph-editor';
import { nodeLookup as audioLookup } from '@tokens-studio/graph-engine-nodes-audio';
import { nodes as fsNodes } from '@tokens-studio/graph-engine-nodes-fs';
import React from 'react';

const icons = {
  accessibility: <Accessibility />,
  array: <CodeBracketsSquare />,
  color: <FillColor />,
  css: <Css3 />,
  curve: <EaseCurveControlPoints />,
  generic: <Star />,
  gradient: <FillColor />,
  logic: <CodeBrackets />,
  math: <Calculator />,
  preview: <EyeSolid />,
  series: <SigmaFunction />,
  string: <Text />,
  typing: <Type />,
  vector2: <TwoPointsCircle />,
  typography: <EditPencil />,
};

export const panelItems = defaultPanelGroupsFactory();

// Update the icons with our preferred ones
panelItems.groups.forEach((group) => {
  group.icon = icons[group.key];
});

panelItems.groups.push(
  new PanelGroup({
    title: 'Audio',
    key: 'audio',
    icon: <SoundHigh />,
    items: Object.values(audioLookup).map(
      (node) =>
        new PanelItem({
          type: node.type,
          text: node.title,
          description: node.description,
          docs: '',
        }),
    ),
  }),
);

panelItems.groups.push(
  new PanelGroup({
    title: 'File System',
    key: 'fs',
    icon: <EmptyPage />,
    items: fsNodes.map(
      (node) =>
        new PanelItem({
          type: node.type,
          text: node.title!,
          description: node.description,
          docs: '',
        }),
    ),
  }),
);
