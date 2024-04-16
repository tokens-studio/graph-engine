import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { IField } from './interface';
import { Stack, Text, TextInput } from '@tokens-studio/ui';
import { Input } from '@tokens-studio/graph-engine';
import { Slider } from '../slider';

export const SliderField = observer(({ port, readOnly }: IField) => {

    const min = port.type.minimum || 0;
    const max = port.type.maximum || 1;
    const step = port.type.multipleOf || (max - min) / 100;


    const onChange = useCallback(
        (value: number[]) => {
            if (!readOnly) {
                (port as Input).setValue(value[0]);
            }
        },
        [port, readOnly],
    );

    return (
        <Stack direction='row' gap={2}>
            <Slider
                value={[port.value]}
                min={min}
                max={max}
                step={step}
                onValueChange={onChange}
            />
            <Text>{port.value}</Text>
        </Stack>

    );
});
