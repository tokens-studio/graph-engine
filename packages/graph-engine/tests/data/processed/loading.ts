import { SerializedNode } from '../../../src/graph/index.js';
import { StringSchema } from '../../../src/schemas/index.js';
import { TokenSchema } from '../../../../nodes-design-tokens/src/schemas/index.js';

export default {
    annotations: {
        'engine.version': '100.0.0'
    },
    nodes: [
        {
            id: 'c15d874f-f7e7-42a6-a6b3-8f238da52007',
            type: 'studio.tokens.generic.externalSet',
            inputs: [
                {
                    name: 'uri',
                    value: '',
                    type: StringSchema
                }
            ]
        },
        {
            id: '33952fc4-eced-4c10-a56d-7bdb65182b34',
            type: 'studio.tokens.generic.output',
            inputs: [
                {
                    name: 'input',
                    type: TokenSchema
                }
            ]
        }
    ] as SerializedNode[],
    edges: [
        {
            id: 'b7786ca3-f93c-4806-9c4e-ccc6e8e48825',
            source: 'c15d874f-f7e7-42a6-a6b3-8f238da52007',
            target: '33952fc4-eced-4c10-a56d-7bdb65182b34',
            sourceHandle: 'tokenSet',
            targetHandle: 'input'
        }
    ]
};
