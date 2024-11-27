import { Stack, Text } from '@tokens-studio/ui';
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
            width: 'var(--size-150)',
            height: 'var(--size-150)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: 'var(--typography-body-sm)',
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
