import * as Toolbar from '@radix-ui/react-toolbar';
import { useSystem } from '@/system/hook.js';
import React from 'react';
import styles from './toolbar.module.css';

export const GraphToolbar = () => {
  const system = useSystem();
  return (
    <Toolbar.Root className={styles.root}>{system.toolbarButtons}</Toolbar.Root>
  );
};

export const ToolbarSeparator = ({ className = '', ...props }) => (
  <Toolbar.Separator
    className={`${styles.separator} ${className}`}
    {...props}
  />
);
