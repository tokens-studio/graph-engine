import { createNode } from '@/editor/create';
import { NodeTypes } from '@tokens-studio/graph-engine';
import { useDispatch, useSelector } from 'react-redux';
import { useReactFlow } from 'reactflow';
import { storeNodeInsertPositionSelector } from '@/redux/selectors/ui';

export function useEditor() {
  const dispatch = useDispatch();
  const reactFlowInstance = useReactFlow();
  const storeNodeInsertPosition = useSelector(storeNodeInsertPositionSelector);

  const handleSelectNewNodeType = (nodeRequest) => {
    const nodes = reactFlowInstance.getNodes();

    if (!nodeRequest.type) {
      return;
    }
    if (
      nodeRequest.type == NodeTypes.INPUT &&
      nodes.some((x) => x.type == NodeTypes.INPUT)
    ) {
      alert('Only one input node allowed');
      return null;
    }

    if (
      nodeRequest.type == NodeTypes.OUTPUT &&
      nodes.some((x) => x.type == NodeTypes.OUTPUT)
    ) {
      alert('Only one output node allowed');
      return null;
    }

    const position = reactFlowInstance.project(storeNodeInsertPosition);

    const newNode = createNode({
      nodeRequest,
      stateInitializer,
      dispatch,
      position,
    });

    reactFlowInstance.addNodes(newNode);
  };

  return {
    handleSelectNewNodeType,
  };
}
