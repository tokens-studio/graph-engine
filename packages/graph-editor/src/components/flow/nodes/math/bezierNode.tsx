import {
  Handle,
  HandleContainer,
  HandleText,
} from '../../handles.tsx';
import { IconButton, Stack, Text } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/math/bezier.js';
import React, { useCallback, useMemo } from 'react';
import InputPopover from '#/components/InputPopover.tsx';
import { BezierCurveEditor } from '#/components/BezierCurveEditor.tsx';
import { BezierIcon } from '#/components/icons/BezierIcon.tsx';
import { PreviewAny } from '../../preview/any.tsx';

function BezierPopover({ value, onChange }) {
  return (
  <InputPopover trigger={<IconButton variant="invisible" size="small" icon={<BezierIcon />} tooltip="Edit curve" />}>
     <BezierCurveEditor value={value} onChange={onChange} />
  </InputPopover>)
}

const BezierNode = () => {
  const { input, state, output, setState } = useNode();

  const handleChange = useCallback((curve) => {
    setState((state) => ({
      ...state,
      curve,
    }));
  }, [setState]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="curve">
          <Stack direction="row" justify="between" gap={3} align="center">
            <HandleText secondary>Curve</HandleText>
            <BezierPopover value={input.curve || state.curve} onChange={handleChange} />
          </Stack>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <HandleText>Output</HandleText>
          <PreviewAny value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(BezierNode, {
  ...node,
  title: 'Bezier curve',
  icon: <BezierIcon />,
});
