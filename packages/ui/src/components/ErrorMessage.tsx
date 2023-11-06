import { styled } from '#/lib/stitches/index.ts';

export const ErrorMessage = styled('div', {
  backgroundColor: '$bgDanger',
  color: '$dangerFg',
  borderRadius: '$default',
  padding: '$4',
  fontSize: '$xs',
  fontWeight: '$bold',
});
