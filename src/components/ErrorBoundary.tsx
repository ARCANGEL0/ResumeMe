import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            background: '#0d0b1a',
            color: '#f0eeff',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '480px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠</div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px' }}>Something went wrong</h1>
            <p style={{ color: 'rgba(240,238,255,0.65)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={this.handleReset}
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
