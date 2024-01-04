import { observer } from 'mobx-react-lite';
import { IField } from './interface';
import React from 'react';
import { Input } from '@tokens-studio/graph-engine';
import { Stack, Box, Accordion, Separator } from '@tokens-studio/ui';
import { PreviewColor } from '../tokenPreview/color.js';
import { TokenType } from '@/utils/index.ts';

const getPreview = (tokenData) => {
  switch (tokenData.type) {
    case TokenType.color:
      return <PreviewColor value={tokenData.value} />;
    default:
      return null;
  }
};

type PreviewProps = {
  token: any;
  hideName?: boolean;
};

export const PreviewToken = ({ token, hideName }: PreviewProps) => (
  <Stack direction="row" gap={3}>
    {getPreview(token)}
    {!hideName && (
      <Box
        css={{
          fontWeight: '$sansRegular',
          fontFamily: 'monospace',
          fontSize: '$xsmall',
          color: '$fgMuted',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
        title={token.name}
      >
        {token.name || 'No name'}
      </Box>
    )}
  </Stack>
);

export default PreviewToken;

const getToolTipData = (data) => {
  if (typeof data == 'object') {
    return JSON.stringify(data, null, 4);
  }

  return data.value;
};

const getTypographyValue = (data) => {
  if (typeof data.value == 'string') {
    return data.value;
  }
  return `<Complex Typography>`;
};

const getNodeValue = (data) => {
  switch (data.type) {
    case 'typography':
      return getTypographyValue(data);
    case 'composition':
      return 'Composition';
    case 'border':
      return 'Border';
    case 'boxShadow':
      return 'Shadow';
    default:
      return data.value;
  }
};

export const TokenArrayField = observer(({ port, readOnly }: IField) => {
  const onChangeX = (e: React.ChangeEvent<HTMLInputElement>) => {
    (port as Input).setValue([e.target.value, port.value[1]]);
  };

  const onChangeY = (e: React.ChangeEvent<HTMLInputElement>) => {
    (port as Input).setValue([port.value[0], e.target.value]);
  };

  return (
    <Stack gap={4} direction="column" align="center">
      <Accordion type="multiple" defaultValue={[]}>
        <Accordion.Item value="tokens">
          <Accordion.Trigger>Tokens</Accordion.Trigger>
          <Separator orientation="horizontal" />
          <Accordion.Content>
            <Stack
              gap={4}
              direction="column"
              align="center"
              css={{ padding: '$3' }}
            >
              {(port.value || []).map((token) => (
                <Stack
                  direction="row"
                  css={{ width: '100%' }}
                  key={token.name}
                  align="center"
                >
                  <Box
                    css={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexGrow: 1,
                      alignItems: 'center',
                      gap: '$2',
                      overflow: 'hidden',
                      width: '100%',
                      paddingLeft: '$3',
                    }}
                  >
                    <PreviewToken token={token} />
                  </Box>
                  <Box
                    title={getToolTipData(token)}
                    css={{
                      fontFamily: 'monospace',
                      fontSize: '$xsmall',
                      color: '$fgSubtle',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      maxWidth: '200px',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {getNodeValue(token)}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
});
