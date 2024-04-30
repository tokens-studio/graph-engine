
import { prisma } from "@/db/index.ts";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials"

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null

                // logic to salt and hash password
                const pwHash = saltAndHashPassword(credentials.password)

                // logic to verify if user exists
                user = await getUserFromDb(credentials.email, pwHash)

                if (!user) {
                    // No user found, so this is their first attempt to login
                    // meaning this is also the place you could do registration
                    throw new Error("User not found.")
                }

                // return user object with the their profile data
                return user
            },
        })
    ],
};
