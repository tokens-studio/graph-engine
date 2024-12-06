import { NextResponse } from 'next/server.js';
import { prisma } from '@/lib/prisma/index.ts';

export const GET = async (req, { params }) => {
	const { id } = params;

	//Split the id

	const [file, extension] = id.split('.');

	const thumbnail = await prisma.thumbnail.findFirst({
		where: {
			id: file,
			extension
		}
	});

	if (!thumbnail) {
		return new NextResponse('Thumbnail not found', { status: 404 });
	}

	const response = new NextResponse(thumbnail.data);
	response.headers.set('content-type', thumbnail.type);
	return response;
};
