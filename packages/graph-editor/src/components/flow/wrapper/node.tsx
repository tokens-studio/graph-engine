import { Box, Spinner, Stack, Text } from '@tokens-studio/ui';
import { styled } from '@stitches/react';
import React, { useMemo } from 'react';

const CollapserContainer = styled('div', {});

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
  const styling = useMemo(() => {
    if (collapsed) {
      return {
        height: '0',
        overflow: 'hidden',
        '+*>*': {
          height: 0,
        },
      };
    }
  }, [collapsed]);

  return (
    <CollapserContainer css={styling}>
      <Box
        css={{
          position: 'relative',
          padding: '$2',
          paddingBottom: '$3',
        }}
      >
        {children}
      </Box>
    </CollapserContainer>
  );
};

const NodeWrapper = styled('div', {
  position: 'relative',
  boxShadow: '$contextMenu',
  borderRadius: '$medium',
  background: '$gray6',
  flex: 1,
  display: 'flex',
  variants: {
    error: {
      true: {
        '--nodeBorderColor': 'var(--colors-dangerFg)',
        '--nodeBgColor': 'var(--colors-dangerBg)',
        '--nodeTextColor': 'var(--colors-dangerFg)',
      },
    },
  },
});

export const Node = (props: NodeProps) => {
  const { icon, title, subtitle, error, isAsync, children, controls, ...rest } =
    props;

  return (
    <NodeWrapper error={Boolean(error)} className={error ? 'error' : ''}>
      <Stack
        className="reactflow-draggable-handle"
        direction="column"
        gap={0}
        css={{ flex: 1 }}
        {...rest}
      >
        {title && (
          <>
            <Stack
              direction="row"
              justify="between"
              align="center"
              css={{
                padding: '$3',
                backgroundColor: '$gray4',
                borderRadius: '$medium',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <Stack direction="row" gap={2} align="center">
                {icon && (
                  <Box
                    css={{
                      color: 'var(--nodeTextColor, var(--colors-gray12))',
                    }}
                  >
                    {icon}
                  </Box>
                )}
                <Stack direction="column">
                  <Text
                    css={{
                      fontSize: '$medium',
                      color: 'var(--nodeTextColor, var(--colors-gray12))',
                    }}
                  >
                    {title}
                  </Text>
                  {subtitle && (
                    <Text
                      css={{
                        fontSize: '$xsmall',
                        color: 'var(--nodeTextColor, var(--colors-gray10))',
                      }}
                    >
                      {subtitle}
                    </Text>
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
    </NodeWrapper>
  );
};

export default Node;
