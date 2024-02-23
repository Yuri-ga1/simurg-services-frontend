import { type ReactNode, type FC } from 'react';
import { useTitle } from '../lib/dom';

type PageProps = {
  title: string;
  children: ReactNode;
};

export const Page: FC<PageProps> = ({ title, children }) => {
  useTitle(title);
  return children;
};
