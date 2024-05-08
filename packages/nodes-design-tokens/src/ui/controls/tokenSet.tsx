import { observer } from 'mobx-react-lite';
import { IField } from '@tokens-studio/graph-editor';
import React from 'react';
import { Input } from '@tokens-studio/graph-engine';
import { Stack, Box, Accordion, Separator, Button } from '@tokens-studio/ui';
import { PreviewColor } from './preview/color.js';
import { TokenTypes } from '@tokens-studio/types';
import { Token } from './token.js';

export const TokenArrayField = observer(({ port, readOnly }: IField) => {

    const downloadTokens = () => {
        const element = document.createElement('a');
        const file = new Blob([JSON.stringify(port.value)], {
            type: 'application/json',
        });
        element.href = URL.createObjectURL(file);
        element.download = 'tokens.json';
        document.body.appendChild(element);
        element.click();
    }

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
                                <Token token={token} key={token.name} />
                            ))}
                        </Stack>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>

            <Button onClick={downloadTokens}>Download</Button>
        </Stack>
    );
});
