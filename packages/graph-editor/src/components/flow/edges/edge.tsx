import {
  getBezierPath,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Position,
} from 'reactflow';
import { getBetterBezierPath } from "./offsetBezier.js";
import React from 'react';
import { useSelector } from 'react-redux';
import { edgeType as edgeTypeSelector } from '../../../redux/selectors/settings.js';
import { EdgeType } from '../../../redux/models/settings.js';
import { Plus } from 'iconoir-react';


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
  isConnecting = false,
}) {
  const edgeType = useSelector(edgeTypeSelector);

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
      {isConnecting && (
        <foreignObject
          width={20}
          height={20}
          x={targetX - 10}
          y={targetY - 10}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Plus style={{ color: 'var(--colors-fgDefault)' }} />
          </div>
        </foreignObject>
      )}
    </>
  );
}
