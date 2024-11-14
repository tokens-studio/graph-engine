import { BaseNodeWrapper } from '../wrapper/base.js';
import { EditPencil } from 'iconoir-react';
import { IconButton, Textarea } from '@tokens-studio/ui';
import { Node } from '@tokens-studio/graph-engine';
import { NodeProps, NodeResizer } from 'reactflow';
import { description, title } from '@/annotations/index.js';
import { observer } from 'mobx-react-lite';
import { useLocalGraph } from '@/context/graph.js';
import Markdown from 'react-markdown';
import React from 'react';
import styles from './noteNode.module.css';

const minWidth = 120;

export function NoteNode(props: NodeProps) {
  const { id } = props;
  const graph = useLocalGraph();
  const node = graph.getNode(id);

  if (!node) {
    return <div>Node not found</div>;
  }

  return <Note node={node} annotations={node.annotations} />;
}

interface IAnnotation {
  node: Node;
  annotations: Record<string, unknown>;
}

const Note = observer(({ node, annotations }: IAnnotation) => {
  const [editing, setEditing] = React.useState(false);

  const onChange = (str) => {
    node.setAnnotation(description, str);
  };

  return (
    <BaseNodeWrapper
      id={node.id}
      title={(annotations[title] as string) || 'Note'}
      controls={
        <IconButton
          size="small"
          emphasis="low"
          icon={<EditPencil />}
          onClick={() => setEditing(!editing)}
        />
      }
    >
      <NodeResizer minWidth={minWidth} minHeight={minWidth} />

      <div className={styles.container}>
        {!editing && (
          <Markdown>{(annotations[description] as string) || ''}</Markdown>
        )}
        {editing && (
          <div className={styles.textareaWrapper}>
            <Textarea
              className={styles.textarea}
              onChange={onChange}
              placeholder="Add a description..."
              value={annotations[description] as string}
            />
          </div>
        )}
      </div>
    </BaseNodeWrapper>
  );
});

export default NoteNode;
