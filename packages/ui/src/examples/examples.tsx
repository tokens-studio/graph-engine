import scale from '#/examples/scale.json';
import card from '#/examples/card.json';
import contrast from '#/examples/contrast.json';
import { IExample } from '#/types/IExample.tsx';

export const examples: IExample[] = [
  {
    title: 'Simple color scale generator',
    description: 'Generate a color scale based on a base color and a number of steps.',
    file: scale,
    key: 'scale',
  },
  {
    title: 'Card',
    description: "Generate a card that's able to react to a large number of parameters.",
    file: card,
    key: 'card',
  },
  {
    title: 'Contrast based text color',
    description: 'Selects either white or black as font color based on the contrast node.',
    file: contrast,
    key: 'contrast',
  }
];
