import { NodeTypes } from '@tokens-studio/graph-engine';
import { styled } from '#/lib/stitches/index.ts';
import React, { useCallback } from 'react';
import { IconHolder } from '#/components/IconHolder';
import { DropdownMenuItem } from './Panel';

type DragItemProps = {
    data?: any;
    type: NodeTypes;
    children: React.ReactNode;
};

const Item = styled('div', {
    userSelect: 'none',
    cursor: 'pointer',
    borderRadius: '$medium',
    border: '1px solid',
    borderColor: 'transparent',
    padding: '$1 $3',
    width: '100%',
    '&:hover': {
        backgroundColor: '$bgSubtle',
    },
});


export const DragItem = ({ data, type, children }: DragItemProps) => {
    const onDragStart = useCallback(
        (event) => {
            event.dataTransfer.setData(
                'application/reactflow',
                JSON.stringify({
                    type,
                    data,
                }),
            );
            event.dataTransfer.effectAllowed = 'move';
        },
        [data, type],
    );

    return (
        <DropdownMenuItem onDragStart={onDragStart} draggable>
            {children}
        </DropdownMenuItem>
    );
};
