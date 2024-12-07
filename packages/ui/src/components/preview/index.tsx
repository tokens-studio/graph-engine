'use client';
import './preview.css';
import {
	SandpackCodeEditor,
	SandpackLayout,
	SandpackPreview,
	SandpackProvider,
	type SandpackProviderProps,
	useSandpack
} from '@codesandbox/sandpack-react';
import { SandpackFileExplorer } from 'sandpack-file-explorer';

import React, { useEffect, useMemo } from 'react';

import 'react-reflex/styles.css';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useSearchParams } from 'next/navigation.js';

//The format is @sandpack:<ID>:<TEMPLATE_TYPE>

const PERSISTED_KEY = '@sandpack';

const Listener = ({ template, channelId }) => {
	const { sandpack } = useSandpack();
	const [channel, setChannel] = React.useState<BroadcastChannel | null>(null);

	useEffect(() => {
		const bc = new BroadcastChannel(`preview:${channelId}`);
		//Ask for the initial data
		bc.postMessage({
			type: 'request'
		});
		setChannel(bc);
		return () => bc.close();
	}, [channelId]);

	useEffect(() => {
		if (channel) {
			channel.onmessage = event => {
				const data = event.data;

				if (data.type == 'data') {
					sandpack.updateFile('generated.js', data.data, true);
				}
			};
		}
	}, [channel, sandpack]);

	useEffect(() => {
		const x = setInterval(() => {
			localStorage.setItem(
				`${PERSISTED_KEY}:${channelId}:${template}`,
				JSON.stringify(sandpack.files)
			);
		}, 8000);

		return () => {
			clearInterval(x);
		};
	}, [channelId, sandpack.files, template]);

	return <></>;
};

const Editor = () => {
	const search = useSearchParams();
	const channelId = search.get('id');
	const template = (search.get('template') ||
		'react') as SandpackProviderProps['template'];

	const initialFiles = useMemo(() => {
		const raw =
			localStorage.getItem(`${PERSISTED_KEY}:${channelId}:${template}`) || '{}';
		return JSON.parse(raw);
	}, [channelId, template]);

	return (
		<div style={{ height: '100%' }}>
			<SandpackProvider
				template={template}
				theme='auto'
				files={{
					...initialFiles,
					'generated.js': {
						code: 'export default {};',
						readOnly: true
					}
				}}
				options={{
					classes: {
						'sp-wrapper': 'preview-wrapper',
						'sp-layout': 'preview-layout'
					}
				}}
			>
				<Listener channelId={channelId} template={template} />
				<SandpackLayout className='preview'>
					<ReflexContainer orientation='vertical'>
						<ReflexElement maxSize={300}>
							<div className='preview-explorer'>
								<SandpackFileExplorer />
							</div>
						</ReflexElement>
						<ReflexSplitter propagate={true} />
						<ReflexElement>
							<SandpackCodeEditor
								showRunButton={true}
								closableTabs={true}
								showInlineErrors={true}
								showLineNumbers={true}
								showTabs={false}
							/>
						</ReflexElement>
						<ReflexSplitter propagate={true} />
						<ReflexElement>
							<SandpackPreview showOpenInCodeSandbox={false} />
						</ReflexElement>
					</ReflexContainer>
				</SandpackLayout>
			</SandpackProvider>
		</div>
	);
};

export default Editor;
