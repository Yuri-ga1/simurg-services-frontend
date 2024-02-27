import { type FC, type PropsWithChildren } from 'react';
import { useTitle } from '../lib/dom';

export const Page: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
  useTitle(title);
  return children;
};
