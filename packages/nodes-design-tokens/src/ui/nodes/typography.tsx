import { Box, Text, Stack } from '@tokens-studio/ui';
import React from 'react';
import { observer } from "mobx-react-lite";
import type PreviewNode from '../../nodes/previewTypography.js';

export const Typography = ({ value, text }) => {

    return (
        <Stack direction='column' gap={2} css={{ padding: '$3' }}>
            {value.filter(token => token?.type == 'typography').map((token, index) => {
                const value = token.value;
                console.log(value);
                return (

                    <Stack direction='row' gap={3} key={index} align='center'>
                        <Text css={{ fontStyle: 'italic' }}>{value.fontSize}</Text>
                        <span title={token.name}>
                            <Text css={{
                                fontFamily: value.fontFamily,
                                fontSize: value.fontSize,
                                fontWeight: value.fontWeight,
                                lineHeight: value.lineHeight,
                                letterSpacing: value.letterSpacing,
                            }}>
                               {text}
                            </Text>
                        </span>

                    </Stack >
                );
            })}
        </Stack>
    );
};



export const TypographyPreview = observer(({ node }: { node: PreviewNode }) => {
    return <Typography text={node.inputs.text.value} value={node.inputs.value.value} />;
});

export default TypographyPreview;

