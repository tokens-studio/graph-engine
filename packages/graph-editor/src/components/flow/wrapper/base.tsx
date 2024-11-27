import { Spinner, Stack, Text } from '@tokens-studio/ui';
import React, { useMemo } from 'react';
import styles from './base.module.css';

interface NodeProps {
  id: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  error?: Error | null;
  isAsync?: boolean;
  children?: React.ReactNode;
  controls?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Collapser = ({ children, collapsed }) => {
  const isCollapsed = useMemo(() => collapsed, [collapsed]);

  return (
    <div className={isCollapsed ? styles.collapserContainer : ''}>
      <div className={styles.collapserContent}>{children}</div>
    </div>
  );
};

export const BaseNodeWrapper = (props: NodeProps) => {
  const { icon, title, subtitle, error, isAsync, children, controls, ...rest } =
    props;

  return (
    <div className={`${styles.nodeWrapper} ${error ? styles.error : ''}`}>
      <Stack
        className="reactflow-draggable-handle"
        direction="column"
        gap={0}
        {...rest}
      >
        {title && (
          <>
            <Stack
              direction="row"
              justify="between"
              align="center"
              className={styles.header}
            >
              <Stack direction="row" gap={2} align="center">
                {icon}
                <Stack direction="column">
                  <Text className={styles.title}>{title}</Text>
                  {subtitle && (
                    <Text className={styles.subtitle}>{subtitle}</Text>
                  )}
                </Stack>
                {isAsync && <Spinner />}
              </Stack>
              <Stack direction="row" gap={2}>
                {controls}
              </Stack>
            </Stack>
          </>
        )}
        {children}
      </Stack>
    </div>
  );
};

export default BaseNodeWrapper;
