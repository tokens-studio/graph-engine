/* eslint-disable @typescript-eslint/no-unused-vars */
import { Loader } from "../../src/interfaces/loader";

export const loader:Loader={

    listComponents: async () => {
        return {};
    },
    registerComponent: (library: string, componentName: string) => {
        return;
    },
    setSource: async (library: string, componentName: string, code: string, language: string) => {
        return;
    },
    load: async (library: string, componentName: string) => {
        return;
    }
}