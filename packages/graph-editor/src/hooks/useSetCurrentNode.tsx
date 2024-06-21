import { currentPanelIdSelector } from '..';
import { useCallback, useEffect } from 'react';
import { useDispatch } from '.';
import { useOnSelectionChange, useReactFlow } from 'reactflow';
import { useSelector } from 'react-redux';

export const useSetCurrentNode = () => {
  const dispatch = useDispatch();
  const { setNodes } = useReactFlow();
  const currentPanel = useSelector(currentPanelIdSelector);

  // deselect all nodes when the panel changes
  useEffect(() => {
    setNodes((nodes) => {
      return nodes.map((node) => {
        node.selected = false;
        return node;
      });
    });
    dispatch.graph.setCurrentNode('');
  }, [currentPanel]);

  // the passed handler has to be memoized, otherwise the hook will not work correctly
  const onChange = useCallback(({ nodes }) => {
    const selectedIds = nodes.map((node) => node.id);
    if (selectedIds.length === 1) {
      dispatch.graph.setCurrentNode(selectedIds[0] || null);
    }
  }, []);

  useOnSelectionChange({
    onChange,
  });
};
