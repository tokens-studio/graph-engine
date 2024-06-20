import { observer } from 'mobx-react-lite';
import { JSONTree } from 'react-json-tree';
import React from 'react';
import { IField } from './interface';
import { toJS } from 'mobx';
import { Button, IconButton, Select, Stack, TextInput } from '@tokens-studio/ui';
import { Minus, Plus } from 'iconoir-react';
import { ColorPickerPopover } from '../colorPicker';
import { ANY, AllSchemas, COLOR, Input, NUMBER, STRING } from '@tokens-studio/graph-engine';
import { delayedUpdateSelector } from '@/redux/selectors';
import { useSelector } from 'react-redux';

const inputItemTypes = [STRING, NUMBER, COLOR];

export const ArrayField = observer(({ port }: IField) => {
    const [value, setValue] = React.useState(port.value);
    const [selectItemsType, setSelectItemsType] = React.useState(port.type.items.$id);

    const [autofocusIndex, setAutofocusIndex] = React.useState<number | null>(null);
    const useDelayed = useSelector(delayedUpdateSelector);

    React.useEffect(() => {
        setValue(port.value);
    }, [port.value]);

    React.useEffect(() => {
        if (autofocusIndex !== null) {
            setAutofocusIndex(null);
        }
    }, [autofocusIndex]);

    const portName = port.constructor.name;
    const itemsType = port.type.items.$id;

    const onColorChange =
        (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
            let newColor: string;
            // Weird  problem with the color picker if the user decides to use the text input
            if (typeof e === 'string') {
                newColor = e
            } else {
                newColor = e.target.value;
            }

            onChange(newColor, index);
        };

    const onChange = (newValue: any, index: number) => {
        const newValueArray = value.map((val: any, i: number) => {
            if (i === index) {
                return itemsType === NUMBER ? +newValue : newValue;
            }
            return val;
        });
        setValue(newValueArray);

        if (useDelayed) {
            return;
        }

        (port as Input).setValue(newValueArray);
    };

    const addItem = () => {
        const newValueArray = [...value];

        switch (itemsType) {
            case STRING:
                newValueArray.push('');
                break;
            case NUMBER:
                newValueArray.push(undefined);
                break;
            case COLOR:
                newValueArray.push('#000000');
                break;
            default:
                newValueArray.push('');
                break;
        }


        setValue(newValueArray);
        (port as Input).setValue(newValueArray);

        setAutofocusIndex(newValueArray.length - 1);
    };

    const removeItem = (index: number) => {
        const newValueArray = value.filter((val: any, i: number) => i !== index);

        setValue(newValueArray);
        (port as Input).setValue(newValueArray);

        setAutofocusIndex(null);
    }

    const setType = () => {
        const schema = AllSchemas.find((x) => x.$id === selectItemsType);
        if (!schema) {
            return;
        }

        const input = port as Input;
        input.setValue(value, {
            type: {
                type: "array",
                items: schema,
            },
        });
    }

    if (!port.isConnected && portName === 'Input' && itemsType === ANY && !(port as Input).variadic) {
        return (
            <Stack direction="column" gap={3}>
                <Select value={selectItemsType} onValueChange={setSelectItemsType}>
                    <Select.Trigger label="Type" value={selectItemsType} />
                    {/* @ts-expect-error */}
                    <Select.Content css={{ maxHeight: '200px' }} position="popper">
                        {AllSchemas.map((x, i) => (
                            <Select.Item value={x.$id!} key={i}>
                                {x.title || x.$id}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select>
                <Stack direction="row" justify="end">
                    <Button variant="primary" onClick={setType}>
                        Set type
                    </Button>
                </Stack>
            </Stack>
        );
    }

    if (!inputItemTypes.includes(itemsType) || port.isConnected || portName === 'Output' || (portName === 'Input' && (port as Input).variadic)) {
        return <JSONTree data={{ items: toJS(value) }} hideRoot shouldExpandNodeInitially={() => true} />;
    }

    const getItems = () => {
        return value.map((val: any, index: number) => {
            switch (itemsType) {
                case STRING:
                case NUMBER:
                    return (
                        <TextInput
                            autoFocus={autofocusIndex === index}
                            width={'100%'}
                            value={val}
                            onChange={(e) => { onChange(e.target.value, index) }}
                            trailingAction={<IconButton title="Remove item" size="small" variant="invisible" icon={<Minus />} onClick={() => removeItem(index)} />}
                        />
                    );
                case COLOR:
                    return (
                        <ColorPickerPopover
                            defaultOpen={autofocusIndex === index}
                            value={val}
                            onChange={(e) => { onColorChange(e, index) }}
                            showRemoveButton
                            onRemove={() => removeItem(index)}
                        />
                    );
                default:
                    return <JSONTree data={{ items: toJS(value) }} hideRoot shouldExpandNodeInitially={() => true} />;
            }
        });
    }

    const flexDirection = itemsType === COLOR ? 'row' : 'column';

    return (
        <Stack direction={flexDirection} gap={3} align='center' wrap css={{ background: '$bgCanvas', padding: '$3' }}>
            {getItems()}
            <IconButton title="Add item" icon={<Plus />} size="small" onClick={addItem} />
        </Stack>
    )
});
