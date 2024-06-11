import { observer } from 'mobx-react-lite';
import { IField } from '@tokens-studio/graph-editor';
import React from 'react';
import { Stack, Accordion, Separator, Button } from '@tokens-studio/ui';
import { Token } from './token.js';
import { flatTokensRestoreToMap } from '../../utils/index.js';

export const TokenArrayField = observer(({ port, readOnly }: IField) => {

    const downloadTokens = () => {
        const element = document.createElement('a');
        const asObj = flatTokensRestoreToMap(port.value);
        const file = new Blob([JSON.stringify(asObj)], {
            type: 'application/json',
        });
        element.href = URL.createObjectURL(file);
        element.download = 'tokens.json';
        document.body.appendChild(element);
        element.click();
    }

    return (
        <Stack gap={4} direction="column" align="center">
            <Accordion type="multiple" defaultValue={['tokens']} >
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
