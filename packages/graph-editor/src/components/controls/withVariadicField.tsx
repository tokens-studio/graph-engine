import { observer } from 'mobx-react-lite';
import React from 'react';
import { DndItem, DndList, DndTrigger } from '../DndList';
import { arrayMoveImmutable } from 'array-move';
import { useGraph } from '@/hooks';
import { GrabberIcon } from '../icons';
import { IField } from './interface';
import { Input } from '@tokens-studio/graph-engine';

export const withVariadicField = (WrappedComponent) => {
  return observer(({ port }: IField) => {
    const graph = useGraph();
    const input = port as unknown as Input;

    const onSortEnd = ({ oldIndex, newIndex }) => {
      const newValue = arrayMoveImmutable(input.value, oldIndex, newIndex);
      const newEdges = arrayMoveImmutable(port._edges, oldIndex, newIndex).map((edge, i) => {
        edge.annotations['engine.index'] = i;
        return edge;
      });
      // update edges property
      port._edges = newEdges;
      // update the value array
      input.setValue(newValue);
      // update the edges
      newEdges.forEach((edge) => {
        graph?.emit('edgeIndexUpdated', edge);
      });
    };

    return (
      <DndList lockAxis='y' onSortEnd={onSortEnd} css={{ display: 'flex', flexDirection: 'column', gap: '$3' }}>
        {port._edges.map((edge, i) => (
          <DndItem key={`input-${i}`} index={i} css={{ display: 'flex', gap: '$2', alignItems: 'center' }}>
            <DndTrigger>
              <GrabberIcon />
            </DndTrigger>
            <WrappedComponent port={port} edge={edge} index={i} />
          </DndItem>
        ))}
      </DndList>
    );
  });
};

export default withVariadicField;
