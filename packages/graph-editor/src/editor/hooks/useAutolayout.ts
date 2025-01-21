import { LayoutType } from '@/system/settings.js';
import { useCallback } from 'react';
import { useDagreLayout } from '@/layouts/dagre.js';
import { useSystem } from '@/system/hook.js';

export const useAutoLayout = () => {
  const system = useSystem();
  const dagreAutoLayout = useDagreLayout();
  return useCallback(() => {
    switch (system.settings.layoutType) {
      case LayoutType.dagre:
        dagreAutoLayout();
        break;
    }
  }, [dagreAutoLayout, system.settings.layoutType]);
};
