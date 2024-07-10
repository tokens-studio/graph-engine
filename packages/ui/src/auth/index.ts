import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import NextAuth from 'next-auth';
import { prisma } from '@/lib/prisma/index.ts';


const adapter = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [GitHub],
	trustHost: true
});

export const { handlers, auth, signIn, signOut } = adapter;
