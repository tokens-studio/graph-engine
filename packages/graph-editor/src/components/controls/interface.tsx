import { Port } from '@tokens-studio/graph-engine';
import { SystemSettings } from '@/system/frame/settings.js';
export interface IField {
  port: Port;
  readOnly?: boolean;
  settings: SystemSettings;
}
