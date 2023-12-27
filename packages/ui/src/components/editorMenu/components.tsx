import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { styled } from '@/lib/stitches/index.ts';

export const Root = styled(MenubarPrimitive.Root, {
  display: 'flex',
  gap: '$1',
  fontSize: '$small',
  alignItems: 'center',
  padding: '$2',
});

export const Trigger = styled(MenubarPrimitive.Trigger, {
  padding: '$2 $3',
  outline: 'none',
  border: '0',
  cursor: 'pointer',
  userSelect: 'none',
  borderRadius: '$small',
  color: '$fgDefault',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  "&[data-highlighted],&[data-state='open']": {
    backgroundColor: '$bgCanvas',
  },
});

export const SubTrigger = styled(MenubarPrimitive.SubTrigger, {
  padding: '$2 $3',
  outline: 'none',
  border: '0',
  userSelect: 'none',
  borderRadius: '$small',
  color: '$fgDefault',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  "&[data-highlighted],&[data-state='open']": {
    backgroundColor: '$bgCanvas',
  },
});

export const Content = styled(MenubarPrimitive.Content, {
  minWidth: '220px',
  backgroundColor: '$bgSubtle',
  borderRadius: '$small',
  padding: '$3',
  boxShadow: '$contextMenu',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
});

export const SubContent = styled(MenubarPrimitive.SubContent, {
  minWidth: '220px',
  backgroundColor: '$bgSubtle',
  borderRadius: '$small',
  padding: '$3',
  boxShadow: '$contextMenu',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
});

export const Item = styled(MenubarPrimitive.Item, {
  display: 'flex',
  borderRadius: '$small',
  alignItems: 'center',
  padding: '0 $3',
  cursor: 'pointer',
  '&[data-disabled]': {
    cursor: 'not-allowed',
    color: '$borderMuted',
  },
  "&[data-state='open'],&[data-highlighted]": {
    backgroundColor: '$bgCanvas',
    color: '$fgSubtle',
  },
});

export const LeftSlot = styled('div', {
  paddingRight: '$4',
});

export const RightSlot = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  paddingLeft: '$4',
});

export const Seperator = styled(MenubarPrimitive.Separator, {
  height: '1px',
  backgroundColor: '$borderMuted',
  margin: '$2',
});
