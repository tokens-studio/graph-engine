import * as React from "react";
import { Plot, Line, Mafs, useMovablePoint, vec, MovablePoint } from "mafs";

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
    vec.scale(p2, t ** 3)
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
  return Math.round(Math.min(Math.max(value, min), max) * 100) / 100
}

export function BezierCurveEditor({value, onChange}) {
  const [pointState, setPointState] = React.useState<{ [key: string]: [number, number] }>({p1: [0, 0], p2: [1,1], c1: [value[0], value[1]], c2: [value[2], value[3]]});

  function drawLineSegments(pointPath: vec.Vector2[], color: string) {
    return inPairs(pointPath).map(([p1, p2], index) => (
      <Line.Segment
        key={index}
        point1={p1}
        point2={p2}
        opacity={1}
        color={color}
      />
    ));
  }

  React.useEffect(() => {
    setPointState({p1: [0, 0], p2: [1,1], c1: [value[0], value[1]], c2: [value[2], value[3]]});
  }, [value]);

  function handlePointChange(key: string, newPoint: [number, number]) {
    const newStateObject = {...pointState, [key]: newPoint};
    setPointState(newStateObject)
    // NOTE: This is expecting p0 and p1 to never change as in a bezier curve. We should likely make this more flexible for other curves where for example we start at 1, 1 and end at 1, 1 e.g. to change saturation or lightness.
    // This was following the example laid out in https://mafs.dev/guides/interaction/movable-points
    onChange([newStateObject.c1[0], newStateObject.c1[1], newStateObject.c2[0], newStateObject.c2[1]]);
  }

  return (
    <>
      <Mafs width={200} height={200} pan={false} zoom={false} viewBox={{ x: [0, 1], y: [0, 1] }}>
        {drawLineSegments([pointState.p1, pointState.c1], "var(--colors-fgDefault)")}
        {drawLineSegments([pointState.c2, pointState.p2], "var(--colors-fgDefault)")}

        {/* Quadratic bezier lerp  */}
        <Plot.Parametric
          t={[0, 1]}
          color="var(--colors-fgDefault)"
          weight={3}
          xy={(t) =>
            xyFromBernsteinPolynomial(pointState.p1, pointState.c1, pointState.c2, pointState.p2, t)
          }
        />

        <MovablePoint
          point={pointState.p1}
          color={"var(--colors-fgDefault)"}
          constrain={([x, y]) => [0, clamp(y, 0, 1)]}
          onMove={(newPoint) => handlePointChange('p1', newPoint)}
        />
        <MovablePoint
          point={pointState.p2}
          color={"var(--colors-fgDefault)"}
          constrain={([x, y]) => [1, clamp(y, 0, 1)]}
          onMove={(newPoint) => handlePointChange('p2', newPoint)}

        />
        <MovablePoint
          point={pointState.c1}
          color={"var(--colors-accentDefault)"}
          constrain={([x, y]) => [clamp(x, 0, 1), clamp(y, 0, 1)]}
          onMove={(newPoint) => handlePointChange('c1', newPoint)}

        />
        <MovablePoint
          point={pointState.c2}
          color={"var(--colors-accentDefault)"}
          constrain={([x, y]) => [clamp(x, 0, 1), clamp(y, 0, 1)]}
          onMove={(newPoint) => handlePointChange('c2', newPoint)}
        />
      </Mafs>
    </>
  );
}
