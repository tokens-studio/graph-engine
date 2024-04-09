import React, { useCallback } from 'react';
import { NodeProps, NodeResizer, useReactFlow, useStoreApi } from 'reactflow';
import { Box, Stack, Text, Textarea } from '@tokens-studio/ui';
import { useDispatch } from '@/hooks';
import { observer } from 'mobx-react-lite';
import { description, title } from '@/annotations';
import { useGraph } from '@/hooks/useGraph';
import { Node } from '@tokens-studio/graph-engine';

const minWidth = 120;
function NoteNode(props: NodeProps) {
  const { id, } = props;
  const graph = useGraph();
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

  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch.graph.setCurrentNode(node.id);
  }, [dispatch.graph, node.id]);


  return <div
    style={{
      height: '100%',
      width: '100%',
      position: 'relative',
    }}
  >
    <NodeResizer

      minWidth={minWidth}
      minHeight={minWidth}
    /><Stack direction='column' onClick={onClick} css={{ height: '100%' }}>
      <Stack
        direction="row"
        justify="between"
        align="center"
        css={{
          padding: '$3 $5',
          borderBottom:
            '2px solid var(--nodeBorderColor, var(--colors-borderSubtle))',
          backgroundColor: 'var(--nodeBgColor, var(--colors-bgSubtle))',
          borderRadius: '$medium',
        }}
      >
        <Stack direction="row" gap={2} align="center">
          <Text
            css={{
              fontSize: '$xxsmall',
              fontWeight: '$sansMedium',
              textTransform: 'uppercase',
              color: 'var(--nodeTextColor, var(--colors-fgSubtle))',
              letterSpacing: '0.15px',
            }}
          >
            {annotations[title] || 'Note'}
          </Text>
        </Stack>
      </Stack>
      <Box css={{ padding: '$3', flex: 1,
      //Fix limitation with text area
      '>*':{
        height: '100%'
      
      } }}>
        <Textarea
          css={{
            height: '100%',
            width: '100%'
          }}
          disabled
          placeholder='Add a description in the node settings'
          value={annotations[description]}
        >
        </Textarea>
      </Box>
    </Stack>
  </div>

})

export default NoteNode;
