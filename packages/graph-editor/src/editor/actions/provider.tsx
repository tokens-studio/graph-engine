import { Node as FlowNode } from 'reactflow';
import { Node } from '@tokens-studio/graph-engine';
import { SerializedNode } from '@/types/serializedNode.js';
import React from 'react';
import type { NodeRequest } from './createNode.js';

export type Actions = {
  createNode: (nodeRequest: NodeRequest) =>
    | undefined
    | {
        graphNode: Node;
        flowNode: FlowNode;
      };
  deleteNode: (nodeId: string) => void;
  copyNodes: (nodes: SerializedNode[]) => void;
  duplicateNodes: (nodeIds: string[]) => void;
};

export const ContextProvider = React.createContext({});

export type ActionProviderProps = {
  children: React.ReactNode;
  actions: Actions;
};
export const ActionProvider = ({ children, actions }: ActionProviderProps) => {
  return (
    <ContextProvider.Provider value={actions}>
      {children}
    </ContextProvider.Provider>
  );
};

export const useAction = <T extends keyof Actions>(
  actionName: T,
): Actions[T] => {
  const actions = React.useContext(ContextProvider) as Actions;
  return actions[actionName];
};
