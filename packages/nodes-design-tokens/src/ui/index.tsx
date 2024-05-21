import React from 'react';
import { TOKEN, TOKEN_SET } from '../schemas/index.js';
import { CubeHole, DatabaseScript } from 'iconoir-react';


export const icons = {
    [TOKEN]: <CubeHole />,
    [TOKEN_SET]: <DatabaseScript />,
}

export { controls } from './controls/index.js';
export { specifics } from './nodes/index.js'