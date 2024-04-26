import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { layoutType as layoutTypeSelector } from '@/redux/selectors/settings';
import { LayoutType } from '@/redux/models/settings';


import { useDagreLayout } from '@/layouts/dagre';

export const useAutoLayout = () => {
  const dagreAutoLayout = useDagreLayout();
  const layoutType = useSelector(layoutTypeSelector);

  return useCallback(() => {
    switch (layoutType) {
      case LayoutType.dagre:
        dagreAutoLayout();
        break;
    }
  }, [dagreAutoLayout,  layoutType]);
};
