import { Node } from '../../programmatic/node.js';


/**
 * To use this class, add a `this.playControls = new PlayControls(this);` to your node.
 * You will then need to override and implement the onStart, onStop, onPause, and onResume functions.
 * 
 * Lastly don't forget to call `this.playControls.dispose()` when the node is disposed.
 */
export class PlayControls<T extends Node> {
    node: T;

    constructor(node: T) {
        this.node = node;
    }

    dispose() {
        //@ts-ignore This is to force release of the node reference
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

export interface IPlayControlNode<T extends Node = Node> {
    playControls: PlayControls<T>
}
