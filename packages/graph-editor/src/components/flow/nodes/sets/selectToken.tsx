import { Stack, Text, TextInput } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/set/selectToken.js';
import React, { useCallback } from 'react';
import { PreviewAny } from '../../preview/any.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';

const SelectObjectPropertyNode = () => {
    const { input, state, setState, output } = useNode();

    const setValue = useCallback((ev) => {
        const value = ev.target.value;
        const key = ev.currentTarget.dataset.key;
        setState((state) => ({
            ...state,
            [key]: value,
        }));
    }, []);

    return (
        <Stack direction="row" gap={4}>
            <HandleContainer type="target">
                <Handle id="object">
                    <Text>Object</Text>
                </Handle>
                <Handle id="key">
                    <Text>Key</Text>
                    {input.key !== undefined ? (
                        <PreviewAny value={input.key} />
                    ) : (
                        <TextInput onChange={setValue} value={state.key} data-key="key" />
                    )}
                </Handle>
            </HandleContainer>
            <HandleContainer type="source">
                <Handle id="output">
                    <Text>Output</Text>
                    <PreviewAny value={output?.output} />
                </Handle>
            </HandleContainer>
        </Stack>
    );
};

export default WrapNode(SelectObjectPropertyNode, {
    ...node,
    title: 'Select Object Property',
});
