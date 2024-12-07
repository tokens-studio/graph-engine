import { type ExtendedRequest } from '../utils/types.ts';

const rateLimitMap = new Map();

export default function rateLimitMiddleware(
	req: ExtendedRequest
): Response | void {
	const user = req.user;
	const limit = 5; // Limiting requests to 5 per minute per user
	const windowMs = 60 * 1000; // 1 minute

	if (!rateLimitMap.has(user)) {
		rateLimitMap.set(user, {
			count: 0,
			lastReset: Date.now()
		});
	}

	const userData = rateLimitMap.get(user);

	if (Date.now() - userData.lastReset > windowMs) {
		userData.count = 0;
		userData.lastReset = Date.now();
	}

	if (userData.count >= limit) {
		return Response.json(
			{
				message: 'Too Many Requests'
			},
			{
				status: 429
			}
		);
	}

	userData.count += 1;
}
