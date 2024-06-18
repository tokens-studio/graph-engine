'use client';
import Rail from "@/components/rail.tsx";
import { Box, Stack } from "@tokens-studio/ui";
import Contexts from "./contexts.tsx";

export default function Layout({ children }) {
    return <Stack css={{ height: '100%', width: '100%' }}>
        <Box>
            <Rail />
        </Box>
        <Box css={{ flex: '1' }}>
            <Contexts>
                {children}
            </Contexts>
        </Box>
    </Stack>
}
