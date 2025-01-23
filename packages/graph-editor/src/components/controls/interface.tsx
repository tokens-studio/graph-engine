import { SystemSettings } from '@/system/frame/settings.js';
import type { DataFlowPort } from '@tokens-studio/graph-engine';
export interface IField {
  port: DataFlowPort;
  readOnly?: boolean;
  settings: SystemSettings;
}
