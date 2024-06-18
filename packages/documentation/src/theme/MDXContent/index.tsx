import React from 'react';
import MDXContent from '@theme-original/MDXContent';
import type MDXContentType from '@theme/MDXContent';
import type { WrapperProps } from '@docusaurus/types';

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
