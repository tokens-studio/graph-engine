'use client';
import { Box, Stack } from "@tokens-studio/ui";
import { auth } from "@/auth/index.ts";
import Contexts from "./contexts.tsx";
import Rail from "@/components/rail.tsx";

export default async function Layout({ children }) {


    const session = await auth()
    if (!session?.user) return null


    return <Stack css={{ height: '100%', width: '100%' }}>
        <Box>
            <Rail avatar={session.user.image} />
        </Box>
        <Box css={{ flex: '1' }}>
            <Contexts>
                {children}
            </Contexts>
        </Box>
    </Stack>
}
