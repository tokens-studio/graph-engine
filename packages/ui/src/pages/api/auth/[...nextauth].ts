

import { authOptions } from '@/auth/index.ts';
import NextAuth from 'next-auth/next';


export default NextAuth(authOptions);