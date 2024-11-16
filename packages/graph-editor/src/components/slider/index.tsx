import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import styles from './slider.module.css';

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ ...props }, ref) => (
  <SliderPrimitive.Root ref={ref} className={styles.root} {...props}>
    <SliderPrimitive.Track className={styles.track}>
      <SliderPrimitive.Range className={styles.range} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={styles.thumb} />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;
