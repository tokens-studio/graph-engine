import { Box, Dialog, Button } from "@tokens-studio/ui";
import { createClient } from '@supabase/supabase-js'
import { useState } from "react";
import { useGetEditor } from "#/hooks/useGetEditor.ts";

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://yxbewbnfxixieqxqyjlt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4YmV3Ym5meGl4aWVxeHF5amx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAxNzI0MTMsImV4cCI6MjAxNTc0ODQxM30.UGz_mZlyBeIDdJa8YQMbjveLQ0mIPcPWkWoQbaBnLSQ'
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