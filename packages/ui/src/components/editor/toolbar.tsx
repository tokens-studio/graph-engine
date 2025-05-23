import {
	AddDropdown,
	AlignDropdown,
	DownloadToolbarButton,
	HelpDropdown,
	type ImperativeEditorRef,
	LayoutDropdown,
	PlayControls,
	SettingsToolbarButton,
	ToolbarSeparator,
	UploadToolbarButton,
	ZoomDropdown,
	mainGraphSelector,
	useOpenPanel
} from '@tokens-studio/graph-editor';

import { AISummary } from './panels/aiSummary.tsx';
import { IconButton, Tooltip } from '@tokens-studio/ui';
import { Preview } from './panels/preview.tsx';
import { ShareAndroidSolid } from 'iconoir-react';
import { SharePopover } from '../share/index.tsx';
import { client } from '@/api/sdk/index.ts';
import { useErrorToast } from '@/hooks/useToast.tsx';
import { useSelector } from 'react-redux';
import FloppyDisk from '@tokens-studio/icons/FloppyDisk.js';
import React from 'react';
import Sparks from '@tokens-studio/icons/Sparks.js';
import XrayView from '@tokens-studio/icons/XrayView.js';

let origin = '';
if (typeof window !== 'undefined') {
	window.location.protocol;
	origin = window.location.origin;
}

export const SaveButton = ({ id }) => {
	const mainGraph = useSelector(mainGraphSelector);
	const graphRef = mainGraph?.ref as ImperativeEditorRef | undefined;
	const { mutateAsync, isPending, error } =
		client.graph.updateGraph.useMutation();

	useErrorToast(error);

	const onSave = async () => {
		if (!graphRef || isPending) return;

		const saved = graphRef!.save();

		await mutateAsync({
			params: {
				id
			},
			body: {
				graph: saved as any
			}
		});
	};

	return (
		<Tooltip label='Save' side='bottom'>
			<IconButton
				emphasis='low'
				loading={isPending}
				onClick={onSave}
				icon={<FloppyDisk />}
			/>
		</Tooltip>
	);
};

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

export const AiSummary = () => {
	const { toggle } = useOpenPanel();
	return (
		<Tooltip label='Artificial intelligence' side='bottom'>
			<IconButton
				emphasis='low'
				onClick={() =>
					toggle({
						group: 'popout',
						title: <span>Artificial intelligence</span>,
						id: 'ai',
						content: <AISummary />
					})
				}
				icon={<Sparks />}
			/>
		</Tooltip>
	);
};

export const PreviewButton = () => {
	const { toggle } = useOpenPanel();
	return (
		<Tooltip label='Preview' side='bottom'>
			<IconButton
				emphasis='low'
				onClick={() =>
					toggle({
						group: 'popout',
						title: <span>Preview</span>,
						id: 'preview',
						content: <Preview />
					})
				}
				icon={<XrayView />}
			/>
		</Tooltip>
	);
};

export const createToolbarButtons = (buttons?: React.ReactElement) => {
	return (
		<>
			<AddDropdown />
			<ToolbarSeparator />
			<ZoomDropdown />
			<ToolbarSeparator />
			<AlignDropdown />
			<ToolbarSeparator />
			<PlayControls />
			<ToolbarSeparator />
			<LayoutDropdown />
			<SettingsToolbarButton />
			<HelpDropdown />
			<AiSummary />
			<PreviewButton />
			<ToolbarSeparator />
			<DownloadToolbarButton />
			<UploadToolbarButton />
			{buttons}
		</>
	);
};
