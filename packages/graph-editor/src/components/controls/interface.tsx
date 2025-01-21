import { Port } from '@tokens-studio/graph-engine';
import { SystemSettings } from '@/system/settings.js';
export interface IField {
  port: Port;
  readOnly?: boolean;
  settings: SystemSettings;
}
