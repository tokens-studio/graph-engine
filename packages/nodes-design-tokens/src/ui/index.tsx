import { CubeHole, DatabaseScript } from 'iconoir-react';
import { TOKEN, TOKEN_SET } from '../schemas/index.js';
import React from 'react';


export const icons = {
    [TOKEN]: <CubeHole />,
    [TOKEN_SET]: <DatabaseScript />,
}

export { controls } from './controls/index.js';
export { specifics } from './nodes/index.js'