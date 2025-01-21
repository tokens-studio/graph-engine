import { Frame } from './index.js';
import { createContext, useContext } from 'react';

export const FrameContext = createContext<Frame | undefined>(undefined);

export const useFrame = (): Frame => {
  return useContext(FrameContext)!;
};
