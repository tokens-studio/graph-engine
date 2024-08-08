import { FILE } from '../../schemas/index.js';
import { FileField } from './file.js';
import type { DataFlowPort } from '@tokens-studio/graph-engine';

export const controls = [
	{
		matcher: (port: DataFlowPort) => port.type.$id === FILE,
		component: FileField
	}
];
