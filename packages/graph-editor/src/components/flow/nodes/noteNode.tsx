import React, { useCallback } from 'react';
import { NodeProps, useReactFlow, useStoreApi } from 'reactflow';
import { Box, Stack, Text, Textarea } from '@tokens-studio/ui';
import { useDispatch } from '@/hooks';

function NoteNode(props: NodeProps) {
  const { id, data } = props;

  const flow = useReactFlow();
  const flowNode = flow.getNode(id);
  const [text, setText] = React.useState(flowNode?.data.text || '');
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch.graph.setCurrentNode('');
  }, [dispatch.graph]);

  const onChange = useCallback(
    (newString: string) => {
      flowNode!.data.text = newString;
      setText(newString);
    },
    [flowNode],
  );

  if (!flowNode) {
    return <Box>Node not found</Box>;
  }

  return (
    <Box onClick={onClick}>
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
            {data.title || 'Note'}
          </Text>
        </Stack>
      </Stack>
      <Box css={{ padding: '$3' }}>
        <Textarea
          onChange={onChange}
          value={text}
          placeholder="Write text here"
        />
      </Box>
    </Box>
  );
}

export default NoteNode;
