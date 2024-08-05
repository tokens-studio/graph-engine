import * as React from 'react';
import {
  ConstraintFunction,
  Coordinates,
  Line,
  Mafs,
  MovablePoint,
  Plot,
  Text,
  Theme,
  vec,
} from 'mafs';
import { FloatCurve, Vec2 } from '@tokens-studio/graph-engine';

function xyFromBernsteinPolynomial(
  p1: vec.Vector2,
  c1: vec.Vector2,
  c2: vec.Vector2,
  p2: vec.Vector2,
  x: number,
) {
  const t = (x - p1[0]) / (p2[0] - p1[0]);

  return [
    x,
    (1 - t) ** 3 * p1[1] +
      3 * (1 - t) ** 2 * t * c1[1] +
      3 * (1 - t) * t ** 2 * c2[1] +
      t ** 3 * p2[1],
  ];
}

function inPairs<T>(arr: T[]) {
  const pairs: [T, T][] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    pairs.push([arr[i], arr[i + 1]]);
  }

  return pairs;
}

const round = (n: number, precision: number = 2) =>
  Math.round(n * 10 ** precision) / 10 ** precision;

const defaultConstraintPoint: ConstraintFunction = ([x, y]) => {
  return [Math.min(Math.max(x, 0), 1), y];
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const startConstraint: ConstraintFunction = ([_, y]) => {
  return [0, Math.min(Math.max(y, 0), 1)];
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const endConstraint: ConstraintFunction = ([_, y]) => {
  return [1, Math.min(Math.max(y, 0), 1)];
};

export interface ICurveEditor {
  domain?: [number, number];
  range?: [number, number];
  onChange?: (FloatCurve) => void;
  curve: FloatCurve;
}

const noop = () => {};

const x = (vec: vec.Vector2) => vec[0];
const y = (vec: vec.Vector2) => vec[1];

function CubicSegment({ p1, p2, controls, onChange, index }) {
  const [c1, c2] = controls;

  const constraint: ConstraintFunction = React.useCallback(
    ([x, y]) => {
      return [Math.min(Math.max(x, p1[0]), p2[0]), y];
    },
    [p1, p2],
  );

  return (
    <>
      <Line.Segment
        point1={p1}
        point2={c1}
        opacity={0.5}
        color={Theme.yellow}
      />
      <Line.Segment point1={c2} point2={p2} opacity={0.5} color={Theme.pink} />
      <Text color={Theme.yellow} size={8} x={x(c1)} y={y(c1) + 0.1}>
        {round(x(c1))} {round(y(c1))}
      </Text>

      <Text color={Theme.pink} size={8} x={x(c2)} y={y(c2) + 0.1}>
        {round(x(c2))} {round(y(c2))}
      </Text>
      <Plot.Parametric
        //This is the x domain of the segment
        t={[p1[0], p2[0]]}
        weight={3}
        // @ts-ignore
        xy={(t) => xyFromBernsteinPolynomial(p1, c1, c2, p2, t)}
      />
      {controls.map((point, i) => (
        <MovablePoint
          key={i}
          point={point}
          constrain={constraint}
          color={i == 0 ? Theme.yellow : Theme.pink}
          onMove={(newPoint) => {
            const newPoints = [...controls];
            newPoints[i] = newPoint;
            onChange(newPoints, index);
          }}
        />
      ))}
    </>
  );
}

const getConstraint = (index, length): ConstraintFunction => {
  if (index == 0) {
    return startConstraint;
  }
  if (index == length - 1) {
    return endConstraint;
  }
  return defaultConstraintPoint;
};

export function FloatCurveEditor(props: ICurveEditor) {
  const { domain = [0, 1], range = [0, 1], curve, onChange = noop } = props;

  const onDblClick = React.useCallback(
    (point, e: MouseEvent) => {
      //Check the detail to make sure it was a double click
      if (e.detail === 2) {
        //Find the segment where the x value lines between the two x values

        const startIndex = curve.segments.findIndex((segment, i) => {
          const nextSegment = curve.segments[i + 1];
          return segment[0] <= point[0] && point[0] <= nextSegment[0];
        });
        const newIndex = startIndex + 1;

        //Now create a new point in between
        const newSegments = [
          ...curve.segments.slice(0, newIndex),
          point,
          ...curve.segments.slice(newIndex),
        ];

        //We are going to replace the control points at the clicked point
        const existingControls = curve.controlPoints[startIndex];

        //The existing one is going to now be split

        //Create the new curve point values lets make them half the distance between the two points
        const cp1 = [
          point[0] - (point[0] + curve.segments[startIndex][0]) / 4,
          (point[1] + curve.segments[startIndex][1]) / 2,
        ];
        const cp2 = [
          point[0] + (point[0] + curve.segments[startIndex + 1][0]) / 4,
          (point[1] + curve.segments[startIndex + 1][1]) / 2,
        ];

        const left = [existingControls[0], cp1];
        const right = [cp2, existingControls[1]];

        // We also need to create new control points
        const controlPoints = [
          ...curve.controlPoints.slice(0, startIndex),
          left,
          right,
          ...curve.controlPoints.slice(startIndex + 1),
        ] as [Vec2, Vec2][];
        //We need to emit a new curve
        onChange({
          segments: newSegments,
          controlPoints,
        });
      }
    },
    [curve.controlPoints, curve.segments, onChange],
  );

  const onControlChange = React.useCallback(
    (controls, index) => {
      const controlPoints = [...curve.controlPoints];
      controlPoints[index] = controls;
      onChange({
        ...curve,
        controlPoints,
      });
    },
    [curve, onChange],
  );

  const length = curve.segments.length;
  return (
    <>
      <Mafs
        zoom={{ min: 0.1, max: 2 }}
        viewBox={{ x: domain, y: range, padding: 0 }}
        width={'auto'}
        onClick={onDblClick}
        height={250}
        preserveAspectRatio={false}
      >
        <Coordinates.Cartesian
          xAxis={{ axis: true, subdivisions: 10 }}
          yAxis={{ axis: true, subdivisions: 10 }}
        />
        {/* Draw the segments  */}
        {inPairs(curve.segments).map(([p1, p2], i) => (
          <CubicSegment
            key={i}
            index={i}
            p1={p1}
            p2={p2}
            controls={curve.controlPoints[i]}
            onChange={onControlChange}
          />
        ))}
        {curve.segments.map((point, i) => (
          <React.Fragment key={i}>
            {' '}
            <MovablePoint
              point={point}
              color={Theme.blue}
              constrain={getConstraint(i, length)}
              onMove={(newPoint) => {
                //Create a new array with the new point
                const newSegments = [...curve.segments];
                newSegments[i] = newPoint;
                onChange({
                  segments: newSegments.sort((a, b) => a[0] - b[0]),
                  controlPoints: curve.controlPoints,
                });
              }}
            />
            <Text color={Theme.blue} size={10} x={x(point)} y={y(point) + 0.1}>
              {round(x(point))} {round(y(point))}
            </Text>
          </React.Fragment>
        ))}
      </Mafs>
    </>
  );
}
