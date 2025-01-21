import { AISummary } from '../panels/aiSummary.tsx';
import { DropPanelInner } from '@tokens-studio/graph-editor/index.js';
import { ErrorBoundary } from 'react-error-boundary';
import { MarketPlace } from '../panels/marketPlace.tsx';
import { Preview } from '../panels/preview.tsx';
import { TabBase, TabData } from 'rc-dock';
import { previewItems } from './previewItem.tsx';

export const tabLoader = (tab: TabBase): TabData | undefined => {
	switch (tab.id) {
		case 'ai':
			return {
				...tab,
				title: 'Artificial intelligence',
				content: <AISummary />
			};
		case 'preview':
			return {
				...tab,
				title: 'Preview',
				content: <Preview />
			};
		case 'marketplace':
			return {
				...tab,
				title: 'Marketplace',
				content: <MarketPlace />
			};
		case 'previewNodesPanel':
			return {
				group: 'popout',
				title: 'Preview',
				content: (
					<ErrorBoundary fallback={<div>Error</div>}>
						<DropPanelInner data={previewItems} />
					</ErrorBoundary>
				),
				closable: true
			};

		default:
			return undefined;
	}
};
