import { Box, Dialog, Button } from "@tokens-studio/ui";
import { createClient } from '@supabase/supabase-js'
import { useState } from "react";
import { useGetEditor } from "#/hooks/useGetEditor.ts";

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


export function ShareDialog({ open, onClose, children }) {
    const { getJSON } = useGetEditor();
    const [shareLink, setShareLink] = useState(null)
    async function generateShareLink() {
        console.log("Creating share link")
        const json = getJSON()
        const { data, error } = await supabase
            .from('entries')
            .insert([
            { json: JSON.stringify(json) },
            ])
            .select()
        console.log(data)
        setShareLink(data)
    }
    return <Dialog>
        <Dialog.Trigger asChild>
            {children}
        </Dialog.Trigger>
        {open ? <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
                <Dialog.Title>Share</Dialog.Title>
                <Box>{JSON.stringify(shareLink)}</Box>
                <Button onClick={generateShareLink}>Create share link</Button>
            </Dialog.Content>
        </Dialog.Portal> : null}
    </Dialog>
}