import {
  getBezierPath,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Position,
} from 'reactflow';
import React from 'react';
import { useSelector } from 'react-redux';
import { edgeType as edgeTypeSelector } from '../../../redux/selectors/settings.js';
import { EdgeType } from '../../../redux/models/settings.js';

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


  let arc = '';

  //Get the smaller of the two distances
  if (deltaY < deltaX) {
    const dist = deltaY;

    //Find the distance on either side
    const paddingX = (deltaX - dist) / 2;

    //Create the svg path
    arc = `M ${sourceX} ${sourceY} C ${sourceX + paddingX} ${sourceY} ${targetX - paddingX
      } ${targetY} ${targetX} ${targetY}`;
  } else {
    const dist = deltaX;

    //Find the distance on either side
    const paddingY = (deltaY - dist) / 2;

    //Create the svg path
    arc = `M ${sourceX} ${sourceY} C ${sourceX} ${sourceY + paddingY
      } ${targetX} ${targetY - paddingY} ${targetX} ${targetY}`;
  }


  return [
    arc,
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
