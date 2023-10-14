import * as React from 'react';
import { Plot, Line, Mafs, Point, vec, Coordinates, MovablePoint, Text } from 'mafs';
import Color from "colorjs.io";
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
  t: number
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

function clamp(value, min, max) {
  return Math.round(Math.min(Math.max(value, min), max) * 100) / 100;
}

export function BezierCurveEditor({
  value,
  onChange,
  strict = false,
  stops,
  canGoNegative = false,
}) {
  const [pointState, setPointState] = React.useState<{
    [key: string]: [number, number];
  }>(
    strict
      ? {
          p1: [0, 0],
          p2: [1, 1],
          c1: [value[0], value[1]],
          c2: [value[2], value[3]],
        }
      : {
          p1: [0, value[0]],
          p2: [value[1], value[2]],
          c1: [value[3], value[4]],
          c2: [1, value[5]],
        }
  );

  function drawLineSegments(
    pointPath: vec.Vector2[],
    color: string,
    isMuted = false
  ) {
    return inPairs(pointPath).map(([p1, p2], index) => (
      <Line.Segment
        key={index}
        point1={p1}
        point2={p2}
        weight={isMuted ? 1 : 2}
        opacity={isMuted ? 0.5 : 1}
        color={color}
      />
    ));
  }

  React.useEffect(() => {
    if (strict) {
      setPointState({
        p1: [0, 0],
        p2: [1, 1],
        c1: [value[0], value[1]],
        c2: [value[2], value[3]],
      });
    } else {
      setPointState({
        p1: [0, value[0]],
        p2: [1, value[1]],
        c1: [value[2], value[3]],
        c2: [value[4], value[5]],
      });
    }
  }, [value, strict]);

  // Binary search to find t value that gives the desired x value
  function findTForX(xTarget, p1, c1, c2, p2) {
    let t1 = 0;
    let t2 = 1;
    while (t2 - t1 > 0.001) {
      // Stop when the difference is small enough
      const tMid = (t1 + t2) / 2;
      const xMid = xyFromBernsteinPolynomial(p1, c1, c2, p2, tMid)[0];
      if (xMid < xTarget) {
        t1 = tMid;
      } else {
        t2 = tMid;
      }
    }
    return (t1 + t2) / 2; // Return the average of t1 and t2 as the best estimate
  }

  // Generate stops along the curve
  const stopPoints = React.useMemo(() => {
    const points = [];
    for (let i = 0; i < stops.length; i++) {
      const x = i / (stops.length - 1); // Calculate position along the x axis
      const t = findTForX(
        x,
        pointState.p1,
        pointState.c1,
        pointState.c2,
        pointState.p2
      ); // Find corresponding t value
      const point = xyFromBernsteinPolynomial(
        pointState.p1,
        pointState.c1,
        pointState.c2,
        pointState.p2,
        t
      );
      points.push(point);
    }
    return points;
  }, [stops, pointState.p1, pointState.c1, pointState.c2, pointState.p2]);

  function handlePointChange(key: string, newPoint: [number, number]) {
    const newStateObject = { ...pointState, [key]: newPoint };
    setPointState(newStateObject);
    if (strict) {
      onChange([
        newStateObject.c1[0],
        newStateObject.c1[1],
        newStateObject.c2[0],
        newStateObject.c2[1],
      ]);
    } else {
      onChange([
        newStateObject.p1[1],
        newStateObject.p2[1],
        newStateObject.c1[0],
        newStateObject.c1[1],
        newStateObject.c2[0],
        newStateObject.c2[1],
      ]);
    }
  }

  const minimumY = canGoNegative ? -1 : 0;

  return (
    <>
      <Mafs
        width={300}
        height={200}
        pan={false}
        zoom={false}
        viewBox={{ x: [0, 1], y: [canGoNegative ? -1 : 0, 1], padding: 0.2 }}
        preserveAspectRatio={false}
      >
        <Coordinates.Cartesian xAxis={{ lines: 0.1 }} yAxis={{ lines: 0.1 }} />
        {drawLineSegments(
          [pointState.p1, pointState.c1],
          'var(--colors-accentDefault)',
          true
        )}
        {drawLineSegments(
          [pointState.c2, pointState.p2],
          'var(--colors-accentDefault)',
          true
        )}

        {/* Quadratic bezier lerp  */}
        <Plot.Parametric
          t={[0, 1]}
          color="linear-gradient("
          weight={2}
          xy={(t) =>
            xyFromBernsteinPolynomial(
              pointState.p1,
              pointState.c1,
              pointState.c2,
              pointState.p2,
              t
            )
          }
        />

        {/* Render stop points */}
        {stopPoints.map((point, index) => (
          <Point
            key={index}
            x={point[0]}
            y={point[1]}
            color={stops[index].toString()}
            svgCircleProps={{
              r: 4,
              strokeWidth: 1,
              stroke: 'var(--colors-bgDefault)',
              strokeOpacity: 0.75,
            }}
          />
        ))}

        <MovablePoint
          point={pointState.p1}
          color={strict ? 'var(--colors-handleDisabled)' : stops[0].toString()}
          constrain={([x, y]) => [0, strict ? 0 : clamp(y, minimumY, 1)]}
          onMove={(newPoint) => handlePointChange('p1', newPoint)}
        />
        <MovablePoint
          point={pointState.p2}
          color={
            strict
              ? 'var(--colors-handleDisabled)'
              : stops[stops.length - 1].toString()
          }
          constrain={([x, y]) => [1, strict ? 1 : clamp(y, minimumY, 1)]}
          onMove={(newPoint) => handlePointChange('p2', newPoint)}
        />
        <MovablePoint
          point={pointState.c1}
          color={'var(--colors-handleMovable)'}
          constrain={([x, y]) => [
            clamp(x, -0.1, 1.1),
            clamp(y, minimumY - 0.1, 1.1),
          ]}
          onMove={(newPoint) => handlePointChange('c1', newPoint)}
        />
        <MovablePoint
          point={pointState.c2}
          color={'var(--colors-handleMovable)'}
          constrain={([x, y]) => [
            clamp(x, -0.1, 1.1),
            clamp(y, minimumY - 0.1, 1.1),
          ]}
          onMove={(newPoint) => handlePointChange('c2', newPoint)}
        />
      </Mafs>
    </>
  );
}
