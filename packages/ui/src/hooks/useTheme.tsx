import { theme } from '@/redux/selectors/index.ts';
import { useSelector } from 'react-redux';

export function useTheme() {
  const theTheme = useSelector(theme);
  return theTheme;
}
