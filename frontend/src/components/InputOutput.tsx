import React, { useState } from 'react';
import { Copy, ArrowRight, Loader2, Upload, Download, FileText, Hash } from 'lucide-react';

interface InputOutputProps {
  input: string;
  output: string;
  error: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onCopyOutput: () => void;
  onMoveOutputToInput: () => void;
}

const InputOutput: React.FC<InputOutputProps> = ({
  input,
  output,
  error,
  loading,
  onInputChange,
  onCopyOutput,
  onMoveOutputToInput,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyOutput();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getInputStats = () => {
    const lines = input.split('\n').length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const chars = input.length;
    const bytes = new TextEncoder().encode(input).length;
    return { lines, words, chars, bytes };
  };

  const getOutputStats = () => {
    const lines = output.split('\n').length;
    const chars = output.length;
    const bytes = new TextEncoder().encode(output).length;
    return { lines, chars, bytes };
  };

  const inputStats = getInputStats();
  const outputStats = getOutputStats();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="card fade-in">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Input</h3>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{inputStats.chars} chars</span>
              <span>{inputStats.words} words</span>
              <span>{inputStats.lines} lines</span>
              <span>{formatBytes(inputStats.bytes)}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Enter your data here..."
              className="textarea h-80 resize-none"
              spellCheck={false}
            />
            
            {/* Input Actions */}
            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        onInputChange(e.target?.result as string);
                      };
                      reader.readAsText(file);
                    }
                  };
                  input.click();
                }}
                className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors duration-200"
                title="Upload file"
              >
                <Upload className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              
              <button
                onClick={() => onInputChange('')}
                className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors duration-200"
                title="Clear input"
              >
                <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="card fade-in">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hash className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Output</h3>
              {loading && (
                <Loader2 className="h-4 w-4 text-rust-600 animate-spin" />
              )}
            </div>
            <div className="flex items-center space-x-4">
              {output && !error && (
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{outputStats.chars} chars</span>
                  <span>{outputStats.lines} lines</span>
                  <span>{formatBytes(outputStats.bytes)}</span>
                </div>
              )}
              
              {output && !error && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onMoveOutputToInput}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    title="Move output to input"
                  >
                    <ArrowRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <button
                    onClick={handleCopy}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      copied 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 pulse-success' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title="Copy output"
                  >
                    <Copy className={`h-4 w-4 ${copied ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  </button>
                  
                  <button
                    onClick={() => {
                      const blob = new Blob([output], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'output.txt';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    title="Download output"
                  >
                    <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="relative">
            <textarea
              value={error || output}
              readOnly
              placeholder={loading ? "Processing..." : "Output will appear here..."}
              className={`textarea h-80 resize-none ${
                error 
                  ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' 
                  : ''
              }`}
              spellCheck={false}
            />
            
            {error && (
              <div className="absolute top-3 left-3 right-3">
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="text-red-800 dark:text-red-200 font-medium text-sm mb-1">
                    ⚠️ Error
                  </div>
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="h-8 w-8 text-rust-600 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
                </div>
              </div>
            )}
            
            {!input && !loading && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400 dark:text-gray-500">
                  <Hash className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Enter input data and select an operation</p>
                  <p className="text-xs">Results will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputOutput;
