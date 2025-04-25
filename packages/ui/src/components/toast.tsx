import { toast } from '@tokens-studio/ui/Toast.js';
import React from 'react';

export interface TriggeredToastProps {
	description: string;
	title: string;
	children: React.ReactNode;
}

export const TriggeredToast = React.forwardRef((props, ref) => {
	React.useImperativeHandle(ref, () => ({
		publish: (props: TriggeredToastProps) => {
			toast(props.title, {
				description: props.description
			});
		}
	}));

	return null;
});

TriggeredToast.displayName = 'TriggeredToast';
