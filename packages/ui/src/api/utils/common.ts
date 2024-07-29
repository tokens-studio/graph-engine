import { z } from 'zod';

export const ErrorResponse = z.object({
	message: z.string()
});

export const withCursor = possibleCursor => {
	const cursorId = possibleCursor;
	let cursorAdd = {};
	if (cursorId) {
		cursorAdd = {
			cursor: {
				id: cursorId
			}
		};
	}
	return cursorAdd;
};
