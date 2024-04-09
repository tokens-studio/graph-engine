import scale from '@/examples/scale.json';
import card from '@/examples/card.json';
import contrast from '@/examples/contrast.json';
import { IExample } from '@/types/IExample.tsx';
import basic from '@/examples/basic.json';
import { SerializedGraph } from '@tokens-studio/graph-engine';

export const examples: IExample[] = [

    {
        title: 'Basic',
        description:
            'The simplest possible example. An input and output.',
        file: basic as SerializedGraph,
        key: 'basic',
    },

]


// [
//   {
//     title: 'Simple color scale generator',
//     description:
//       'Generate a color scale based on a base color and a number of steps.',
//     file: scale,
//     key: 'scale',
//   },
//   {
//     title: 'Card',
//     description:
//       "Generate a card that's able to react to a large number of parameters.",
//     file: card,
//     key: 'card',
//   },
//   {
//     title: 'Contrast based text color',
//     description:
//       'Selects either white or black as font color based on the contrast node.',
//     file: contrast,
//     key: 'contrast',
//   },
// ];
