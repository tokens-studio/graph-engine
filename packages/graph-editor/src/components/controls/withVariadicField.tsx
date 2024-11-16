import { DndItem, DndList, DndTrigger } from '../DndList.js';
import { GrabberIcon } from '../icons/index.js';
import { IField } from './interface.js';
import { Input } from '@tokens-studio/graph-engine';
import { arrayMoveImmutable } from 'array-move';
import { observer } from 'mobx-react-lite';
import { useGraph } from '@/hooks/index.js';
import React from 'react';
import styles from './withVariadicField.module.css';

export const withVariadicField = (WrappedComponent) => {
  return observer(({ port }: IField) => {
    const graph = useGraph();
    const input = port as unknown as Input;

    const onSortEnd = ({ oldIndex, newIndex }) => {
      const newValue = arrayMoveImmutable(input.value, oldIndex, newIndex);
      const newEdges = arrayMoveImmutable(port._edges, oldIndex, newIndex).map(
        (edge, i) => {
          edge.annotations['engine.index'] = i;
          return edge;
        },
      );
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
      <DndList
        lockAxis="y"
        onSortEnd={onSortEnd}
        className={styles.dndList}
      >
        {port._edges.map((edge, i) => (
          <DndItem
            key={`input-${i}`}
            index={i}
            className={styles.dndItem}
          >
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
