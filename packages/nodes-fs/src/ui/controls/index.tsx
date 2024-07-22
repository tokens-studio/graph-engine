import { FILE } from '../../schemas/index.js';
import { FileField } from './file.js';
import type { Port } from '@tokens-studio/graph-engine';

export const controls = [
	{
		matcher: (port: Port) => port.type.$id === FILE,
		component: FileField
	}
];
