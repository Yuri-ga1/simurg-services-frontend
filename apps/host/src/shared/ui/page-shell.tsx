import { type FC, type PropsWithChildren } from 'react';
import { useDocumentTitle } from '~/shared/lib/dom';

type PageShellProps = PropsWithChildren<{ documentTitle: string }>;

export const PageShell: FC<PageShellProps> = ({ documentTitle, children }) => {
  useDocumentTitle(documentTitle);

  return children;
};
