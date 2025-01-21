import * as Toolbar from '@radix-ui/react-toolbar';
import { useFrame } from '@/system/frame/hook.js';
import React from 'react';
import styles from './toolbar.module.css';

export const GraphToolbar = () => {
  const frame = useFrame();
  return (
    <Toolbar.Root className={styles.root}>{frame.toolbarButtons}</Toolbar.Root>
  );
};

export const ToolbarSeparator = ({ className = '', ...props }) => (
  <Toolbar.Separator
    className={`${styles.separator} ${className}`}
    {...props}
  />
);
