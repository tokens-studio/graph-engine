import { Context } from '../utils/types.ts';
import { contract } from '../contracts/auth.ts';
import { prisma } from '@/lib/prisma/index.ts';
import { tsr } from '@ts-rest/serverless/next';

export const router = tsr.router<typeof contract, Context>(contract, {
	getWhoAmI: async (_, { request }) => {
		return {
			status: 200,
			body: {
				user: request.session.user
			}
		};
	},
	updateUser: async ({ body }, { request }) => {
		const { name, image } = body;

		const data = {};

		if (name) {
			data['name'] = name;
		}
		if (image) {
			data['image'] = image;
		}
		await prisma.user.update({
			where: {
				id: request.user
			},
			data
		});

		return {
			status: 200,
			body: {
				message: 'User updated'
			}
		};
	}
});
