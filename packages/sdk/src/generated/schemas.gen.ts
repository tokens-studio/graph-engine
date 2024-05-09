// This file is auto-generated by @hey-api/openapi-ts

export const $CreatedGraph = {
    description: 'The created graph',
    properties: {
        id: {
            type: 'string'
        }
    },
    required: ['id'],
    type: 'object',
    additionalProperties: false
} as const;

export const $Record_string_any_ = {
    properties: {},
    additionalProperties: {},
    type: 'object',
    description: 'Construct a type with a set of properties K of type T'
} as const;

export const $SchemaObject = {
    properties: {
        id: {
            type: 'string'
        },
        '$id': {
            type: 'string'
        },
        '$schema': {
            type: 'string'
        },
        '$async': {
            type: 'boolean',
            enum: [false],
            nullable: false
        }
    },
    type: 'object',
    additionalProperties: {}
} as const;

export const $GraphSchema = {
    '$ref': '#/components/schemas/SchemaObject'
} as const;

export const $TypeDefinition = {
    properties: {
        type: {
            '$ref': '#/components/schemas/SchemaObject'
        },
        variadic: {
            type: 'boolean',
            description: 'When exposing an array of inputs or outputs, allow specific control for connecting each item'
        },
        visible: {
            type: 'boolean',
            description: 'Whether the input is visible by default in the UI'
        },
        annotations: {
            '$ref': '#/components/schemas/Record_string.any_',
            description: 'Additional annotations to store on the input'
        }
    },
    required: ['type'],
    type: 'object',
    additionalProperties: false
} as const;

export const $SerializedInput = {
    properties: {
        name: {
            type: 'string'
        },
        value: {},
        visible: {
            type: 'boolean'
        },
        variadic: {
            type: 'boolean'
        },
        type: {
            '$ref': '#/components/schemas/TypeDefinition'
        },
        dynamicType: {
            '$ref': '#/components/schemas/SchemaObject'
        },
        annotations: {
            '$ref': '#/components/schemas/Record_string.any_'
        }
    },
    required: ['name', 'visible', 'type'],
    type: 'object',
    additionalProperties: false
} as const;

export const $SerializedNode = {
    properties: {
        id: {
            type: 'string'
        },
        annotations: {
            '$ref': '#/components/schemas/Record_string.any_'
        },
        type: {
            type: 'string'
        },
        inputs: {
            items: {
                '$ref': '#/components/schemas/SerializedInput'
            },
            type: 'array'
        }
    },
    required: ['id', 'type', 'inputs'],
    type: 'object',
    additionalProperties: false
} as const;

export const $SerializedEdge = {
    properties: {
        id: {
            type: 'string'
        },
        source: {
            type: 'string'
        },
        target: {
            type: 'string'
        },
        sourceHandle: {
            type: 'string'
        },
        targetHandle: {
            type: 'string'
        },
        annotations: {
            '$ref': '#/components/schemas/Record_string.any_'
        }
    },
    required: ['id', 'source', 'target', 'sourceHandle', 'targetHandle'],
    type: 'object',
    additionalProperties: false
} as const;

export const $SerializedGraph = {
    properties: {
        annotations: {
            '$ref': '#/components/schemas/Record_string.any_'
        },
        nodes: {
            items: {
                '$ref': '#/components/schemas/SerializedNode'
            },
            type: 'array'
        },
        edges: {
            items: {
                '$ref': '#/components/schemas/SerializedEdge'
            },
            type: 'array'
        }
    },
    required: ['annotations', 'nodes', 'edges'],
    type: 'object',
    additionalProperties: false
} as const;

export const $SerializedGraphVal = {
    '$ref': '#/components/schemas/SerializedGraph'
} as const;

export const $GraphCreationParams = {
    properties: {
        description: {
            type: 'string',
            description: 'A human readable description of the graph'
        },
        graph: {
            '$ref': '#/components/schemas/SerializedGraph',
            description: 'The json serialized graph'
        },
        name: {
            type: 'string',
            description: 'A human readable name for the graph'
        }
    },
    required: ['graph', 'name'],
    type: 'object'
} as const;

export const $Pick_Graph_Exclude_keyofGraph_graph__ = {
    properties: {
        id: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        owner: {
            type: 'string'
        },
        createdAt: {
            type: 'string',
            format: 'date-time'
        },
        updatedAt: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: ['id', 'name', 'owner', 'createdAt', 'updatedAt'],
    type: 'object',
    description: 'From T, pick a set of properties whose keys are in the union K'
} as const;

export const $Omit_Graph_graph_ = {
    '$ref': '#/components/schemas/Pick_Graph.Exclude_keyofGraph.graph__',
    description: 'Construct a type with the properties of T except for those in type K.'
} as const;

export const $ListedGraph = {
    '$ref': '#/components/schemas/Omit_Graph.graph_'
} as const;

export const $ListGraphParams = {
    properties: {
        perPage: {
            type: 'integer',
            format: 'int32',
            default: 10,
            minimum: 1,
            maximum: 20
        },
        page: {
            type: 'integer',
            format: 'int32',
            default: 0,
            minimum: 0
        }
    },
    type: 'object',
    additionalProperties: false
} as const;

export const $Graph = {
    properties: {
        updatedAt: {
            type: 'string',
            format: 'date-time'
        },
        createdAt: {
            type: 'string',
            format: 'date-time'
        },
        owner: {
            type: 'string'
        },
        graph: {
            '$ref': '#/components/schemas/SerializedGraph'
        },
        name: {
            type: 'string'
        },
        id: {
            type: 'string'
        }
    },
    required: ['updatedAt', 'createdAt', 'owner', 'graph', 'name', 'id'],
    type: 'object'
} as const;

export const $InvokeableInputDefinition = {
    properties: {
        type: {
            '$ref': '#/components/schemas/SchemaObject'
        },
        value: {}
    },
    required: ['value'],
    type: 'object',
    additionalProperties: false
} as const;

export const $Record_string_InvokeableInputDefinition_ = {
    properties: {},
    additionalProperties: {
        '$ref': '#/components/schemas/InvokeableInputDefinition'
    },
    type: 'object',
    description: 'Construct a type with a set of properties K of type T'
} as const;

export const $InvokeParams = {
    properties: {
        graphId: {
            type: 'string'
        },
        payload: {
            '$ref': '#/components/schemas/Record_string.InvokeableInputDefinition_'
        }
    },
    required: ['graphId', 'payload'],
    type: 'object',
    additionalProperties: false
} as const;

export const $PaginatedParams = {
    properties: {
        perPage: {
            type: 'integer',
            format: 'int32',
            default: 10,
            minimum: 1,
            maximum: 20
        },
        page: {
            type: 'integer',
            format: 'int32',
            default: 0,
            minimum: 0
        }
    },
    type: 'object',
    additionalProperties: false
} as const;

export const $CredentialCreationParams = {
    properties: {},
    type: 'object',
    additionalProperties: false
} as const;

export const $PaginatedListCredsParams = {
    properties: {
        perPage: {
            type: 'integer',
            format: 'int32',
            default: 10,
            minimum: 1,
            maximum: 20
        },
        page: {
            type: 'integer',
            format: 'int32',
            default: 0,
            minimum: 0
        }
    },
    type: 'object',
    additionalProperties: false
} as const;