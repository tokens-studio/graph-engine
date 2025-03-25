import { vi } from 'vitest';

vi.mock('@/redux/selectors/graph.js', () => ({
  graphEditorSelector: vi.fn(),
}));

vi.mock('@/redux/selectors/registry.js', () => ({
  nodeTypesSelector: vi.fn(),
}));

vi.mock('@/hooks/useSelectAddedNodes.js', () => ({
  useSelectAddedNodes: vi.fn(),
}));

vi.mock('@/hooks/useToast.js', () => ({
  useToast: vi.fn().mockImplementation(() => {
    return vi.fn();
  }),
}));

vi.mock('reactflow', async () => {
  const actual = await vi.importActual('reactflow');
  return {
    ...actual,
    useReactFlow: vi.fn(),
  };
});

vi.mock('uuid', () => ({
  v4: vi.fn().mockImplementation(() => 'mocked-uuid'),
}));

import { Provider } from 'react-redux';
import { ReactFlowProvider } from 'reactflow';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { xpos, ypos } from '@/annotations/index.js';
import React from 'react';
import useCopyPaste from '../hooks/useCopyPaste.js';
import type { AnyAction } from 'redux';
import type { Store } from 'redux';

import { graphEditorSelector } from '@/redux/selectors/graph.js';
import { nodeTypesSelector } from '@/redux/selectors/registry.js';
import { useReactFlow } from 'reactflow';
import { useSelectAddedNodes } from '@/hooks/useSelectAddedNodes.js';
import { useToast } from '@/hooks/useToast.js';

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn(),
  },
  configurable: true,
});

interface MockNodeOptions {
  variadic?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  nodeType?: string;
  singleton?: boolean;
}

interface MockEdgeOptions {
  sourceHandle?: string;
  targetHandle?: string;
  variadicIndex?: number;
}

const createMockNode = (
  id: string,
  type: string,
  options: MockNodeOptions = {},
) => ({
  id,
  type,
  factory: { type },
  inputs: {
    default: {
      variadic: options.variadic || false,
      _edges: [],
      reset: vi.fn(),
      id: 'default',
    },
  },
  outputs: {
    default: {
      id: 'default',
    },
  },
  execute: vi.fn().mockResolvedValue(undefined),
  annotations: {
    [xpos]: options.x || 0,
    [ypos]: options.y || 0,
    'ui.width': options.width || 200,
    'ui.height': options.height || 100,
    'ui.nodetype': options.nodeType || 'GenericNode',
    ...(options.singleton ? { 'engine.singleton': true } : {}),
  },
});

const createMockEdge = (
  id: string,
  source: string,
  target: string,
  options: MockEdgeOptions = {},
) => ({
  id,
  source,
  target,
  sourceHandle: options.sourceHandle || 'default',
  targetHandle: options.targetHandle || 'default',
  annotations: {
    ...(options.variadicIndex !== undefined
      ? { 'engine.index': options.variadicIndex }
      : {}),
  },
});

const mockRegularNodeFactory = {
  type: 'RegularNode',
  deserialize: vi.fn().mockImplementation(({ serialized, graph }) => {
    const node = createMockNode(serialized.id, 'RegularNode');
    graph.nodes[serialized.id] = node;
    return node;
  }),
};

const mockVariadicNodeFactory = {
  type: 'VariadicNode',
  deserialize: vi.fn().mockImplementation(({ serialized, graph }) => {
    const node = createMockNode(serialized.id, 'VariadicNode', {
      variadic: true,
    });
    graph.nodes[serialized.id] = node;
    return node;
  }),
};

const mockSingletonNodeFactory = {
  type: 'SingletonNode',
  deserialize: vi.fn().mockImplementation(({ serialized, graph }) => {
    const node = createMockNode(serialized.id, 'SingletonNode', {
      singleton: true,
    });
    graph.nodes[serialized.id] = node;
    return node;
  }),
};

const mockStore = {
  getState: vi.fn(),
  subscribe: vi.fn(),
  dispatch: vi.fn(),
  replaceReducer: vi.fn(),
  [Symbol.observable]: vi.fn(),
} as unknown as Store<unknown, AnyAction>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>
    <ReactFlowProvider>{children}</ReactFlowProvider>
  </Provider>
);

describe('useCopyPaste', () => {
  let mockGraphRef;
  let mockReactFlowInstance;
  let mockSelectAddedNodes;
  let mockFlow;
  let mockGraph;
  let mockNodeLookup;
  let mockToastFn;

  beforeEach(() => {
    vi.clearAllMocks();

    mockToastFn = vi.fn();
    vi.mocked(useToast).mockReturnValue(mockToastFn);

    mockFlow = {
      getNodes: vi.fn().mockReturnValue([]),
      addNodes: vi.fn(),
      addEdges: vi.fn(),
    };

    mockGraph = {
      serialize: vi
        .fn()
        .mockReturnValue({ nodes: [], edges: [], annotations: {} }),
      getNode: vi.fn().mockImplementation((id) => {
        return createMockNode(id, 'RegularNode');
      }),
      update: vi.fn().mockResolvedValue(undefined),
      connect: vi
        .fn()
        .mockImplementation((source, sourcePort, target, targetPort, index) => {
          const newEdge = createMockEdge('new-edge-id', source.id, target.id, {
            variadicIndex: index,
            sourceHandle: sourcePort.id || 'default',
            targetHandle: targetPort.id || 'default',
          });
          return newEdge;
        }),
      removeEdge: vi.fn(),
      outEdges: vi.fn().mockReturnValue([]),
      nodes: {},
    };

    mockGraphRef = {
      getFlow: vi.fn().mockReturnValue(mockFlow),
      getGraph: vi.fn().mockReturnValue(mockGraph),
    };

    mockReactFlowInstance = {
      screenToFlowPosition: vi.fn().mockImplementation((pos) => pos),
      getViewport: vi.fn().mockReturnValue({ x: 0, y: 0, zoom: 1 }),
      setViewport: vi.fn(),
      toObject: vi.fn().mockReturnValue({
        nodes: [{ id: 'mocked-uuid', position: { x: 0, y: 0 } }],
        edges: [],
      }),
    };

    mockSelectAddedNodes = vi.fn();

    mockNodeLookup = {
      RegularNode: mockRegularNodeFactory,
      VariadicNode: mockVariadicNodeFactory,
      SingletonNode: mockSingletonNodeFactory,
    };

    vi.mocked(graphEditorSelector).mockReturnValue(mockGraphRef);
    vi.mocked(nodeTypesSelector).mockReturnValue(mockNodeLookup);
    vi.mocked(useReactFlow).mockReturnValue(mockReactFlowInstance);
    vi.mocked(useSelectAddedNodes).mockReturnValue(mockSelectAddedNodes);

    // common mock for window dimensions
    global.innerWidth = 1024;
    global.innerHeight = 768;

    // mock requestAnimationFrame to execute immediately
    global.requestAnimationFrame = (callback) => {
      callback(Date.now());
      return 1;
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('copySelectedNodes', () => {
    it('should copy selected nodes to clipboard', async () => {
      // set up selected nodes
      const selectedNodes = [
        { id: 'node1', selected: true },
        { id: 'node2', selected: true },
      ];
      mockFlow.getNodes.mockReturnValue(selectedNodes);

      // set up serialized graph
      const serializedGraph = {
        nodes: [
          {
            id: 'node1',
            type: 'RegularNode',
            annotations: { [xpos]: 100, [ypos]: 200 },
          },
          {
            id: 'node2',
            type: 'VariadicNode',
            annotations: { [xpos]: 300, [ypos]: 400 },
          },
          {
            id: 'node3',
            type: 'RegularNode',
            annotations: { [xpos]: 500, [ypos]: 600 },
          }, // not selected
        ],
        edges: [
          {
            id: 'edge1',
            source: 'node1',
            target: 'node2',
            sourceHandle: 'default',
            targetHandle: 'default',
          },
          {
            id: 'edge2',
            source: 'node2',
            target: 'node3',
            sourceHandle: 'default',
            targetHandle: 'default',
          }, // will be filtered out
        ],
        annotations: {
          'ui.viewport': { x: 0, y: 0, zoom: 1 },
          'other.annotation': 'value',
        },
      };
      mockGraph.serialize.mockReturnValue(serializedGraph);

      // expected serialized subgraph
      const expectedSerializedSubgraph = {
        nodes: [
          {
            id: 'node1',
            type: 'RegularNode',
            annotations: { [xpos]: 100, [ypos]: 200 },
          },
          {
            id: 'node2',
            type: 'VariadicNode',
            annotations: { [xpos]: 300, [ypos]: 400 },
          },
        ],
        edges: [
          {
            id: 'edge1',
            source: 'node1',
            target: 'node2',
            sourceHandle: 'default',
            targetHandle: 'default',
            annotations: {},
          },
        ],
        annotations: { 'other.annotation': 'value' },
      };

      const { result } = renderHook(() => useCopyPaste(), { wrapper });

      await act(async () => {
        result.current.copySelectedNodes();
      });

      // verify clipboard contains serialized graph
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
      const writeTextMock = navigator.clipboard.writeText as unknown as {
        mock: { calls: string[][] };
      };
      expect(JSON.parse(writeTextMock.mock.calls[0][0])).toEqual(
        expectedSerializedSubgraph,
      );
    });
  });

  describe('pasteFromClipboard', () => {
    beforeEach(() => {
      // mock clipboard data for paste operations
      (
        navigator.clipboard.readText as unknown as {
          mockResolvedValue: (value: string) => void;
        }
      ).mockResolvedValue(
        JSON.stringify({
          nodes: [
            {
              id: 'node1',
              type: 'RegularNode',
              annotations: { [xpos]: 100, [ypos]: 200 },
            },
            {
              id: 'node2',
              type: 'VariadicNode',
              annotations: { [xpos]: 300, [ypos]: 400 },
            },
          ],
          edges: [
            {
              id: 'edge1',
              source: 'node1',
              target: 'node2',
              sourceHandle: 'default',
              targetHandle: 'default',
              annotations: { 'engine.index': 0 },
            },
          ],
        }),
      );
    });

    it('should attempt to paste nodes from clipboard', async () => {
      const mockNode1 = createMockNode('mocked-uuid', 'RegularNode');
      const mockNode2 = createMockNode('mocked-uuid', 'VariadicNode', {
        variadic: true,
      });
      mockGraph.nodes['mocked-uuid'] = mockNode1;
      mockGraph.nodes['mocked-uuid'] = mockNode2;

      const { result } = renderHook(() => useCopyPaste(), { wrapper });

      await act(async () => {
        result.current.pasteFromClipboard();
      });

      // verify that clipboard was read
      expect(navigator.clipboard.readText).toHaveBeenCalled();

      // verify ReactFlow was accessed to position nodes
      expect(mockReactFlowInstance.screenToFlowPosition).toHaveBeenCalled();

      // verify attempt to update the UI
      expect(mockReactFlowInstance.getViewport).toHaveBeenCalled();
    });

    it('should handle pasting singleton nodes', async () => {
      // mock clipboard data with a singleton node
      (
        navigator.clipboard.readText as unknown as {
          mockResolvedValue: (value: string) => void;
        }
      ).mockResolvedValue(
        JSON.stringify({
          nodes: [
            {
              id: 'singleton1',
              type: 'SingletonNode',
              annotations: {
                [xpos]: 100,
                [ypos]: 200,
                'engine.singleton': true,
              },
            },
          ],
          edges: [],
        }),
      );

      // mock existing singleton node
      mockGraph.nodes = {
        'existing-singleton': createMockNode(
          'existing-singleton',
          'SingletonNode',
          { singleton: true },
        ),
      };

      const { result } = renderHook(() => useCopyPaste(), { wrapper });

      await act(async () => {
        result.current.pasteFromClipboard();
      });

      // verify singleton factory was not called
      expect(mockSingletonNodeFactory.deserialize).not.toHaveBeenCalled();
    });

    it('should attempt to handle variadic connections', async () => {
      // mock clipboard data with multiple connections to a variadic input
      (
        navigator.clipboard.readText as unknown as {
          mockResolvedValue: (value: string) => void;
        }
      ).mockResolvedValue(
        JSON.stringify({
          nodes: [
            {
              id: 'source1',
              type: 'RegularNode',
              annotations: { [xpos]: 100, [ypos]: 200 },
            },
            {
              id: 'source2',
              type: 'RegularNode',
              annotations: { [xpos]: 200, [ypos]: 200 },
            },
            {
              id: 'target',
              type: 'VariadicNode',
              annotations: { [xpos]: 300, [ypos]: 300 },
            },
          ],
          edges: [
            {
              id: 'edge1',
              source: 'source1',
              target: 'target',
              sourceHandle: 'default',
              targetHandle: 'default',
              annotations: { 'engine.index': 0 },
            },
            {
              id: 'edge2',
              source: 'source2',
              target: 'target',
              sourceHandle: 'default',
              targetHandle: 'default',
              annotations: { 'engine.index': 1 },
            },
          ],
        }),
      );

      // setup specific mocks for variadic test
      vi.mocked(mockGraph.getNode).mockImplementation((id) => {
        if (id.includes('source')) {
          return createMockNode(id, 'RegularNode');
        } else if (id.includes('target')) {
          return createMockNode(id, 'VariadicNode', { variadic: true });
        }
        return createMockNode(id, 'RegularNode');
      });

      const { result } = renderHook(() => useCopyPaste(), { wrapper });

      await act(async () => {
        result.current.pasteFromClipboard();
      });

      expect(mockFlow.addNodes).toHaveBeenCalled();
      expect(mockGraphRef.getGraph).toHaveBeenCalled();
    });

    it('should handle invalid clipboard data', async () => {
      // mock invalid clipboard data
      (
        navigator.clipboard.readText as unknown as {
          mockResolvedValue: (value: string) => void;
        }
      ).mockResolvedValue('invalid json');

      const { result } = renderHook(() => useCopyPaste(), { wrapper });

      await act(async () => {
        result.current.pasteFromClipboard();
      });

      // cerify that clipboard was read
      expect(navigator.clipboard.readText).toHaveBeenCalled();

      // cerify that execution stopped (flow methods not called)
      expect(mockFlow.addNodes).not.toHaveBeenCalled();
      expect(mockFlow.addEdges).not.toHaveBeenCalled();
    });
  });
});
