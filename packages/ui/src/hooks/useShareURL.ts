
import CryptoJS from 'crypto-js';
import { createClient } from '@supabase/supabase-js'
import { useGetEditor } from './useGetEditor.ts';
// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://yxbewbnfxixieqxqyjlt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4YmV3Ym5meGl4aWVxeHF5amx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAxNzI0MTMsImV4cCI6MjAxNTc0ODQxM30.UGz_mZlyBeIDdJa8YQMbjveLQ0mIPcPWkWoQbaBnLSQ'
const supabase = createClient(supabaseUrl!, supabaseKey!)

export function useShareURL() {
    const { loadExample } = useGetEditor();

    async function generateShareURL(id: number) {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://resolver.dev.tokens.studio';
        return `${baseUrl}/?id=${id}`;
    }
    
    async function createSupabaseEntry(json: string) {
        const { data, error } = await supabase
            .from('entries')
            .insert([
                { json },
            ])
            .select('uuid')
        if (error) {
            console.error(error)
        }
        if (!data) {
            alert("Error creating share link")
            return
        }
        console.log("Data is", data)
        const shareId = data[0].uuid
        console.log('share link is', data)
        return generateShareURL(shareId)
    }

    async function getSupabaseEntry(idParam: string) {
        try {
            const data = await fetchSupabaseEntry(idParam)
            const parsedData = await JSON.parse(data)
            loadExample(parsedData)
            return parsedData
        } catch (e) {
            console.error(e)
            alert("Error loading share link")
        }
    }

    async function fetchSupabaseEntry(uuid: string) {
        console.log('fetching', uuid)
        const { data, error } = await supabase
            .from('entries')
            .select('json')
            .eq('uuid', uuid)
        if (error) {
            console.error(error)
        }
        console.log('data is', data)
        if (!data) {
            return
        }
        return data[0].json
    }

    return { generateShareURL, getSupabaseEntry, createSupabaseEntry };
}
