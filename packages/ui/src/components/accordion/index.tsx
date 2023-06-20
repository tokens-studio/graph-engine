import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { styled } from '#/lib/stitches/index.ts';

const Root = styled(AccordionPrimitive.Root, {
  userSelect: 'none',
  outline: 'none',
  color: '$fgDefault',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
});

const Trigger = styled(AccordionPrimitive.Trigger, {
  userSelect: 'none',
  outline: 'none',
  color: '$fgDefault',
  padding: '$3 $4',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',

  '&:hover': {
    background: '$bgSubtle',
  },

  '&:focus-visible': {
    boxShadow: '$focus',
  },

  "&[data-state='active']": {
    fontWeight: '$sansBold',
    borderColor: '$bgEmphasis',
    borderRadius: 0,
  },
});

const Content = styled(AccordionPrimitive.Content, {
  paddingLeft: '$5',
  paddingRight: '$2',
});

export const Accordion = Object.assign(Root, {
  Item: AccordionPrimitive.Item,
  Trigger,
  Content,
});
