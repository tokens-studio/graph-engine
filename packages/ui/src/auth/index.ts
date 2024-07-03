import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GitHub from "next-auth/providers/github"
import NextAuth from "next-auth"

const prisma = new PrismaClient()

const adapter = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [GitHub]
})

export const { handlers, auth, signIn, signOut } = adapter