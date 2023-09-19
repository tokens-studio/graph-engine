import { Label } from '@tokens-studio/ui';
import React from 'react';

export interface ILabelNoWrap extends React.ComponentProps<typeof Label> {}

export const LabelNoWrap = ({ children, ...rest }: ILabelNoWrap) => {
  return (
    <Label {...rest}>
      <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
    </Label>
  );
};
