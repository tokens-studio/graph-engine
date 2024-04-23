import React from 'react';
import { ANY, BOOLEAN, COLOR, CURVE, NUMBER, OBJECT, STRING} from '@tokens-studio/graph-engine';
import { Cube, Droplet, EaseCurveControlPoints, Gift, Hashtag, InputOutput, Text } from 'iconoir-react';

/**
 * Default icons for the graph editor
 * These icons are used to represent the different types of custom types in the graph editor
 */
export const icons = {
  [COLOR]: <Droplet />,
  [CURVE]: <EaseCurveControlPoints />,
  [STRING]: <Text />,
  [BOOLEAN]: <InputOutput />,
  [NUMBER]: <Hashtag />,
  [OBJECT]: <Cube />,
  [ANY]: <Gift />
  

} as Record<string, React.ReactNode>;
