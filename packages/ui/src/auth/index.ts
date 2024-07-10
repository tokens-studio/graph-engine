import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma/index.ts';
import GitHub from 'next-auth/providers/github';
import NextAuth from 'next-auth';

const adapter = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [GitHub],
	trustHost: true,
	callbacks: {
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith('/')) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		}
	}
});

export const { handlers, auth, signIn, signOut } = adapter;
