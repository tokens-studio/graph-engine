'use-client';

import { Toast } from '@tokens-studio/ui';
import React, { createContext, useCallback, useEffect, useRef } from 'react';

export interface IToast {
	title: string;
	description: string;
}

export interface IToastProviderContext {
	enqueueToast: (toast: IToast) => void;
}

export const ToastProviderContext = createContext<IToastProviderContext>({
	enqueueToast: () => {
		/**/
	}
});

export interface IToastProviderProps {
	children: React.ReactNode;
}

export const ToastProvider = (props: IToastProviderProps) => {
	const { children } = props;
	const [toasts, setToasts] = React.useState([] as JSX.Element[]);
	const ref = useRef({
		toasts: [] as JSX.Element[]
	});

	const enqueueToast = useCallback(({ title, description }) => {
		const id = Date.now();
		const onChange = () => {
			ref.current.toasts = ref.current.toasts.filter(x => x.key != String(id));
			setToasts(ref.current.toasts);
		};

		setTimeout(() => {
			onChange();
		}, 8000);

		const ele = (
			<Toast.Root key={id} open onOpenChange={onChange}>
				<Toast.Message>
					<Toast.Title>{title}</Toast.Title>
					<Toast.Description>{description}</Toast.Description>
				</Toast.Message>
			</Toast.Root>
		);

		setToasts([...ref.current.toasts, ele]);
		// @ts-ignore
		ref.current.toasts.push(ele);
	}, []);

	return (
		<Toast.Provider>
			<ToastProviderContext.Provider value={{ enqueueToast }}>
				{children}
				{toasts}
			</ToastProviderContext.Provider>
			<Toast.Viewport />
		</Toast.Provider>
	);
};

export const useToast = () => {
	const context = React.useContext(ToastProviderContext);
	return context.enqueueToast;
};

export const useErrorToast = error => {
	const makeToast = useToast();
	useEffect(() => {
		if (error) {
			if ((error as Error).message) {
				makeToast({
					title: 'Error',
					description: error.message
				});
			} else if (error.errors) {
				// @ts-ignore
				error.errors.forEach(element => {
					makeToast({
						title: 'Error',
						description: element.message
					});
				});
			}
		}
	}, [error, makeToast]);
};
