import { Box, Stack, Text, Tooltip } from '@tokens-studio/ui';
import { Position, Handle as RawHandle } from 'reactflow';
import { styled } from '#/lib/stitches/index.ts';
import { useHasConnection, useIsValidConnection } from './nodes/hooks/useIsValidConnection.ts';
import { useNode } from './wrapper/nodeV2.tsx';
import React, { createContext, useContext } from 'react';

export const HandleContext = createContext<{
  position: Position;
  type: 'source' | 'target';
}>({
  type: 'source',
  position: Position.Right,
});

type HolderProps = {
  type: 'source' | 'target';
  children: React.ReactNode;
  full?: boolean;
};

export const HandleContainerContext = createContext<{
  collapsed: boolean;
  hide?: boolean;
  onConnect?: (params: any) => void;
}>({
  collapsed: false,
  hide: false,
});

export const HandleContainer = ({ type, children, full }: HolderProps) => {
  const position = type === 'source' ? Position.Right : Position.Left;
  return (
    <HandleContext.Provider value={{ type, position }}>
      <Stack
        direction="column"
        gap={1}
        css={{ flexBasis: full ? '100%' : '50%', position: 'relative' }}
        className={type === 'source' ? 'handleContainer-source' : 'handleContainer-target'}
      >
        {children}
      </Stack>
    </HandleContext.Provider>
  );
};

const useHandle = () => {
  return useContext(HandleContext);
};

const StyledRawHandle = styled(RawHandle, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1em !important',
  height: '1em !important',
  background: 'transparent !important',
  border: 'none !important',
  '&::after': {
    content: "''",
    width: '4px',
    height: '9px',
    border: '1px solid var(--colors-accentBorder)',
    background: 'var(--colors-accentEmphasis)',
    borderRadius: '2px',
    flexShrink: 0,
    opacity: 1,
  },
  variants: {
    error: {
      true: {
        '&::after': {
          background: 'var(--colors-dangerFg)',
          borderColor: 'var(--colors-dangerBorder)',
        },
      },
    },
    hide: {
      true: {
        opacity: 0,
      },
    },
    isConnected: {
      true: {
        background: 'var(--colors-accentEmphasis) !important',
      },
    },
    left: {
      true: {
        marginLeft: '4px',
      },
      false: {
        marginRight: '4px',
      },
    },
  },
  '&:hover': {
    '&::after': {
      opacity: 1,
      width: '12px',
      height: '12px',
    },
  },
});

function humanReadableInputType(type: InputTypes) {
  switch (type) {
    case InputTypes.ANY:
      return 'Any';
    case InputTypes.STRING:
      return 'String';
    case InputTypes.NUMBER:
      return 'Number';
    case InputTypes.COLOR:
      return 'Color';
  }
}

export function HandleType({type}: {type: InputTypes}) {
  return (
    <Tooltip label={humanReadableInputType(type)}>
      <Box
        className="handleType"
        css={{
          width: '1rem',
          height: '1rem',
          borderRadius: '$small',
          background: '$bgSubtle',
          color: '$fgSubtle',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '$xxsmall',
          fontWeight: '$sansBold',
          textTransform: 'uppercase',
        }}
      >
        {type[0]}
      </Box>
    </Tooltip>
  );
}

export const HandleText = styled(Text, {
  textTransform: 'uppercase',
  fontWeight: '$sansBold',
  fontSize: '$xxsmall',
  color: '$fgDefault',
  whiteSpace: 'nowrap',
  lineHeight: '24px',
  marginRight: '$3',
  variants: {
    secondary: {
      true: {
        color: '$fgMuted',
      },
    },
    caseSensitive: {
      true: {
        textTransform: 'none',
      },
    },
  },
});

export const DynamicValueText = styled(Text, {
  padding: '$1 $2',
  fontFamily: 'monospace',
  fontSize: '$xxsmall',
  borderRadius: '$small',
  backgroundColor: '$accentBg',
  color: '$accentDefault',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  variants: {
    error: {
      true: {
        backgroundColor: '$dangerBg',
        color: '$dangerFg',
      },
    }
  }
});
const HandleHolder = styled(Box, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',

  variants: {
    collapsed: {
      true: {
        height: 0,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
      },
      false: {
        minHeight: '1em',
      },
    },
  },
});

export enum InputTypes {
  ANY = 'any',
  STRING = 'string',
  NUMBER = 'number',
  COLOR = 'color',
}

export const Handle = (props) => {
  const { children, error, full, inputType = InputTypes.ANY, ...rest } = props;
  const { position, type } = useHandle();
  const isConnected = useHasConnection();
  console.log("props are", children, error, full, rest, isConnected)
  const isValidConnection = useIsValidConnection();
  const { collapsed, hide } = useContext(HandleContainerContext);
  const { onConnect } = useNode();

  return (
    <HandleHolder collapsed={collapsed}>
      <StyledRawHandle
        error={error}
        left={type === 'target'}
        type={type}
        position={position}
        isConnected={isConnected}
        hide={hide}
        isValidConnection={(isValidConnection)}
        {...rest}
        onConnect={onConnect}
      />
      <Stack
        direction="row"
        gap={2}
        justify={full ? 'between' : type === 'target' ? 'start' : 'end'}
        align="center"
        css={{ flex: 1, paddingLeft: '$3', paddingRight: '$3' }}
        className="handleWrapper"
      >
        <HandleType type={inputType} />
        <Stack direction="row" gap={2} align="center" css={{flexGrow: 1}}>{children}</Stack>
      </Stack>
    </HandleHolder>
  );
};
