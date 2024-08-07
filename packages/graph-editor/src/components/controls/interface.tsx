import type { DataFlowPort } from '@tokens-studio/graph-engine';
import { SystemSettings } from '@/system/frame/settings.js';
export interface IField {
  port: DataFlowPort;
  readOnly?: boolean;
  settings: SystemSettings;
}
