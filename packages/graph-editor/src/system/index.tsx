import { Frame } from "./frame/index.js";
import { TabBase, TabData } from 'rc-dock';
import { makeAutoObservable } from 'mobx';

export interface ISystem {

    /**
     * The loader for tabs to display in the editor
     */
    tabLoader: TabLoader;
    frames: Frame[];
}

export type TabLoader = (tab: TabBase) => TabData | undefined;


export class System {
    frames: Frame[] = [];
    tabLoader!: TabLoader;

    constructor(config: ISystem) {
        const defaultConfig: Partial<System> = {
            frames: [],
        };

        Object.assign(this, defaultConfig, config);
        makeAutoObservable(this);
    }

    addFrame(frame: Frame) {
        this.frames.push(frame);
    }
}
