import { Label } from '@tokens-studio/ui';

export const LabelNoWrap = ({ children, ...rest }: typeof Label) => {
  return (
    <Label {...rest}>
      <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
    </Label>
  );
};
