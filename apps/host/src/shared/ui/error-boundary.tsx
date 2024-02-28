import { Component, type PropsWithChildren, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(err: Error, errInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary', err, errInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <div>Упс... Что то пошло не так &#9785;&#65039;</div>;
    }
    return this.props.children;
  }
}
