import { TOKEN } from '../../schemas/index.js';
import { TokenArrayField } from './tokenSet.js';
import { TokenField } from './token.js';
import { VariadicTokenSet } from './variadicTokenSet.js';
import { variadicMatcher } from '@tokens-studio/graph-editor';
import type { DataFlowPort, Input } from '@tokens-studio/graph-engine';

export const controls = [
	{
		matcher: (port: DataFlowPort) => {
			const inputPort = port as Input;
			return (
				inputPort.type.type === 'array' &&
				inputPort.type.items?.$id === TOKEN &&
				!inputPort.variadic
			);
		},
		component: TokenArrayField
	},
	{
		matcher: (port: DataFlowPort) => port.type.$id === TOKEN,
		component: TokenField
	},
	{
		matcher: variadicMatcher(TOKEN),
		component: VariadicTokenSet
	}
];
