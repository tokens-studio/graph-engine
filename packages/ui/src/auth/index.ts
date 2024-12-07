import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma/index.ts';
import GitHub from 'next-auth/providers/github';
import NextAuth, { type Session } from 'next-auth';

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

export const handlers = adapter.handlers;
export const signOut = adapter.signOut;
export const auth = adapter.auth as () => Promise<Session | undefined>;
