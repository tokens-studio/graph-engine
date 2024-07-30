import { useCallback } from 'react';
import { useReactFlow, useStoreApi } from 'reactflow';

function useDetachNodes() {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();

  const detachNodes = useCallback(
    (ids: string[], removeParentId?: string) => {
      const { nodeInternals } = store.getState();
      const nextNodes = Array.from(nodeInternals.values()).map((n) => {
        if (ids.includes(n.id) && n.parentId) {
          const parentId = nodeInternals.get(n.parentId);

          //Remove parent reference and recalculate in global space
          return {
            ...n,
            position: {
              x: n.position.x + (parentId?.positionAbsolute?.x ?? 0),
              y: n.position.y + (parentId?.positionAbsolute?.y ?? 0),
            },
            extent: undefined,
            parentId: undefined,
          };
        }
        return n;
      });
      setNodes(
        nextNodes.filter((n) => !removeParentId || n.id !== removeParentId),
      );
    },
    [setNodes, store],
  );

  return detachNodes;
}

export default useDetachNodes;
