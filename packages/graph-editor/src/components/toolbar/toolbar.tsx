import * as Toolbar from '@radix-ui/react-toolbar';
import { ToolBarButtonsSelector } from '@/redux/selectors/index.js';
import { useSelector } from 'react-redux';
import React from 'react';
import styles from './toolbar.module.css';

export const GraphToolbar = () => {
  const toolbarButtons = useSelector(ToolBarButtonsSelector);
  return <Toolbar.Root className={styles.root}>{toolbarButtons}</Toolbar.Root>;
};

export const ToolbarSeparator = ({ className = '', ...props }) => (
  <Toolbar.Separator className={`${styles.separator} ${className}`} {...props} />
);
