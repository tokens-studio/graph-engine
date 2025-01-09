import { Stack } from '@tokens-studio/ui/Stack.js';
import { getPreview } from '@tokens-studio/graph-engine-nodes-design-tokens/ui/controls/token.js';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './panel.module.css';
import type TableNode from './node.js';

const getNodeValue = data => {
	if (typeof data?.value === 'object') {
		return JSON.stringify(data.value);
	}
	return data?.value;
};

export const TokenTablePreview = observer(
	({ inputs }: { inputs: TableNode['inputs'] }) => {
		const tokens = inputs.tokens?.value || [];

		return (
			<div className={styles.container}>
				<table className={styles.table}>
					<thead>
						<tr
							className='ts-canvas'
							data-appearance='neutral'
							data-emphasis='subtle'
						>
							<th>Name</th>
							<th>Type</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						{tokens.map((token, index) => (
							<tr
								key={`${token.name}-${index}`}
								className='ts-surface'
								data-appearance='neutral'
								data-emphasis='ghost'
								data-interactive
							>
								<td>{token.name || 'Unnamed'}</td>
								<td>{token.type}</td>
								<td title={getNodeValue(token)}>
									<Stack direction='row' gap={3}>
										{getPreview(token)}
										{getNodeValue(token)}
									</Stack>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
);

export default TokenTablePreview;
