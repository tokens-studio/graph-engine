import {
  PanelGroup,
  PanelItem,
  defaultPanelGroupsFactory,
} from '@tokens-studio/graph-editor';
import { nodeLookup as audioLookup } from '@tokens-studio/graph-engine-nodes-audio';
import { nodes as fsNodes } from '@tokens-studio/graph-engine-nodes-fs';
import Accessibility from '@tokens-studio/icons/Accessibility.js';
import Calculator from '@tokens-studio/icons/Calculator.js';
import CodeBrackets from '@tokens-studio/icons/CodeBrackets.js';
import CodeBracketsSquare from '@tokens-studio/icons/CodeBracketsSquare.js';
import Css3 from '@tokens-studio/icons/Css3.js';
import EaseCurveControlPoints from '@tokens-studio/icons/EaseCurveControlPoints.js';
import EditPencil from '@tokens-studio/icons/EditPencil.js';
import EmptyPage from '@tokens-studio/icons/EmptyPage.js';
import Eye from '@tokens-studio/icons/Eye.js';
import FillColor from '@tokens-studio/icons/FillColor.js';
import React from 'react';
import SigmaFunction from '@tokens-studio/icons/SigmaFunction.js';
import SoundHigh from '@tokens-studio/icons/SoundHigh.js';
import Star from '@tokens-studio/icons/Star.js';
import Text from '@tokens-studio/icons/Text.js';
import TwoPointsCircle from '@tokens-studio/icons/TwoPointsCircle.js';
import Type from '@tokens-studio/icons/Type.js';

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
  preview: <Eye />,
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
