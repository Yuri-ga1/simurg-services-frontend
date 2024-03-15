import { Component, type PropsWithChildren, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = PropsWithChildren<{
  // eslint-disable-next-line react/no-unused-prop-types
  error?: ReactNode;
}>;

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.error ?? 'Error!';
    }
    return this.props.children;
  }
}
