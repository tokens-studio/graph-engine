import { Edge, useReactFlow } from 'reactflow';
import { ErrorBoundary } from 'react-error-boundary';
import { Node } from './node.tsx';
import {
  NodeDefinition,
  NodeTypes,
  defaultMapOutput,
} from '@tokens-studio/graph-engine';
import { getOutgoingEdges } from '../utils.ts';
import { inputSelector, stateSelector } from '#/redux/selectors/index.ts';
import { useDispatch } from '#/hooks/index.ts';
import { useInvalidator } from '#/editor/forceUpdateContext.tsx';
import { useSelector } from 'react-redux';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import isPromise from 'is-promise';

export type UiNodeDefinition = {
  //Name of the Node
  title?: string;
  icon?: React.ReactNode;
} & NodeDefinition<any, any, any>;

export type INodeContext<Input = any, State = any, Output = any> = {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setControls: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  state: State;
  setState: (state: any) => void;
  input: Input;
  output: Output;
  error: Error | null;
  /**
   * Creates a new value connection. Useful when generating a new dynamic handle
   * @param key
   * @param value
   * @returns
   */
  createInput: (key: string, value?: any) => void;
  disconnectInput: (key: string) => void;
  onConnect: (edge: Edge) => void;
};
const noop = () => {
  /** Do nothing */
};

const NodeContext = createContext<INodeContext>({
  setTitle: noop,
  setControls: noop,
  createInput: noop,
  error: null,
  state: {},
  input: {},
  output: undefined,
  onConnect: noop,
  disconnectInput: noop,
  setState: noop,
});

export type WrappedNodeDefinition = {
  type: string;
  state: Record<string, any>;
  component: React.FC;
};

/**
 * Note that the output is always an object, so we use stringification to compare it for equality
 * @param InnerNode
 * @param nodeDef
 * @returns
 */
export const WrapNode = (
  InnerNode,
  nodeDef: UiNodeDefinition,
): WrappedNodeDefinition => {
  const WrappedNode = (data) => {
    const [error, setError] = useState<Error | null>(null);
    const [title, setTitle] = useState<string>(nodeDef.title || '');
    const [isLoading, setIsLoading] = useState(false);
    const flow = useReactFlow();
    const [controls, setControls] = useState<React.ReactNode>(null);
    const forceUpdate = useInvalidator();

    const dispatch = useDispatch();
    //We have access to our child state
    const input = useSelector(inputSelector(data.id));

    const state = useSelector(stateSelector(data.id));

    console.log(state);
    

    const [output, setOutput] = useState<any>(undefined);

    const disconnectInput = useCallback((key) => {
      //Remove the value form the input
      dispatch.input.remove({
        id: data.id,
        key,
      });

      //and also remove from the graph
      flow.setEdges((edges) =>
        edges.filter((edge) => {
          return !(edge.target == data.id && edge.targetHandle == key);
        }),
      );
    }, []);

    const setState = useCallback(
      (newVal) => {
        dispatch.node.set({
          id: data.id,
          value: newVal,
        });
      },
      [data.id, dispatch.node],
    );

    const mappedInput = useMemo(() => {
      if (nodeDef.mapInput) {
        const val = nodeDef.mapInput(input, state);
        return val;
      }
      return input;
    }, [input, state]);

    useMemo(async () => {
      setIsLoading(true);
      try {
        if (mappedInput !== undefined) {
          let value = nodeDef.process(mappedInput, state, {});
          //@ts-ignore
          const asyncProcess = isPromise(value);
          if (asyncProcess) {
            setIsLoading(true);
            value = await value;
          }
          const mappedOutput = (nodeDef.mapOutput || defaultMapOutput)(
            mappedInput,
            state,
            value,
            {},
          );
          setError(null);
          setIsLoading(false);

          if (nodeDef.type === NodeTypes.OUTPUT) {
            dispatch.output.setCurrentOutput(mappedOutput);
          }
          setOutput(mappedOutput);
        }
      } catch (err) {
        console.error(err);
        setError(err as Error);
        //Clear the output
        setOutput(undefined);
      }
      setIsLoading(false);
    }, [mappedInput, state, forceUpdate]);

    const onConnect = useCallback(
      async (params) => {
        //If we haven't create a value
        if (output === undefined) return;
        dispatch.input.updateInput({
          id: params.target,
          key: params.targetHandle,
          value: output[params.sourceHandle],
        });
      },
      [JSON.stringify(output)],
    );

    /**
     * This should be used sparingly. Its only real use is dynamically creating new handles
     */
    const createInput = useCallback(
      (key, value) => {
        dispatch.input.updateInput({
          id: data.id,
          key,
          value,
        });
      },
      [data.id],
    );

    const values = useMemo(() => {
      return {
        error,
        setTitle,
        setControls,
        createInput,
        input: mappedInput,
        state,
        setState,
        output,
        disconnectInput,
        onConnect,
      };
    }, [
      error,
      mappedInput,
      state,
      setState,
      output,
      disconnectInput,
      onConnect,
      createInput,
    ]);

    useEffect(() => {
      async function propagate() {
        //Handle propagating the value to the next node

        if (output === undefined) return;

        let outputVal = output;

        //@ts-ignore
        if (isPromise(output)) {
          outputVal = (await output) as Promise<any>;
        }
        //It might fail
        if (outputVal === undefined) return;

        const self = flow.getNode(data.id);
        const edges = flow.getEdges();

        const outgoing = getOutgoingEdges(self, edges);
        outgoing.forEach((edge) => {
          dispatch.input.updateInput({
            id: edge.target!,
            key: edge.targetHandle!,
            value: output[edge.sourceHandle!],
          });
        });
      }
      propagate();
    }, [JSON.stringify(output)]);

    return (
      <NodeContext.Provider value={values}>
        <Node
          key={data.id}
          id={data.id}
          isAsync={isLoading}
          icon={nodeDef.icon}
          title={title}
          error={error}
          controls={controls}
        >
          <ErrorBoundary fallbackRender={() => 'Oops I just accidentally ...'}>
            <InnerNode />
          </ErrorBoundary>
        </Node>
      </NodeContext.Provider>
    );
  };

  //@ts-ignore
  WrapNode.whyDidYouRender = true;

  return {
    type: nodeDef.type,
    state: nodeDef.defaults || {},
    component: React.memo(WrappedNode),
  };
};

export const useNode = <Input = any, State = any, Output = any>() => {
  return useContext(NodeContext) as INodeContext<Input, State, Output>;
};
