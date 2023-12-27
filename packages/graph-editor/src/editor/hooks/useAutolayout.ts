import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { layoutType as layoutTypeSelector } from '@/redux/selectors/settings';
import { LayoutType } from '@/redux/models/settings';

import {
  elkForceOptions,
  elkLayeredOptions,
  elkRectOptions,
  elkStressOptions,
  useElkLayout,
} from '@/layouts/elk';
import { useDagreLayout } from '@/layouts/dagre';

export const useAutoLayout = () => {
  const dagreAutoLayout = useDagreLayout();
  const elkLayout = useElkLayout();
  const layoutType = useSelector(layoutTypeSelector);

  return useCallback(() => {
    switch (layoutType) {
      case LayoutType.dagre:
        dagreAutoLayout();
        break;
      case LayoutType.elkForce:
        elkLayout(elkForceOptions);
        break;
      case LayoutType.elkRect:
        elkLayout(elkRectOptions);
        break;
      case LayoutType.elkLayered:
        elkLayout(elkLayeredOptions);
        break;
      case LayoutType.elkStress:
        elkLayout(elkStressOptions);
        break;
    }
  }, [dagreAutoLayout, elkLayout, layoutType]);
};
