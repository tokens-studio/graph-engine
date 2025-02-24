
import { Assert } from '@/Assert.js';
import { BehaviourNode } from './behaviorNode.js';
import { Engine } from '../execution/engine.js';
import { IEventNode, INode, NodeType } from './NodeInstance.js';
import { IEventNodeDefinition, NodeCategory } from './NodeDefinitions.js';
import { IGraph } from '../Graphs/Graph.js';
import { NodeDescription } from './Registry/NodeDescription.js';
import { Socket } from '../Sockets/Socket.js';

// no flow inputs, always evaluated on startup
export class AbstractEventNode extends BehaviourNode implements IEventNode {
    constructor(
        description: NodeDescription,
        graph: IGraph,
        inputs: Socket[] = [],
        outputs: Socket[] = [],
        configuration: NodeConfiguration = {}
    ) {
        super({
            ...description,
            description: {
                ...description,
                category: description.category as NodeCategory
            },
            inputs,
            outputs,
            graph,
            configuration,
            nodeType: NodeType.Event
        });
        // no input flow sockets allowed.
        Assert.mustBeTrue(
            !Object.values(this.inputs).some((socket) => socket.valueTypeName === 'flow')
        );

        // must have at least one output flow socket
        Assert.mustBeTrue(
            Object.values(this.outputs).some((socket) => socket.valueTypeName === 'flow')
        );
    }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    init(engine: Engine) {
        throw new Error('not implemented');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispose(engine: Engine) {
        throw new Error('not implemented');
    }
}

export class EventNode2 extends AbstractEventNode {
    constructor(props: {
        description: NodeDescription;
        graph: IGraph;
        inputs?: Socket[];
        outputs?: Socket[];
        configuration?: NodeConfiguration;
    }) {
        super(
            props.description,
            props.graph,
            props.inputs,
            props.outputs,
            props.configuration
        );
    }
}

export class EventNodeInstance<TEventNodeDef extends IEventNodeDefinition>
    extends Node<NodeType.Event>
    implements IEventNode {
    private initInner: TEventNodeDef['init'];
    private disposeInner: TEventNodeDef['dispose'];
    private state: TEventNodeDef['initialState'];
    private readonly outputSocketKeys: string[];

    constructor(
        nodeProps: Omit<INode, 'nodeType'> &
            Pick<TEventNodeDef, 'init' | 'dispose' | 'initialState'>
    ) {
        super({ ...nodeProps, nodeType: NodeType.Event });
        this.initInner = nodeProps.init;
        this.disposeInner = nodeProps.dispose;
        this.state = nodeProps.initialState;
        this.outputSocketKeys = nodeProps.outputs.map((s) => s.name);
    }

    init = (engine: Engine): any => {
        this.state = this.initInner({
            read: this.readInput,
            write: this.writeOutput,
            state: this.state,
            outputSocketKeys: this.outputSocketKeys,
            commit: (outFlowname, fiberCompletedListener) =>
                engine.commitToNewFiber(this, outFlowname, fiberCompletedListener),
            configuration: this.configuration,
            graph: this.graph
        });
    };

    dispose(): void {
        this.disposeInner({
            state: this.state,
            graph: this.graph
        });
    }
}
