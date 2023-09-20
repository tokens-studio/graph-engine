import * as SliderPrimitive from '@radix-ui/react-slider';
import { styled } from '#/lib/stitches/index.ts';

const Root = styled(SliderPrimitive.Root, {
  position: 'relative',
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  minWidth: '100px',
  height: '1em',
});

const Track = styled(SliderPrimitive.Track, {
  backgroundColor: '$bgSubtle',

  position: 'relative',
  flexGrow: 1,
  borderRadius: '9999px',
  height: '3px',
});

const Range = styled(SliderPrimitive.Range, {
  position: 'absolute',
  backgroundColor: '$bgEmphasis',
  borderRadius: '9999px',
  height: '100%',
});

const Thumb = styled(SliderPrimitive.Thumb, {
  display: 'block',
  width: '20px',
  height: '20px',
  backgroundColor: '$fgDefault',
  boxShadow: '$focus',
  borderRadius: '10px',

  '&:focus': {
    outline: 'none',
    boxShadow: '$focus',
  },
});

export const SliderLabel = ({ children }) => {
  return <div>{children}</div>;
};

export const ValueLabel = styled('div', {
  '*:hover>&': {
    opacity: 1,
  },
  opacity: 0,
  position: 'absolute',
  top: '1.5em',
  left: '50%',
  transformOrigin: 'center',
  transform: 'translate(-50%)',
  padding: '0.25em',
  borderRadius: '$medium',
  color: '$bgSubtle',
  background: '$bgEmphasis',
  pointerEvents: 'none',
});

export const Slider = Object.assign(Root, {
  Thumb,
  Track,
  Range,
  ValueLabel,
});
