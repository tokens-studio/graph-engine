
import React from 'react';

import {  Debugger } from '@/components/debugger';
import {  debugInfo } from '../../debugger/data';



export const DebugPanel = () => {
    return <Debugger data={debugInfo} effects={{}} />
};
