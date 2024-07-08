'use client';
import { ImperativeEditorRef } from '@tokens-studio/graph-editor';
import { client } from '@/api/sdk/index.ts';
import { useEffect, useRef, useState } from 'react';
import { useErrorToast } from '@/hooks/useToast.tsx';
import Editor from '@/components/editor/index.tsx'


const Page = ({ id }) => {

    const [isLoading, setStillLoading] = useState(true);
    const ref = useRef<ImperativeEditorRef>();
    const { data, error } = client.graph.getGraph.useQuery(
        ['getGraph', id],
        {
            params: {
                id: id
            }
        }
    );
    useErrorToast(error);

    useEffect(() => {
        if (ref.current && data?.body) {
            ref.current.loadRaw(data.body.graph);
            setStillLoading(false);
        }
    }
        , [data, ref]);


    return <Editor ref={ref} loading={isLoading} />
}

export default Page;