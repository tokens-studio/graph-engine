import { type ExtendedRequest } from '../utils/types.ts';
import { auth } from '@/auth/index.ts';

export const authMiddleware = async (
	req: ExtendedRequest
): Promise<Response | void> => {
	const session = await auth();
	if (!session) {
		return Response.json(
			{},
			{
				status: 401
			}
		);
	}
	req.session = session;
	req.user = session.user!.id!;
	

	//Ensure that the id can never be falsy
	if (!req.user) {
		return Response.json(
			{},
			{
				status: 401
			}
		);
	}
};
