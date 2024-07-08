import { z } from "zod";

export const SerializedGraph = z.object({
    annotations: z.record(z.string(), z.any()).optional(),
    nodes: z.object({
        id: z.string(),
        annotations: z.record(z.string(), z.any()).optional(),
        type: z.string(),
        inputs: z.array(z.object({
            name: z.string(),
            value: z.any(),
            visible: z.boolean(),
            variadic: z.boolean().optional(),
            dynamicType: z.object({}).optional(),
            type: z.object({}).optional(),
            annotations: z.record(z.any()).optional()
        }))
    }).array(),
    edges: z.object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
        sourceHandle: z.string(),
        targetHandle: z.string(),
        annotations: z.record(z.string(), z.any()).optional(),
    }).array()
});

