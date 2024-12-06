import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();
export const contract = c.router({
	getWhoAmI: {
		method: 'GET',
		path: '/auth/whoami',
		responses: {
			200: z.object({
				user: z.object({
					id: z.string(),
					name: z.string().nullable(),
					email: z.string().nullable(),
					image: z.string().nullable()
				})
			}),
			401: z.any()
		}
	},
	updateUser: {
		method: 'PUT',
		path: '/auth/details',
		body: z.object({
			name: z.string().optional(),
			image: z.string().optional()
		}),
		responses: {
			200: z.object({
				message: z.string()
			}),
			401: z.any()
		}
	}
});
