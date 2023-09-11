import { ButtonIcon } from '@radix-ui/react-icons';
import { NodeTypes } from '@tokens-studio/graph-engine';
import React from 'react';

export default {
  [NodeTypes.INPUT]: <ButtonIcon />,
  [NodeTypes.ENUMERATED_INPUT]: <ButtonIcon />,
  [NodeTypes.CSS_MAP]: './x',
  [NodeTypes.OUTPUT]: <ButtonIcon />,
  [NodeTypes.SLIDER]: '--.',
  [NodeTypes.CONSTANT]: <ButtonIcon />,
  [NodeTypes.ARRAY_INDEX]: '[.]',
  [NodeTypes.PASS_UNIT]: 'px',
};
