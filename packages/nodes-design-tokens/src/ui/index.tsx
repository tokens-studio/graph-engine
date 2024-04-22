import React from 'react';
import { TOKEN, TOKEN_SET } from '../schemas/index.js';
import { TokenIcon } from './icons/token';
import { TokenSetIcon } from './icons/tokenSet';


export const icons = {
    [TOKEN]: <TokenIcon />,
    [TOKEN_SET]: <TokenSetIcon />,
}

export { controls } from './controls/index.js';