import { Text } from '@tokens-studio/ui';
import React from 'react';

export const NodeEntry = ({
  icon,
  text,
}: {
  icon?: React.ReactNode | string;
  text: string;
}) => {
  return (
    <>
      {icon && (
        <div
          style={{
            color: 'var(--color-neutral-canvas-default-fg-subtle)',
            width: 'var(--size-100)',
            height: 'var(--size-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: 'var(--font-body-sm)',
          }}
        >
          {icon}
        </div>
      )}

      <Text
        size="xsmall"
        style={{
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {text}
      </Text>
    </>
  );
};
