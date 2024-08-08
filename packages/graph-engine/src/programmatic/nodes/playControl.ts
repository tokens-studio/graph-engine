import { INodeDefinition, Node } from './node.js';


export class PlayControls<T extends Node> {
    node: T;

    constructor(node: T) {
        this.node = node;
    }

    dispose() {
        this.node = null;
    }
    /**
     * Function to call when the graph has been started.
     * This is only really necessary for nodes that need to do something when the graph is expected to be running continuously
     */
    public onStart = () => { };
    public onStop = () => { };
    /**
     * By default, the node will stop when the graph is paused
     */
    public onPause = () => {
        this.onStop();
    };
    /**
     * By default, the node will start when the graph is resumed
     */
    public onResume = () => {
        this.onStart();
    };
}

export interface IPlayControlNode<T extends Node & IPlayControlNode<T> = PlayControlNode> {
    playControls: PlayControls<T>
}

export class PlayControlNode extends Node implements IPlayControlNode<PlayControlNode> {
    playControls: PlayControls<PlayControlNode> = new PlayControls<PlayControlNode>(this);
    constructor(props: INodeDefinition) {
        super(props);
    }

}
