import { useEffect } from 'react';

export const useMount = (fn: () => void): void => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fn(), []);
};
