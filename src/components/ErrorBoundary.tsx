import { Component, ErrorInfo, ReactNode } from 'react';
import { Flower2, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    message: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BloomBox ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8F7F4] p-6">
          <div className="w-full max-w-md rounded-2xl border border-[#1F291E]/10 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#7D8035] text-white">
              <Flower2 className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-[#1F291E]">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-[#1F291E]/70">
              We hit a brief hiccup loading BloomBox. Reloading usually fixes it right away.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7D8035] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#696B2B] transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reload BloomBox</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
