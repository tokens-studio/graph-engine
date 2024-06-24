import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { LayoutType } from '@/redux/models/settings.js';
import { layoutType as layoutTypeSelector } from '@/redux/selectors/settings.js';

import { useDagreLayout } from '@/layouts/dagre.js';

export const useAutoLayout = () => {
  const dagreAutoLayout = useDagreLayout();
  const layoutType = useSelector(layoutTypeSelector);

  return useCallback(() => {
    switch (layoutType) {
      case LayoutType.dagre:
        dagreAutoLayout();
        break;
    }
  }, [dagreAutoLayout, layoutType]);
};
