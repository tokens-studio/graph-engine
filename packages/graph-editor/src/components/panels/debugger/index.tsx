import React from 'react';

import { Debugger } from '@/components/debugger/index.js';
import { debugInfo } from '../../debugger/data.js';

export const DebugPanel = () => {
  return <Debugger data={debugInfo} effects={{}} />;
};
