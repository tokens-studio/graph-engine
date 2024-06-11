import {
    AllSchemas,
    NodeTypes,
    STRING,
} from '@tokens-studio/graph-engine';
import {
    Button,
    Checkbox,
    Heading,
    Label,
    Scroll,
    Select,
    Stack,
    TextInput,
} from '@tokens-studio/ui';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { Node } from '@tokens-studio/graph-engine';

import { deletable } from '@/annotations';


export const DynamicInputs = observer(({ node }: { node: Node }) => {
    const [inputName, setInputName] = React.useState('');
    const [inputType, setInputType] = React.useState('-');
    const [enumerated, setEnumerated] = React.useState(false);
    const [enumeratedValues, setEnumeratedValues] = React.useState<string>('');

    const newInput = () => {
        //Find the schema
        const schema = AllSchemas.find((x) => x.$id === inputType);
        const type = {
            ...schema,
        };

        if (enumerated) {
            type.enum = enumeratedValues.split(',').map((x) => x.trim());
            type.default = type.enum[0];
        }

        const input = node.addInput(inputName, {
            type,
            visible: node.nodeType() !== NodeTypes.INPUT,
        });
        input.annotations[deletable] = true;
        //We trigger running the node to either propagate the new input or to update the node
        node.run();
    };

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputName(e.target.value);
    };

    const isDisabled = useMemo(() => {
        return (
            inputName === '' || inputType === '-' || Boolean(node.inputs[inputName])
        );
    }, [inputName, inputType, node.inputs]);

    const onClick = () => {
        newInput();
        //Reset the values
        setInputName('');
        setInputType('-');
        setEnumeratedValues('');
        setEnumerated(false);
    };

    return (
        <Stack direction="column" gap={4}>
            <Heading size="small">Add Input</Heading>
            <Stack direction="row" gap={3}>
                <TextInput
                    onChange={onNameChange}
                    placeholder={'Input name'}
                    value={inputName}
                />
            </Stack>
            <Select value={inputType} onValueChange={setInputType}>
                <Select.Trigger label="Type" value={inputType} />
                {/* @ts-expect-error */}
                <Select.Content css={{ maxHeight: '200px' }} position="popper">
                    <Scroll height="200">
                        {AllSchemas.map((x, i) => (
                            <Select.Item value={x.$id!} key={i}>
                                {x.title || x.$id}
                            </Select.Item>
                        ))}
                    </Scroll>
                </Select.Content>
            </Select>

            {inputType === STRING && (
                <Stack gap={3} align="center">
                    <Label>Enumerated?</Label>
                    <Checkbox
                        onCheckedChange={(v) => setEnumerated(Boolean(v))}
                        checked={enumerated}
                    />
                </Stack>
            )}

            {enumerated && (
                <Stack gap={3}>
                    <Label>Enumerated Values</Label>
                    <TextInput
                        value={enumeratedValues}
                        onChange={(e) => setEnumeratedValues(e.target.value)}
                        placeholder={'Comma separated values'}
                    />
                </Stack>
            )}

            <Stack justify="end">
                <Button variant="primary" disabled={isDisabled} onClick={onClick}>
                    Add Input
                </Button>
            </Stack>
        </Stack>
    );
}) as React.FC<{ node: Node }>;
