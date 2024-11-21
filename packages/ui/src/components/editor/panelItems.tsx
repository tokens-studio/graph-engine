import {
	Accessibility,
	Calculator,
	CodeBrackets,
	CodeBracketsSquare,
	Css3,
	DatabaseScript,
	EaseCurveControlPoints,
	EditPencil,
	EyeSolid,
	FillColor,
	SigmaFunction,
	SoundHigh,
	Star,
	Text,
	TwoPointsCircle,
	Type
} from 'iconoir-react';
import {
	PanelGroup,
	PanelItem,
	defaultPanelGroupsFactory
} from '@tokens-studio/graph-editor';
import { nodeLookup as audioLookup } from '@tokens-studio/graph-engine-nodes-audio';
import { nodes as designNodes } from '@tokens-studio/graph-engine-nodes-design-tokens';

const icons = {
	accessibility: <Accessibility />,
	array: <CodeBracketsSquare />,
	color: <FillColor />,
	css: <Css3 />,
	curve: <EaseCurveControlPoints />,
	generic: <Star />,
	gradient: <FillColor />,
	logic: <CodeBrackets />,
	math: <Calculator />,
	preview: <EyeSolid />,
	series: <SigmaFunction />,
	string: <Text />,
	typing: <Type />,
	vector2: <TwoPointsCircle />,
	typography: <EditPencil />,
	naming: <Text />
};

// Helper to filter naming nodes
const namingNodes = designNodes.filter(node =>
	node.type.includes('studio.tokens.naming.')
);

// Helper to filter non-naming design token nodes
const tokenNodes = designNodes.filter(
	node => !node.type.includes('studio.tokens.naming.')
);

export const panelItems = defaultPanelGroupsFactory();

// Update the icons with our preferred ones
panelItems.groups.forEach(group => {
	group.icon = icons[group.key];
});

panelItems.groups.push(
	new PanelGroup({
		title: 'Audio',
		key: 'audio',
		icon: <SoundHigh />,
		items: Object.values(audioLookup).map(
			node =>
				new PanelItem({
					type: node.type,
					text: node.title,
					description: node.description,
					docs: ''
				})
		)
	})
);
panelItems.groups.push(
	new PanelGroup({
		title: 'Design Tokens',
		key: 'designTokens',
		icon: <DatabaseScript />,
		items: tokenNodes.map(
			node =>
				new PanelItem({
					type: node.type,
					text: node.title,
					description: node.description,
					docs: ''
				})
		)
	})
);
panelItems.groups.push(
	new PanelGroup({
		title: 'Naming',
		key: 'naming',
		icon: icons.naming,
		items: namingNodes.map(
			node =>
				new PanelItem({
					type: node.type,
					text: node.title,
					description: node.description,
					docs: ''
				})
		)
	})
);
