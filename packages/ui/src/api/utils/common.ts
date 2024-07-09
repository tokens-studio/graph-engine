import { z } from 'zod';

export const ErrorResponse = z.object({
	message: z.string()
});
