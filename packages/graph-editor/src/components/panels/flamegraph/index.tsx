import { useGraph } from '@/hooks/useGraph';
import { Box, Button, Text } from '@tokens-studio/ui';
import React, { useCallback, useState } from 'react';
import { FlameGraph as FlameGraphPrimitive } from 'react-flame-graph';
import { convertToFlameGraph } from './utils';

export type FlameNode = {
  name: string;
  backgroundColor: string;
  color: string;
  value: number;
  children?: FlameNode[];
  tooltip?: undefined;
};

export const FlameGraph = () => {
  const graph = useGraph();
  const [lastExecution, setLastExecution] = useState(-1);
  const [totalTime, setTotalTime] = useState(0);
  const [data, setData] = useState({
    name: 'root',
    value: 1,
    children: [],
  });

  const getData = useCallback(async () => {
    if (!graph) {
      return
    }

    const res = await graph.execute({ stats: true });
    const calculated = convertToFlameGraph(graph, res);
    setData(calculated);
    setTotalTime(res.end - res.start);
    setLastExecution(Date.now());
  }, [graph]);

  return (
    <Box>
      <Text>
        Last executed Flamegraph:{' '}
        {lastExecution == -1
          ? 'never'
          : new Date(lastExecution).toLocaleTimeString()}
      </Text>
      <Text>Total Time : {totalTime}ms</Text>
      <Button onClick={getData}>Update</Button>
      <FlameGraphPrimitive data={data} height={200} width={400} />
    </Box>
  );
};
