import { Edge, useReactFlow } from 'reactflow';
import { ErrorBoundary } from 'react-error-boundary';
import { Node } from './node.tsx';
import {
  NodeDefinition,
  NodeTypes,
  defaultMapOutput,
} from '@tokens-studio/graph-engine';
import { getOutgoingEdges } from '../utils.ts';
import {
  inputSelector,
  stateSelector,
} from '../../../redux/selectors/index.ts';
import { useDispatch } from '../../../hooks/index.ts';
import { useInvalidator } from '../../../editor/forceUpdateContext.tsx';
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
import { useOnOutputChange } from '#/context/OutputContext.tsx';
import { useExternalLoader } from '#/context/ExternalLoaderContext.tsx';
import { useExternalData } from '#/context/ExternalDataContext.tsx';

export type UiNodeDefinition = {
  //Name of the Node
  title?: string;
  // Whether to support custom rendering by specifying a component
  wrapper?: React.FC;
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
  disconnectInputs: (keys: string[]) => void;
  disconnectAllOutputs: () => void;
  onConnect: (edge: Edge) => void;
  ephemeralState: object;
  setEphemeralState: (state: object) => void;
  loadingEphemeralData: boolean;
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
  disconnectInputs: noop,
  disconnectAllOutputs: noop,
  setState: noop,
  ephemeralState: {},
  setEphemeralState: noop,
  loadingEphemeralData: false,
});

export type WrappedNodeDefinition = {
  type: string;
  state: Record<string, any>;
  component: React.ReactNode | React.FC;
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
    const { loadSetTokens } = useExternalData();
    const { externalLoader } = useExternalLoader();
    const [ephemeralState, setEphemeralState] = useState({});
    const [loadingEphemeralData, setLoadingEphemeralData] = useState(false);
    const { onOutputChange } = useOnOutputChange();
    const [error, setError] = useState<Error | null>(null);
    const [title, setTitle] = useState<string>(nodeDef.title || '');
    const [execTime, setExecTime] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const flow = useReactFlow();
    const [controls, setControls] = useState<React.ReactNode>(null);
    const forceUpdate = useInvalidator();

    const dispatch = useDispatch();
    //We have access to our child state
    const input = useSelector(inputSelector(data.id));
    const state = useSelector(stateSelector(data.id));

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

    const disconnectInputs = useCallback((keys) => {
      //Remove the values from the input
      keys.forEach((key) => {
        dispatch.input.remove({
          id: data.id,
          key,
        });
      });

      //and also remove from the graph
      flow.setEdges((edges) =>
        edges.filter((edge) => {
          return !(edge.target == data.id && keys.includes(edge.targetHandle));
        }),
      );
    }, []);

    const disconnectAllOutputs = useCallback(() => {
      const self = flow.getNode(data.id);
      const edges = flow.getEdges();

      const outgoing = getOutgoingEdges(self, edges);
      outgoing.forEach((edge) => {
        dispatch.input.remove({
          id: edge.target!,
          key: edge.targetHandle!,
        });
      });

      flow.setEdges((edges) =>
        edges.filter((edge) => {
          return !outgoing.find((outEdge) => outEdge.id === edge.id);
        }),
      );
    }, [flow, output, data.id, dispatch.node]);

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

    useEffect(() => {
      if (nodeDef.type === NodeTypes.SET) {
        const getTokens = async () => {
          setLoadingEphemeralData(true);
          const set = await loadSetTokens(state.identifier);
          setEphemeralState(set);
          setLoadingEphemeralData(false);
        };

        if (state.identifier) {
          getTokens();
        }
      }
    }, [state?.identifier, loadSetTokens]);

    useEffect(() => {
      async function fetchExternalData() {
        if (nodeDef.external && !externalLoader) {
          throw new Error(
            `Node "${data.id}" of type "${nodeDef.type}" requires an external loader`,
          );
        } else if (nodeDef.external && externalLoader) {
          const ephemeralRequest = nodeDef.external(mappedInput, state);
          let ephemeralData = await externalLoader({
            type: nodeDef.type,
            id: data.id,
            data: ephemeralRequest,
          });
          setEphemeralState(ephemeralData);
        }
      }

      fetchExternalData();
    }, [state?.identifier, mappedInput, state, externalLoader]);

    useMemo(async () => {
      setIsLoading(true);
      try {
        if (mappedInput !== undefined) {
          const processStart = performance.now();
          let value = nodeDef.process(mappedInput, state, ephemeralState);

          //@ts-ignore
          const asyncProcess = isPromise(value);
          if (asyncProcess) {
            setIsLoading(true);
            value = await value;
          }

          const processEnd = performance.now();
          setExecTime(processEnd - processStart);
          const mappedOutput = (nodeDef.mapOutput || defaultMapOutput)(
            mappedInput,
            state,
            value,
            ephemeralState,
          );
          setError(null);
          setIsLoading(false);

          if (nodeDef.type === NodeTypes.OUTPUT) {
            onOutputChange(mappedOutput);
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
    }, [mappedInput, state, forceUpdate, ephemeralState, onOutputChange]);

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
        disconnectInputs,
        disconnectAllOutputs,
        onConnect,
        ephemeralState,
        setEphemeralState,
        loadingEphemeralData,
      };
    }, [
      error,
      mappedInput,
      state,
      setState,
      output,
      disconnectInput,
      disconnectInputs,
      disconnectAllOutputs,
      onConnect,
      createInput,
      ephemeralState,
      setEphemeralState,
      loadingEphemeralData,
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

    const stats = useMemo(
      () => ({
        executionTime: execTime,
      }),
      [execTime],
    );

    const Wrapped = useMemo(() => {
      if (nodeDef.wrapper) {
        return nodeDef.wrapper;
      }
      return Node;
    }, [nodeDef.wrapper]);

    const logError = useCallback((error, info) => {
      console.error(error, info);
    }, []);

    return (
      <NodeContext.Provider value={values}>
        <Wrapped
          key={data.id}
          id={data.id}
          isAsync={isLoading}
          icon={nodeDef.icon}
          title={title}
          error={error}
          controls={controls}
          stats={stats}
        >
          <ErrorBoundary
            fallbackRender={() => 'Oops I just accidentally ...'}
            onError={logError}
          >
            <InnerNode />
          </ErrorBoundary>
        </Wrapped>
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
