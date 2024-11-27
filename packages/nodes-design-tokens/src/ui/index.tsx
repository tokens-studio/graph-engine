import { REFERENCE, TOKEN, TOKEN_SET } from '../schemas/index.js';
import CubeHole from '@tokens-studio/icons/CubeHole.js';
import DatabaseScript from '@tokens-studio/icons/DatabaseScript.js';
import React from 'react';

export const icons = {
	[TOKEN]: <CubeHole />,
	[TOKEN_SET]: <DatabaseScript />
};

export const typeColors = {
	[REFERENCE]: {
		color: 'var(--jade-12)',
		backgroundColor: 'var(--jade-5)'
	},
	[TOKEN]: {
		color: 'var(--gold-12)',
		backgroundColor: 'var(--gold-10)'
	},
	[TOKEN_SET]: {
		color: 'var(--gold-12)',
		backgroundColor: 'var(--gold-8)'
	}
};

export { controls } from './controls/index.js';
export { specifics } from './nodes/index.js';
