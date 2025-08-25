import React from 'react';
import { ChefHat, Moon, Sun, Settings, Zap, Github, Star, Wifi, WifiOff, Loader2, Trash2 } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  connectionStatus?: 'connected' | 'disconnected' | 'connecting';
  operationsCount?: number;
  onClearAll?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  onToggleDarkMode, 
  connectionStatus = 'connected', 
  operationsCount = 0,
  onClearAll
}) => {
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'connecting':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20 dark:border-gray-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <ChefHat className="h-8 w-8 text-rust-600 transform hover:rotate-12 transition-transform duration-300" />
              <Zap className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rust-600 to-rust-800 bg-clip-text text-transparent">
                RustChef
              </h1>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Blazing Fast Data Transformation
              </span>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 dark:text-green-300 font-medium">Performance Mode</span>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">WASM Ready</span>
            </div>
            
            {/* Connection Status */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              connectionStatus === 'connected' 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : connectionStatus === 'connecting'
                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {getConnectionIcon()}
              <span className={`font-medium ${
                connectionStatus === 'connected' 
                  ? 'text-green-700 dark:text-green-300' 
                  : connectionStatus === 'connecting'
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {connectionStatus === 'connected' 
                  ? `${operationsCount} Operations` 
                  : connectionStatus === 'connecting'
                  ? 'Connecting...'
                  : 'Disconnected'
                }
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Clear All Button */}
            {onClearAll && (
              <button
                onClick={onClearAll}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 group"
                title="Clear All"
              >
                <Trash2 className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
              </button>
            )}
            
            {/* GitHub Link */}
            <a
              href="https://github.com/your-username/rust-chef"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group"
              title="View on GitHub"
            >
              <Github className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
            </a>

            {/* Star Button */}
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group">
              <Star className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-yellow-500 transition-colors duration-200" />
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 group"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-yellow-500 transition-colors duration-200" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-200" />
              )}
            </button>
            
            {/* Settings */}
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group">
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
