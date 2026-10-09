import { Component, ErrorInfo, ReactNode } from 'react';
import { useAppStore } from '../state/useAppStore';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    useAppStore.getState().resetDemo();
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#111] border border-red-500/30 p-8 rounded-2xl shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-8">The prototype encountered an unexpected error. You can reset the demo to start over.</p>
            
            <div className="bg-black/50 p-4 rounded text-left overflow-x-auto mb-8">
              <pre className="text-xs text-red-400 font-mono">
                {this.state.error?.toString()}
              </pre>
            </div>

            <button 
              onClick={this.handleReset}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Reset Demo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
