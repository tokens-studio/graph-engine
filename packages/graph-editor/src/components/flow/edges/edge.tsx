import { EdgeType } from '../../../redux/models/settings.js';
import { Port } from '@tokens-studio/graph-engine';
import { edgeType as edgeTypeSelector } from '../../../redux/selectors/settings.js';
import { getBetterBezierPath } from './offsetBezier.js';
import {
  getSimpleBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from 'reactflow';
import { useLocalGraph } from '@/context/graph.js';
import { useSelector } from 'react-redux';
import React from 'react';
import colors from '@/tokens/colors.js';

const extractColor = (port: Port) => {
  let id = port.type.$id || '';
  const isArray = Boolean(port.type.type == 'array');

  if (!id && isArray) {
    id = port.type.items.$id || '';
  }

  const color = colors[id]?.color || 'black';
  const backgroundColor = colors[id]?.backgroundColor || 'hsl(60, 80%, 60%)';

  return { color, backgroundColor };
};

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) {
  const edgeType = useSelector(edgeTypeSelector);
  const graph = useLocalGraph();

  const edge = graph.getEdge(id);
  let col = undefined;

  if (edge) {
    const sourceNode = graph.getNode(edge?.source);

    const sourcePort = sourceNode?.outputs[edge?.sourceHandle];

    if (sourcePort) {
      const { backgroundColor } = extractColor(sourcePort as Port);
      col = backgroundColor;
    }
  }

  let edgeFn;
  switch (edgeType) {
    case EdgeType.bezier:
      edgeFn = getBetterBezierPath;
      break;
    case EdgeType.simpleBezier:
      edgeFn = getSimpleBezierPath;
      break;
    case EdgeType.smoothStep:
      edgeFn = getSmoothStepPath;
      break;
    case EdgeType.straight:
      edgeFn = getStraightPath;
      break;
    default:
      edgeFn = getBetterBezierPath;
  }

  const [edgePath] = edgeFn({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{ ...style, stroke: col }}
        markerEnd={markerEnd}
      />
      <path
        d={edgePath}
        fill="none"
        strokeOpacity="0"
        strokeWidth="20"
        className="react-flow__edge-interaction"
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: 12 }}
          startOffset="50%"
          textAnchor="middle"
        >
          {data?.text}
        </textPath>
      </text>
    </>
  );
}
