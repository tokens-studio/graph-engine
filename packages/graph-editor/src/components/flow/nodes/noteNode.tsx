import React, { useCallback } from 'react';
import { NodeProps, NodeResizer, useReactFlow, useStoreApi } from 'reactflow';
import { Box, Stack, Text, Textarea } from '@tokens-studio/ui';
import { useDispatch } from '@/hooks';
import { observer } from 'mobx-react-lite';
import { description, title } from '@/annotations';
import { Node } from '@tokens-studio/graph-engine';
import { useLocalGraph } from '@/context/graph';
import { Node as Wrapper } from '../wrapper/node'

const minWidth = 120;
function NoteNode(props: NodeProps) {
  const { id, } = props;
  const graph = useLocalGraph();
  const node = graph.getNode(id);

  if (!node) {
    return <Box>Node not found</Box>;
  }


  return <Note node={node} annotations={node.annotations} />;
}

interface IAnnotation {
  node: Node;
  annotations: Record<string, string>;
}

const Note = observer(({ node, annotations }: IAnnotation) => {

  const onChange = (str)=>{
    node.setAnnotation(description, str);

  }
  return <Wrapper id={node.id} title={annotations[title] as string || 'Note'}>
    <NodeResizer
      minWidth={minWidth}
      minHeight={minWidth}
    />
    <Box css={{
      padding: '$3', flex: 1,
      //Fix limitation with text area
      '>*': {
        height: '100%'
      }
    }}>

      <Textarea
        css={{
          height: '100%',
          width: '100%'
        }}
        onChange={onChange}
        placeholder='Add a description...'
        value={annotations[description]}
      >
      </Textarea>
    </Box>

  </Wrapper>




})

export default NoteNode;
