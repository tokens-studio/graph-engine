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

/**
 * Given the four control points, calculate
 * the xy position of the bezier curve at value t.
 * See https://youtu.be/aVwxzDHniEw?t=265
 */
function xyFromBernsteinPolynomial(
  p1: vec.Vector2,
  c1: vec.Vector2,
  c2: vec.Vector2,
  p2: vec.Vector2,
  t: number,
) {
  return [
    vec.scale(p1, -(t ** 3) + 3 * t ** 2 - 3 * t + 1),
    vec.scale(c1, 3 * t ** 3 - 6 * t ** 2 + 3 * t),
    vec.scale(c2, -3 * t ** 3 + 3 * t ** 2),
    vec.scale(p2, t ** 3),
  ].reduce(vec.add, [0, 0]);
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

const defaultConstraintPoint = ([x, y]) => {
  return [Math.min(Math.max(x, 0), 1), Math.min(Math.max(y, 0), 1)];
};

export interface ICurveEditor {
  domain?: [number, number];
  range?: [number, number];
  onChange?: (index: number, vector: vec.Vector2) => void;
  points: vec.Vector2[];
}

const x = (vec: vec.Vector2) => vec[0];
const y = (vec: vec.Vector2) => vec[1];

export function CurveEditor(props: ICurveEditor) {
  const { domain = [0, 1], range = [0, 1], points, onChange } = props;

  const opacity = 0.25;

  // const p1 = useMovablePoint([0, 0], {
  //   constrain: defaultConstraintPoint as ConstraintFunction,
  // });
  // const p2 = useMovablePoint([1, 1], {
  //   constrain: defaultConstraintPoint as ConstraintFunction,
  // });

  // const c1 = useMovablePoint([0.25, 0.6], {
  //   constrain: defaultConstraintPoint as ConstraintFunction,
  // });
  // const c2 = useMovablePoint([0.75, 0.4], {
  //   constrain: defaultConstraintPoint as ConstraintFunction,
  // });

  const [p1, c1, c2, p2] = points;

  function drawLineSegments(
    pointPath: vec.Vector2[],
    color: string,
    customOpacity = opacity * 0.5,
  ) {
    return inPairs(pointPath).map(([p1, p2], index) => (
      <Line.Segment
        key={index}
        point1={p1}
        point2={p2}
        opacity={customOpacity}
        color={color}
      />
    ));
  }

  return (
    <>
      <Mafs
        zoom
        viewBox={{ x: domain, y: range }}
        width={'auto'}
        height={250}
        preserveAspectRatio={false}
      >
        <Coordinates.Cartesian
          xAxis={{ axis: true, subdivisions: 4 }}
          yAxis={{ axis: true, subdivisions: 4 }}
        />

        {/* Control lines */}
        {drawLineSegments([p1, c1, c2, p2], Theme.pink, 0.5)}
        <Text size={10} x={x(c1)} y={y(c1) + 0.1}>
          {round(x(c1))} {round(y(c1))}
        </Text>

        <Text size={10} x={x(c1)} y={y(c2) + 0.1}>
          {round(x(c1))} {round(y(c2))}
        </Text>

        {/* Quadratic bezier lerp  */}
        <Plot.Parametric
          t={[0, 1]}
          weight={3}
          xy={(t) => xyFromBernsteinPolynomial(p1, c1, c2, p2, t)}
        />
        {points.map((point, i) => (
          <MovablePoint
            key={i}
            point={point}
            color={Theme.blue}
            constrain={defaultConstraintPoint as ConstraintFunction}
            onMove={(newPoint) => {
              onChange && onChange(i, newPoint);
            }}
          />
        ))}
      </Mafs>
    </>
  );
}
