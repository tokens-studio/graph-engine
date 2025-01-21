
import { IconButton, Tooltip } from '@tokens-studio/ui';
import { ShareAndroidSolid } from 'iconoir-react';
import { SharePopover } from '../../share/index.tsx';
import { client } from '@/api/sdk/index.ts';
import { useErrorToast } from '@/hooks/useToast.tsx';
import React from 'react';

let origin = '';
if (typeof window !== 'undefined') {
    window.location.protocol;
    origin = window.location.origin;
}


export const ShareButton = ({ id }) => {
    const { mutateAsync, isPending, error } =
        client.graph.updateGraph.useMutation();

    const [shareOpen, setShareOpen] = React.useState(false);

    useErrorToast(error);

    const onShare = async () => {
        if (isPending) return;

        try {
            await mutateAsync({
                params: {
                    id
                },
                body: {
                    public: true
                }
            });
            setShareOpen(true);
        } catch (err) {
            //Nothing
        }
    };

    const onClose = () => {
        setShareOpen(false);
    };

    return (
        <SharePopover
            open={shareOpen}
            onClose={onClose}
            link={`${origin}/editor/${id}`}
        >
            <Tooltip label='Share' side='bottom'>
                <IconButton
                    emphasis='low'
                    onClick={onShare}
                    loading={isPending}
                    icon={<ShareAndroidSolid />}
                />
            </Tooltip>
        </SharePopover>
    );
};
