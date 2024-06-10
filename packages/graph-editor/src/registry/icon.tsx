import React from 'react';
import { ANY, BOOLEAN, COLOR, CURVE, NUMBER, OBJECT, STRING, VARIADIC_ANY, VARIADIC_COLOR, VARIADIC_NUMBER } from '@tokens-studio/graph-engine';
import { Cube, Droplet, EaseCurveControlPoints, Hashtag, InputOutput, SelectPoint3d, Text } from 'iconoir-react';

/**
 * Default icons for the graph editor
 * These icons are used to represent the different types of custom types in the graph editor
 */
export const icons = () => ({
  [COLOR]: <Droplet />,
  [VARIADIC_COLOR]: <Droplet />,
  [CURVE]: <EaseCurveControlPoints />,
  [STRING]: <Text />,
  [BOOLEAN]: <InputOutput />,
  [NUMBER]: <Hashtag />,
  [VARIADIC_NUMBER]: <Hashtag />,
  [OBJECT]: <Cube />,
  [ANY]: <SelectPoint3d />,
  [VARIADIC_ANY]: <SelectPoint3d />
} as Record<string, React.ReactNode>);
