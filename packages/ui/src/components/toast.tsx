import React from 'react';
import { Toast } from '@tokens-studio/ui';

export interface TriggeredToastProps {
    description: string;
    title: string
    children: React.ReactNode;
}

export const TriggeredToast = React.forwardRef((props, ref) => {

    const [toasts, setToasts] = React.useState<TriggeredToastProps[]>([]);

    React.useImperativeHandle(ref, () => ({
        publish: (props: TriggeredToastProps) => {
            setToasts((toasts) => [...toasts, props]);
        },
    }));

    return <>
        {toasts.map((val, index) => (
            <Toast.Root open={true}>
                <Toast.Title >{val.title}</Toast.Title>
                <Toast.Description>
                    {val.description}
                </Toast.Description>
                {/* <Toast.Action className="ToastAction" asChild altText="Goto schedule to undo">
                        <button className="Button small green">Undo</button>
                    </Toast.Action> */}
            </Toast.Root>
        ))}
    </>
});

TriggeredToast.displayName = 'TriggeredToast';