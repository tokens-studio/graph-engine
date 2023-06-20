import { Box } from '@tokens-studio/ui';

export function NodeDynamicHandle({
  text,
  align,
  error,
}: {
  text: string;
  align?: 'left' | 'right';
  error?: boolean;
}) {
  return (
    <Box
      css={{
        fontSize: '10px',
        fontFamily: 'monospace',
        backgroundColor: error ? '$dangerBg' : '$accentBg',
        color: error ? '$dangerFg' : '$accentEmphasis',
        display: 'inline-flex',
        borderRadius: 0,
        textTransform: 'uppercase',
        fontWeight: 400,
        marginLeft: align === 'left' ? '-$3' : 0,
        marginRight: align === 'right' ? '-$3' : 0,
      }}
    >
      {align === 'left' ? <Box css={{ paddingLeft: '$4' }} /> : null}
      <Box
        css={{
          padding: align === 'left' ? '$1 $3 $1 0' : '$1 0 $1 $3',
        }}
      >
        {text}
      </Box>
      {align === 'right' ? <Box css={{ paddingLeft: '$4' }} /> : null}
    </Box>
  );
}
