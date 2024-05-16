import { Box, Text, Stack } from '@tokens-studio/ui';
import React from 'react';
import { observer } from "mobx-react-lite";
import type PreviewNode from '../../nodes/previewTypography.js';

export const Typography = ({ value, text }) => {

    return (
        <Stack direction='column' gap={2} css={{ padding: '$3' }}>
            {value.map((token, index) => {
                const value = token.value;
                let css = {};

                console.log(value)
                switch (token.type) {
                    case 'typography':
                        css = {
                            fontFamily: value.fontFamily,
                            fontSize: value.fontSize,
                            fontWeight: value.fontWeight,
                            lineHeight: value.lineHeight,
                            letterSpacing: value.letterSpacing,
                        }
                    case 'fontSizes':
                        css = {
                            fontSize: value,
                        }
                        break;
                    case 'fontWeights':
                        css = {
                            fontWeight: value,
                        }
                        break;
                    case 'lineHeights':
                        css = {
                            lineHeight: value,
                        }
                        break;
                    case 'letterSpacings':
                        css = {
                            letterSpacing: value,
                        }
                        break;
                    case 'fontFamilies':
                        css = {
                            fontFamily: value,
                        }
                        break;
                    default:
                        return null;
                }




                return (

                    <Stack direction='row' gap={3} key={index} align='center'>
                        <Text css={{ fontStyle: 'italic' }}>{token.name}</Text>
                        <span title={JSON.stringify(token,null,4) }>
                            <Text css={css}>
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

