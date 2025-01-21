import { DragItem, PanelGroup } from '@tokens-studio/graph-editor';
import { Spinner } from '@tokens-studio/ui/Spinner.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { TextInput } from '@tokens-studio/ui/TextInput.js';
import { client } from '@/api/sdk/index.ts';
import DatabaseScript from '@tokens-studio/icons/DatabaseScript.js';
import React, { useCallback } from 'react';

export const compoundNodesDrop = new PanelGroup({
	title: 'Compounds',
	key: 'compounds',
	icon: <DatabaseScript />,
	items: [
		{
			type: 'data.compounds.smoothShadow',
			text: 'Smooth Shadow',
			description: 'A compound node that generates a smooth shadow effect',
			docs: ''
		}
	]
});

export const MarketPlace = () => {
	const [search, setSearch] = React.useState('');

	const { isLoading, data } = client.marketplace.searchGraphs.useQuery(
		['searchGraph', search],
		{
			query: {
				name: search as string
			}
		}
	);

	const onChange = useCallback(e => setSearch(e.target.value), []);

	return (
		<Stack direction='column' gap={3}>
			<TextInput placeholder='Search…' value={search} onChange={onChange} />

			{isLoading && <Spinner />}
			{!isLoading &&
				data?.body.graphs.map(graph => (
					<DragItem
						type={`graph.${graph.id}`}
						key={graph.id}
						title={graph.name}
					/>
				))}
		</Stack>
	);
};
