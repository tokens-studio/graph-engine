import { Button, DropdownMenu, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import {
  Operator,
  node,
} from '@tokens-studio/graph-engine/nodes/logic/compare.js';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewBoolean } from '../../preview/boolean.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import React, { useCallback } from 'react';

const CompareNode = () => {
  const { input, state, output, setState } = useNode();

  const setOperator = useCallback((e) => {
    const operator = e.currentTarget.dataset.operator;
    setState((state) => ({ ...state, operator }));
  }, []);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="a">
          <Text>A</Text>
          <PreviewAny value={input.a} />
        </Handle>
        <Handle id="b">
          <Text>B</Text>
          <PreviewAny value={input.b} />
        </Handle>
        <Handle id="operator">
          <Text>Operator</Text>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" asDropdown size="small">
                {state.operator}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                  data-operator={Operator.EQUAL}
                  onClick={setOperator}
                >
                  {Operator.EQUAL}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  data-operator={Operator.NOT_EQUAL}
                  onClick={setOperator}
                >
                  {Operator.NOT_EQUAL}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  data-operator={Operator.GREATER_THAN}
                  onClick={setOperator}
                >
                  {Operator.GREATER_THAN}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  data-operator={Operator.LESS_THAN}
                  onClick={setOperator}
                >
                  {Operator.LESS_THAN}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  data-operator={Operator.GREATER_THAN_OR_EQUAL}
                  onClick={setOperator}
                >
                  {Operator.GREATER_THAN_OR_EQUAL}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  data-operator={Operator.LESS_THAN_OR_EQUAL}
                  onClick={setOperator}
                >
                  {Operator.LESS_THAN_OR_EQUAL}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Text>Output</Text>
          <PreviewBoolean value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(CompareNode, {
  ...node,
  title: 'Compare',
});
