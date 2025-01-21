import { LayoutType } from '@/system/frame/settings.js';
import { useCallback } from 'react';
import { useDagreLayout } from '@/layouts/dagre.js';
import { useFrame } from '@/system/frame/hook.js';

export const useAutoLayout = () => {
  const system = useFrame();
  const dagreAutoLayout = useDagreLayout();
  return useCallback(() => {
    switch (system.settings.layoutType) {
      case LayoutType.dagre:
        dagreAutoLayout();
        break;
    }
  }, [dagreAutoLayout, system.settings.layoutType]);
};
