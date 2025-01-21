import {
  ANY,
  BOOLEAN,
  COLOR,
  CURVE,
  NUMBER,
  OBJECT,
  STRING,
} from '@tokens-studio/graph-engine';
import { SelectPoint3d } from 'iconoir-react';
import Cube from '@tokens-studio/icons/Cube.js';
import Droplet from '@tokens-studio/icons/Droplet.js';
import EaseCurveControlPoints from '@tokens-studio/icons/EaseCurveControlPoints.js';
import Hashtag from '@tokens-studio/icons/Hashtag.js';
import InputOutput from '@tokens-studio/icons/InputOutput.js';
import React from 'react';
import Text from '@tokens-studio/icons/Text.js';

/**
 * Default icons for the graph editor
 * These icons are used to represent the different types of custom types in the graph editor
 */
export const iconsFactory = () =>
  ({
    [COLOR]: <Droplet />,
    [CURVE]: <EaseCurveControlPoints />,
    [STRING]: <Text />,
    [BOOLEAN]: <InputOutput />,
    [NUMBER]: <Hashtag />,
    [OBJECT]: <Cube />,
    [ANY]: <SelectPoint3d />,
  }) as Record<string, React.ReactNode>;
