import { z } from 'zod';

export const SerializedGraph = z.object({
	annotations: z.record(z.string(), z.any()).optional(),
	nodes: z
		.object({
			id: z.string(),
			annotations: z.record(z.string(), z.any()).optional(),
			type: z.string(),
			inputs: z.array(
				z.object({
					name: z.string(),
					value: z.any(),
					visible: z.boolean().optional(),
					variadic: z.boolean().optional(),
					dynamicType: z.object({}).optional(),
					type: z.record(z.any()).optional(),
					annotations: z.record(z.any()).optional()
				})
			)
		})
		//Needed for innergraph to work
		.passthrough()
		.array(),
	edges: z
		.object({
			id: z.string(),
			source: z.string(),
			target: z.string(),
			sourceHandle: z.string(),
			targetHandle: z.string(),
			annotations: z.record(z.string(), z.any()).optional()
		})
		.array()
});
