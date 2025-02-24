import { Annotations } from '@/types/annotations.js';
import { EventEmitter } from '../eventEmitter.js';
import { Port } from '@/programmatic/port.js';

export class CustomEvent {
    public label = '';
    public annotations: Annotations = {};
    public readonly eventEmitter = new EventEmitter<{
        [parameterName: string]: any;
    }>();

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly parameters: Port[] = []
    ) { }
}
