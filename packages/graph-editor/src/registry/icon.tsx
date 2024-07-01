import React from 'react';
import { ANY, BOOLEAN, COLOR, CURVE, DIMENSION, NUMBER, OBJECT, STRING} from '@tokens-studio/graph-engine';
import { Cube, Droplet, EaseCurveControlPoints, Hashtag, InputOutput, Ruler, SelectPoint3d, Text } from 'iconoir-react';

/**
 * Default icons for the graph editor
 * These icons are used to represent the different types of custom types in the graph editor
 */
export const icons = () => ({
  [COLOR]: <Droplet />,
  [CURVE]: <EaseCurveControlPoints />,
  [DIMENSION]: <Ruler />,
  [STRING]: <Text />,
  [BOOLEAN]: <InputOutput />,
  [NUMBER]: <Hashtag />,
  [OBJECT]: <Cube />,
  [ANY]: <SelectPoint3d />,
} as Record<string, React.ReactNode>);
