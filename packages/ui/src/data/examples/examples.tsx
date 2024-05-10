
import { IExample } from '@/types/IExample.tsx';
import basic from './basic.json';
import audio from './audio.json';
import { SerializedGraph } from '@tokens-studio/graph-engine';

export const examples: IExample[] = [

    {
        title: 'Basic',
        description:
            'The simplest possible example. An input and output.',
        file: basic as unknown as SerializedGraph,
        key: 'basic',
    },
    {
        title: 'Audio - Oscillator',
        description:
            'A basic audio oscillator setup',
        file: audio as unknown as SerializedGraph,
        key: 'audio',
    },
];
