import { System } from './index.js';
import { createContext, useContext } from 'react';

export const SystemContext = createContext<System | undefined>(undefined);

export const useSystem = (): System => {
  return useContext(SystemContext)!;
};
