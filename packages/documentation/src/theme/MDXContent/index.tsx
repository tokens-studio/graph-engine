import MDXContent from '@theme-original/MDXContent';
import React from 'react';
import type { WrapperProps } from '@docusaurus/types';
import type MDXContentType from '@theme/MDXContent';

type Props = WrapperProps<typeof MDXContentType>;

export default function MDXContentWrapper(props: Props): JSX.Element {
	return (
		<>
			{/* TODO remove */}
			{/* Needed for injection of appropriate styles from the editor due to some of them being scoped internally by stitches*/}
			<div className='dark'>
				<MDXContent {...props} />
			</div>
		</>
	);
}
