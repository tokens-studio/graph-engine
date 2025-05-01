'use-client';

import { type ReactElement, useCallback } from 'react';
import { toast } from '@tokens-studio/ui/Toast.js';

interface IToast {
	title: string;
	description: string | ReactElement;
	appearance?: ToastAppearance;
}

export enum ToastAppearance {
	Error = 'error',
	Success = 'success',
	Message = 'message'
}

export const useErrorToast = (error: any) => {
	const makeToast = useToast();
	if (error) {
		if (typeof error === 'string') {
			makeToast({
				title: 'Error',
				description: error,
				appearance: ToastAppearance.Error
			});
		} else if (error instanceof Error) {
			makeToast({
				title: 'Error',
				description: error.message,
				appearance: ToastAppearance.Error
			});
		} else if (error.errors) {
			error.errors.forEach((element: any) => {
				makeToast({
					title: 'Error',
					description: element.message,
					appearance: ToastAppearance.Error
				});
			});
		} else if (error.body && error.body.message) {
			makeToast({
				title: 'Error',
				description: error.body.message,
				appearance: ToastAppearance.Error
			});
		}
	}
};

export const useToast = () => {
	const makeToast = useCallback((props: IToast) => {
		switch (props.appearance) {
			case ToastAppearance.Error:
				toast.error(props.title, {
					description: props.description
				});
				break;
			case ToastAppearance.Success:
				toast.success(props.title, {
					description: props.description
				});
				break;
			default:
				toast.message(props.title, {
					description: props.description
				});
				break;
		}
	}, []);
	return makeToast;
};
