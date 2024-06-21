import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { styled } from '@/lib/stitches/index.js';

const Track = styled(SliderPrimitive.Track, {
  backgroundColor: '$borderDefault',
  position: 'relative',
  flexGrow: 1,
  borderRadius: '9999px',
  height: '3px',
});

const Root = styled(SliderPrimitive.Root, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  width: '100%',
  height: '20px',
});

const Thumb = styled(SliderPrimitive.Thumb, {
  display: 'block',
  width: '20px',
  height: '20px',
  backgroundColor: 'white',
  boxShadow: '0 2px 10px black',
  cursor: 'pointer',
  borderRadius: '10px',
  ':hover': {
    backgroundColor: 'black',
    boxShadow: '0 2px 10px black',
  },
});

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ ...props }, ref) => (
  <Root ref={ref} {...props}>
    <Track>
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </Track>
    <Thumb />
  </Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;
