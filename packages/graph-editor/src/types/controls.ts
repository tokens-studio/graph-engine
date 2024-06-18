import { IField } from "@/components/controls/interface";
import { Port } from "@tokens-studio/graph-engine";

/**
 * Additional options for the control
 */
export type ControlOptions = {
    readOnly: boolean;
};

/**
 * Controls are used to provide for auto generated controls based on matchers for the UI 
 */
export type Control = {
    matcher: (port: Port, opts: ControlOptions) => boolean;
    component: React.FC<IField>;
};
