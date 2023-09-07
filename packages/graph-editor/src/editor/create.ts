import { v4 as uuidv4 } from 'uuid';
import { Node, XYPosition } from 'reactflow';
import { Dispatch } from '../redux/store.tsx';

type ICreate = {
  position?: XYPosition;
  nodeRequest: {
    type: string;
    /**
     * Initial data
     */
    data?: any;
  };
  stateInitializer: Record<string, any>;
  dispatch: Dispatch;
};

export const createNode = (options: ICreate): Node => {
  const { position, nodeRequest, stateInitializer, dispatch } = options;

  const id = uuidv4();

  const initialState = stateInitializer[nodeRequest.type];

  if (initialState === undefined) {
    throw new Error(`No initial state for ${nodeRequest.type}`);
  }

console.log('creating a node', nodeRequest, initialState, position);

  dispatch.node.set({
    id,
    value: {
      ...(initialState as object),
      ...(nodeRequest.data || {}),
    },
  });
  dispatch.input.set({
    id,
    value: {},
  });

  return {
    id: id,
    type: nodeRequest.type,
    data: {},
    position: position || { x: 0, y: 0 },
  };
};
