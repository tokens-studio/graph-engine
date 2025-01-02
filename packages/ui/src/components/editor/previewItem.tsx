import {
	DropPanelStore,
	PanelGroup,
	PanelItem
} from '@tokens-studio/graph-editor';
import { nodes as previewNodes } from '@tokens-studio/graph-engine-nodes-preview';

export const previewItems = ((): DropPanelStore => {
	const auto = Object.values<PanelGroup>(
		previewNodes.reduce(
			(acc, node) => {
				const defaultGroup = node.type.split('.');
				const groups = node.groups || [defaultGroup[defaultGroup.length - 2]];

				groups.forEach(group => {
					//If the group does not exist, create it
					if (!acc[group]) {
						acc[group] = new PanelGroup({
							title: group,
							key: group,
							items: []
						});
					}
					acc[group].items.push(
						new PanelItem({
							type: node.type,
							text: node.title || defaultGroup[defaultGroup.length - 2],
							description: node.description
						})
					);
				});
				return acc;
			},
			{} as Record<string, PanelGroup>
		)
	);

	return new DropPanelStore(auto);
})();
