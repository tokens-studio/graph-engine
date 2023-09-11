import {
  getBezierPath,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Position,
} from 'reactflow';
import React from 'react';
import { useSelector } from 'react-redux';
import { edgeType as edgeTypeSelector } from '../../../redux/selectors/settings.ts';
import { EdgeType } from '../../../redux/models/settings.ts';

interface IArticulatedPath {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  curvature?: number;
}

type IPathOutput = [
  path: string,
  labelX: number,
  labelY: number,
  offsetX: number,
  offsetY: number,
];

const getArticulatedPath = (opts: IArticulatedPath): [IPathOutput] => {
  const { sourceX, sourceY, targetX, targetY } = opts;

  //Minimum percentage between the two points dedicated to horizontal movement;

  const deltaX = targetX - sourceX;
  const deltaY = targetY - sourceY;
  const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normX = deltaX / dist;
  const normY = deltaY / dist;

  const sourcePadding = 0;
  const targetPadding = 0;

  let arc = '';

  //Get the smaller of the two distances
  if (deltaY < deltaX) {
    const dist = deltaY;

    //Find the distance on either side
    const paddingX = (deltaX - dist) / 2;

    //Create the svg path
    arc = `M ${sourceX} ${sourceY} C ${sourceX + paddingX} ${sourceY} ${
      targetX - paddingX
    } ${targetY} ${targetX} ${targetY}`;
  } else {
    const dist = deltaX;

    //Find the distance on either side
    const paddingY = (deltaY - dist) / 2;

    //Create the svg path
    arc = `M ${sourceX} ${sourceY} C ${sourceX} ${
      sourceY + paddingY
    } ${targetX} ${targetY - paddingY} ${targetX} ${targetY}`;
  }

  const sourceX2 = sourceX + (sourcePadding + 0) * normX;
  const sourceY2 = sourceY + (sourcePadding + 0) * normY;
  const targetX2 = targetX - (targetPadding + 0) * normX;
  const targetY2 = targetY - (targetPadding + 0) * normY;

  const sourceX3 = sourceX + (sourcePadding + 0) * normX;
  const sourceY3 = sourceY + (sourcePadding + 0) * normY;
  const targetX3 = targetX - (targetPadding + 0) * normX;
  const targetY3 = targetY - (targetPadding + 0) * normY;

  const sourceX4 = sourceX + (sourcePadding + 0) * normX;
  const sourceY4 = sourceY + (sourcePadding + 0) * normY;
  const targetX4 = targetX - (targetPadding + 0) * normX;
  const targetY4 = targetY - (targetPadding + 0) * normY;

  const sourceX5 = sourceX + (sourcePadding + 0) * normX;
  const sourceY5 = sourceY + (sourcePadding + 0) * normY;
  const targetX5 = targetX - (targetPadding + 0) * normX;
  const targetY5 = targetY - (targetPadding + 0) * normY;

  const sourceX6 = sourceX + (sourcePadding + 0) * normX;
  const sourceY6 = sourceY + (sourcePadding + 0) * normY;
  const targetX6 = targetX - (targetPadding + 0) * normX;

  const targetY6 = targetY - (targetPadding + 0) * normY;

  const sourceX7 = sourceX + (sourcePadding + 0) * normX;
  const sourceY7 = sourceY + (sourcePadding + 0) * normY;
  const targetX7 = targetX - (targetPadding + 0) * normX;
  const targetY7 = targetY - (targetPadding + 0) * normY;

  const sourceX8 = sourceX + (sourcePadding + 0) * normX;
  const sourceY8 = sourceY + (sourcePadding + 0) * normY;
  const targetX8 = targetX - (targetPadding + 0) * normX;
  const targetY8 = targetY - (targetPadding + 0) * normY;

  return [
    arc,
    // `M ${sourceX} ${sourceY} C ${sourceX2} ${sourceY2} ${targetX2} ${targetY2} ${targetX} ${targetY} C ${targetX3} ${targetY3} ${sourceX3} ${sourceY3} ${sourceX} ${sourceY} C ${sourceX4} ${sourceY4} ${targetX4} ${targetY4} ${targetX} ${targetY} C ${targetX5} ${targetY5} ${sourceX5} ${sourceY5} ${sourceX} ${sourceY} C ${sourceX6} ${sourceY6} ${targetX6} ${targetY6} ${targetX} ${targetY} C ${targetX7} ${targetY7} ${sourceX7} ${sourceY7} ${sourceX} ${sourceY} C ${sourceX8} ${sourceY8} ${targetX8} ${targetY8} ${targetX} ${targetY}`,
    targetX,
    targetY,
    0,
    0,
  ];
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

  let edgeFn;
  switch (edgeType) {
    case EdgeType.bezier:
      edgeFn = getBezierPath;
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
      edgeFn = getArticulatedPath;
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
        style={style}
        markerEnd={markerEnd}
      />
      <path
        d={edgePath}
        fill="none"
        stroke-opacity="0"
        stroke-width="20"
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
