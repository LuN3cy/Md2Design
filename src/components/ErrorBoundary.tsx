import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Copy, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  savedContent: string | null;
  dataSaved: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    savedContent: null,
    dataSaved: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, savedContent: null, dataSaved: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Attempt to salvage data from localStorage and auto-download
    try {
      const storage = localStorage.getItem('md2card-storage');
      if (storage) {
        const parsed = JSON.parse(storage);
        if (parsed.state) {
          const state = parsed.state;
          
          // 1. Set saved content for preview
          if (state.markdown) {
            this.setState({ savedContent: state.markdown });
          }

          // 2. Auto download .d2d recovery file
          const data = {
            version: '1.0.0',
            timestamp: Date.now(),
            content: state.markdown,
            style: state.cardStyle,
            theme: state.theme
          };

          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = '把我导入md2design可以恢复数据.d2d';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          this.setState({ dataSaved: true });
        }
      }
    } catch (e) {
      console.error("Failed to recover data from storage", e);
    }
  }

  private handleCopy = () => {
    if (this.state.savedContent) {
      navigator.clipboard.writeText(this.state.savedContent)
        .then(() => alert('Content copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-6">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 border border-red-200 dark:border-red-900/30">
            <div className="flex items-center gap-4 mb-6 text-red-500">
              <AlertTriangle size={48} />
              <h1 className="text-3xl font-bold">Oops! Something went wrong.</h1>
            </div>
            
            <p className="mb-6 text-lg opacity-80 leading-relaxed">
              The application encountered an unexpected error and had to stop. 
              Don't worry, your content is likely safe in your browser's local storage.
            </p>

            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg mb-8 font-mono text-sm overflow-auto max-h-32 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400">
              {this.state.error?.toString()}
            </div>

            {this.state.dataSaved && (
              <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg flex items-start gap-3">
                <RefreshCw size={20} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-green-800 dark:text-green-300 mb-1">
                    Data Automatically Saved / 数据已自动保存
                  </h3>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    We have automatically downloaded a recovery file ("把我导入md2design可以恢复数据.d2d") to your computer. 
                    <br className="my-1"/>
                    系统已自动为您下载了备份文件（"把我导入md2design可以恢复数据.d2d"），请在重新加载后导入该文件以恢复您的工作。
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCw size={20} />
                Reload Page
              </button>
              
              {this.state.savedContent && (
                <button 
                  onClick={this.handleCopy}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  <Copy size={20} />
                  Copy Saved Content
                </button>
              )}
            </div>

            {this.state.savedContent && (
               <div className="mt-8">
                 <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-2">Recovered Content Preview</h3>
                 <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto whitespace-pre-wrap font-mono text-xs opacity-70">
                   {this.state.savedContent}
                 </div>
               </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
