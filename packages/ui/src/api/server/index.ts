import { QueryFunction } from '@tanstack/react-query';
import { auth } from '@/auth/index.ts';

export const runContract = (contractExecutor, opts: object = {}) => {
	const executor: QueryFunction<unknown, string[], unknown> = async () => {
		if (contractExecutor.handler) {
			contractExecutor = contractExecutor.handler;
		}

		const session = await auth();

		return await contractExecutor(
			{
				query: {},
				body: {},
				params: {},
				...opts
			},
			{
				request: {
					session: session,
					user: session?.user?.id
				}
			}
		).catch(err => {
			//Prevent the error from being swallowed
			console.error(err);
			throw err;
		});
	};

	return executor;
};
