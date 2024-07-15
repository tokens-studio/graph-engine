import { auth } from '@/auth/index.ts';

export const authMiddleware = async (req: ExtendedRequest) => {
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
};
