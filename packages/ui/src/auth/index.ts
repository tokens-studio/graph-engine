import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import NextAuth from 'next-auth';
import { prisma } from '@/lib/prisma/index.ts';
import { headers } from 'next/headers.js';


const adapter = NextAuth({

	adapter: PrismaAdapter(prisma),
	providers: [GitHub],
	trustHost: true,
	callbacks: {
		async redirect({ url, baseUrl }) {
			//Debug
			console.log(url,baseUrl,headers().get('host'))
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url
			return baseUrl
		}
	},
});

export const { handlers, auth, signIn, signOut } = adapter;
