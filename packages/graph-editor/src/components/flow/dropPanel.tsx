import { Box, Separator, Stack, Text, TextInput } from '@tokens-studio/ui';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { styled } from '#/lib/stitches/index.ts';
import { useCallback } from 'react';
import React from 'react';

import preset from '#/data/preset.ts';
import tinyCore from '#/data/tiny/core.ts';
import tinyCoreDark from '#/data/tiny/dark.ts';
import tinyCoreLight from '#/data/tiny/light.ts';

import { Accordion } from '../accordion/index.tsx';
import {
  BlendingModeIcon,
  ButtonIcon,
  ColorWheelIcon,
  EyeNoneIcon,
  Half2Icon,
  ImageIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { flatten } from '#/utils/index.ts';
import icons from './icons.tsx';

//@ts-ignore
const presetFlattened = flatten(preset);
//@ts-ignore
const tinyCoreFlattened = flatten(tinyCore);
//@ts-ignore
const tinyCoreLightFlattened = flatten(tinyCoreLight);
//@ts-ignore
const tinyCoreDarkFlattened = flatten(tinyCoreDark);

const Panel = styled('div', {
  borderRight: '1px solid',
  backgroundColor: '$bgSurface',
  borderColor: '$borderMuted',
  marginBottom: '-5px',
  overflow: 'auto',
  padding: '0',
  display: 'flex',
  position: 'relative',
  height: '100%',
  flexShrink: '0',
  width: '200px',
});

type DragItemProps = {
  data?: any;
  type: NodeTypes;
  children: React.ReactNode;
};

const EntryGroup = ({ children }) => {
  return (
    <Stack direction="column" css={{ padding: 0 }} gap={1}>
      {children}
    </Stack>
  );
};

const DragItem = ({ data, type, children }: DragItemProps) => {
  const onDragStart = useCallback(
    (event) => {
      event.dataTransfer.setData(
        'application/reactflow',
        JSON.stringify({
          type,
          data,
        }),
      );
      event.dataTransfer.effectAllowed = 'move';
    },
    [data, type],
  );

  return (
    <Item onDragStart={onDragStart} draggable>
      {children}
    </Item>
  );
};

const StyledAccordingTrigger = styled(Accordion.Trigger, {
  display: 'flex',
  flexDirection: 'column',
  border: '4px solid $bgSurface',
  borderRadius: '$medium',
  alignItems: 'flex-start',
  width: '100%',
  fontWeight: '$sansBold',
  fontSize: '$xsmall',
  '&:not(:first-of-type)': {
    marginTop: '$6',
  },
});

const IconHolder = styled('div', {
  display: 'flex',
  width: '32px',
  height: '32px',
  fontSize: '$xxsmall',
  padding: '$3',
  borderRadius: '$medium',
  border: '1px solid $borderSubtle',
  userSelect: 'none',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
});

const Item = styled('div', {
  userSelect: 'none',
  cursor: 'pointer',
  borderRadius: '$medium',
  border: '1px solid',
  borderColor: 'transparent',
  padding: '0',
  '&:hover': {
    [`${IconHolder}`]: {
      borderColor: 'transparent',
    },
    backgroundColor: '$buttonSecondaryBgHover',
    borderColor: '$borderSubtle',
  },
});

const NodeEntry = ({
  icon,
  text,
}: {
  icon: React.ReactNode | string;
  text: string;
}) => {
  return (
    <Stack direction="row" gap={2} justify="start" align="center">
      <IconHolder>{icon}</IconHolder>
      <Text size="xsmall">{text}</Text>
    </Stack>
  );
};

const types = {
  generic: [
    {
      type: NodeTypes.INPUT,
      icon: icons[NodeTypes.INPUT],
      text: 'Input',
    },
    {
      type: NodeTypes.ENUMERATED_INPUT,
      icon: <ButtonIcon />,
      text: 'Enumerated Constant',
    },
    {
      type: NodeTypes.CSS_MAP,
      icon: './x',
      text: 'CSS Map',
    },
    {
      type: NodeTypes.OUTPUT,
      icon: <ButtonIcon />,
      text: 'Output',
    },
    {
      type: NodeTypes.SLIDER,
      icon: '--.',
      text: 'Slider',
    },
    {
      type: NodeTypes.CONSTANT,
      icon: <ButtonIcon />,
      text: 'Constant',
    },
    {
      type: NodeTypes.OBJECTIFY,
      icon: '{ }',
      text: 'Objectify',
    },
    {
      type: NodeTypes.SPREAD,
      icon: '...',
      text: 'Spread',
    },
    {
      type: NodeTypes.PASS_UNIT,
      icon: 'px',
      text: 'Pass Unit',
    },
    {
      type: NodeTypes.PARSE_UNIT,
      icon: '{}px',
      text: 'Parse Unit',
    },
    {
      type: NodeTypes.JSON,
      icon: '{/}',
      text: 'JSON',
    },
  ],
  tokens: [
    {
      type: NodeTypes.INLINE_SET,
      data: {
        tokens: tinyCoreFlattened,
      },
      icon: <PlusIcon />,
      text: 'Tiny Core',
    },
    {
      type: NodeTypes.INLINE_SET,
      data: {
        tokens: tinyCoreLightFlattened,
      },
      icon: <PlusIcon />,
      text: 'Tiny Light',
    },
    {
      type: NodeTypes.INLINE_SET,
      data: {
        tokens: tinyCoreDarkFlattened,
      },
      icon: <PlusIcon />,
      text: 'Tiny Dark',
    },
    {
      type: NodeTypes.INLINE_SET,
      data: {
        tokens: presetFlattened,
      },
      icon: <PlusIcon />,
      text: 'Preset Tokens',
    },
  ],
  math: [
    {
      type: NodeTypes.ADD,
      icon: '+',
      text: 'Add',
    },
    {
      type: NodeTypes.SUBTRACT,
      icon: '-',
      text: 'Subtract',
    },
    {
      type: NodeTypes.MULTIPLY,
      icon: 'x',
      text: 'Multiply',
    },
    {
      type: NodeTypes.DIV,
      icon: '/',
      text: 'Divide',
    },
    {
      type: NodeTypes.MOD,
      icon: '%',
      text: 'Modulo',
    },
    {
      type: NodeTypes.SIN,
      icon: 'sin',
      text: 'Sin',
    },
    {
      type: NodeTypes.COS,
      icon: 'cos',
      text: 'Cos',
    },
    {
      type: NodeTypes.TAN,
      icon: 'tan',
      text: 'Tan',
    },
    {
      type: NodeTypes.ABS,
      icon: '||',
      text: 'Absolute',
    },
    {
      type: NodeTypes.LERP,
      icon: 'lerp',
      text: 'Lerp',
    },
    {
      type: NodeTypes.CLAMP,
      icon: '{x}',
      text: 'Clamp',
    },
    {
      type: NodeTypes.ROUND,
      icon: '~',
      text: 'Round',
    },
    {
      type: NodeTypes.RANDOM,
      icon: '?',
      text: 'Random',
    },
    {
      type: NodeTypes.POW,
      icon: 'a^b',
      text: 'Power',
    },
  ],
  array: [
    {
      type: NodeTypes.DOT_PROP,
      icon: '[x,y]',
      text: 'Access Array',
    },
    {
      type: NodeTypes.ARRIFY,
      icon: '[]',
      text: 'Arrify',
    },
    {
      type: NodeTypes.COUNT,
      icon: '1,2',
      text: 'Count',
    },
    {
      type: NodeTypes.ARRAY_INDEX,
      icon: '[.]',
      text: 'Index Array',
    },
    {
      type: NodeTypes.REVERSE,
      icon: '[↔]',
      text: 'Reverse Array',
    },
    {
      type: NodeTypes.SLICE,
      icon: '[a,b]',
      text: 'Slice Array',
    },
    {
      type: NodeTypes.JOIN,
      icon: '[,]',
      text: 'Join Array',
    },
  ],
  sets: [
    {
      type: NodeTypes.INLINE_SET,
      data: {
        tokens: [],
      },
      text: 'Empty',
      icon: <PlusIcon />,
    },
    {
      type: NodeTypes.FLATTEN,
      icon: '> <',
      text: 'Flatten',
    },
    {
      type: NodeTypes.ALIAS,
      icon: '{..}',
      text: 'Resolve Alias',
    },
    {
      type: NodeTypes.REMAP,
      icon: 'x->y',
      text: 'Remap',
    },
    {
      type: NodeTypes.INVERT_SET,
      icon: '-+',
      text: 'Invert',
    },
  ],
  logic: [
    {
      type: NodeTypes.IF,
      icon: '?',
      text: 'If',
    },
    {
      type: NodeTypes.SWITCH,
      icon: '</>',
      text: 'Switch',
    },
    {
      type: NodeTypes.NOT,
      icon: '!x',
      text: 'Not',
    },
    {
      type: NodeTypes.AND,
      icon: 'a&b',
      text: 'And',
    },
    {
      type: NodeTypes.OR,
      icon: 'a|b',
      text: 'Or',
    },
    {
      type: NodeTypes.COMPARE,
      icon: 'a=b',
      text: 'Compare',
    },
  ],
  color: [
    {
      type: NodeTypes.CONTRASTING,
      icon: <Half2Icon />,
      text: 'Contrasting Color',
    },
    {
      type: NodeTypes.SCALE,
      icon: '...',
      text: 'Generate Scale',
    },
    {
      type: NodeTypes.CREATE_COLOR,
      icon: <ColorWheelIcon />,
      text: 'Create Color',
    },
    {
      type: NodeTypes.CONVERT_COLOR,
      icon: <ColorWheelIcon />,
      text: 'Convert Color',
    },
    {
      type: NodeTypes.BLEND,
      icon: <BlendingModeIcon />,
      text: 'Blend',
    },
    {
      type: NodeTypes.ADVANCED_BLEND,
      icon: <BlendingModeIcon />,
      text: 'Advanced Blend',
    },
    {
      type: NodeTypes.EXTRACT,
      icon: <ImageIcon />,
      text: 'Extract',
    },
    {
      type: NodeTypes.WHEEL,
      icon: <ColorWheelIcon />,
      text: 'Generate Color Wheel',
    },
  ],
  accessibility: [
    {
      type: NodeTypes.CONTRAST,
      icon: <Half2Icon />,
      text: 'Contast',
    },
    {
      type: NodeTypes.COLOR_BLINDNESS,
      icon: <EyeNoneIcon />,
      text: 'Color Blindness',
    },
  ],
  series: [
    {
      type: NodeTypes.ARITHMETIC_SERIES,
      icon: 'x+y',
      text: 'Arithmetic Series',
    },
    {
      type: NodeTypes.GEOMETRIC_SERIES,
      icon: 'x*y',
      text: 'Geometric Series',
    },
    {
      type: NodeTypes.HARMONIC_SERIES,
      icon: 'x^y',
      text: 'Harmonic Series',
    },
  ],
  string: [
    {
      type: NodeTypes.UPPERCASE,
      icon: 'uU',
      text: 'Uppercase',
    },
    {
      type: NodeTypes.LOWER,
      icon: 'Uu',
      text: 'Lowercase',
    },
    {
      type: NodeTypes.REGEX,
      icon: '^$',
      text: 'Regex',
    },
  ],
};

const DropPanel = () => {
  const [search, setSearch] = React.useState('');
  const [defaultValue, setDefaultValue] = React.useState<string | string[]>(
    'generic',
  );

  const [type, setType] = React.useState('multiple');

  const onSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value === '') {
      setType('single');
      setDefaultValue('generic');
    } else {
      setType('multiple');
      setDefaultValue(Object.keys(types));
    }
  };

  return (
    <Panel id="drop-panel">
      <Stack direction="column" gap={1} css={{ width: '100%' }}>
        <Box css={{ padding: '$4' }}>
          <TextInput placeholder="Search" value={search} onChange={onSearch} />
        </Box>
        <Accordion type={type} collapsible={false} defaultValue={defaultValue}>
          {Object.entries(types).map(([key, values]) => {
            const vals = values
              .filter((item) =>
                item.text.toLowerCase().includes(search.toLowerCase()),
              )
              .map((item) => (
                // @ts-ignore
                <DragItem type={item.type} data={item.data || null}>
                  <NodeEntry icon={item.icon} text={item.text} />
                </DragItem>
              ));

            if (vals.length === 0) return null;

            return (
              <Accordion.Item value={key}>
                <StyledAccordingTrigger>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <Separator orientation="horizontal" />
                </StyledAccordingTrigger>
                <Accordion.Content>
                  <EntryGroup>{vals}</EntryGroup>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Stack>
    </Panel>
  );
};

export default DropPanel;
