import { TextInput, Dialog, Button } from "@tokens-studio/ui";

import { useState } from "react";
import { useGetEditor } from "#/hooks/useGetEditor.ts";
import { useShareURL } from "#/hooks/useShareURL.ts";



export function ShareDialog({ open, onClose, children }) {
    const { getJSON } = useGetEditor();
    const { createSupabaseEntry } = useShareURL();
    const [shareLink, setShareLink] = useState<string | null>(null);
    async function generateShareLink() {
        console.log("Creating share link")
        const json = getJSON()
        const generatedShareLink = await createSupabaseEntry(JSON.stringify(json))
        if (!generatedShareLink) {
            alert("Error creating share link")
            return
        }
        setShareLink(generatedShareLink)
    }
    return <Dialog>
        <Dialog.Trigger asChild>
            {children}
        </Dialog.Trigger>
        {open ? <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
                <Dialog.Title>Share</Dialog.Title>
                {shareLink && <TextInput value={shareLink} disabled css={{cursor: 'text'}} />}
                <Button onClick={generateShareLink}>Create share link</Button>
            </Dialog.Content>
        </Dialog.Portal> : null}
    </Dialog>
}