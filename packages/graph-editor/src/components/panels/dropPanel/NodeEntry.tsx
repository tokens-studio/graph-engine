import { Text } from '@tokens-studio/ui/Text.js';
import React from 'react';
import styles from './nodeEntry.module.css';

export interface INodeEntry {
  icon?: React.ReactNode | string;
  text: string;
}

export const NodeEntry = ({ icon, text }: INodeEntry) => {
  return (
    <>
      {icon && <div className={styles.icon}>{icon}</div>}

      <Text size="xsmall" className={styles.title}>
        {text}
      </Text>
    </>
  );
};
