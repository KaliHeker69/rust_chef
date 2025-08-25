import React from 'react';
import { Search, Plus, Hash, Shield, Type, Database, Filter } from 'lucide-react';
import { Operation } from '../types';

interface OperationsListProps {
  operations: Operation[];
  onOperationSelect: (operation: Operation) => void;
  onAddToRecipe: (operation: Operation) => void;
  selectedOperation: Operation | null;
}

const categoryIcons = {
  'Encoding': Type,
  'Hashing': Hash,
  'Crypto': Shield,
  'Text': Type,
  'Data': Database,
};

const OperationsList: React.FC<OperationsListProps> = ({
  operations,
  onOperationSelect,
  onAddToRecipe,
  selectedOperation,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const categories = ['All', ...new Set(operations.map(op => op.category))];
  
  const filteredOperations = operations.filter(op => {
    const matchesSearch = op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || op.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const operationsByCategory = categories.reduce((acc, category) => {
    if (category === 'All') return acc;
    
    acc[category] = filteredOperations.filter(op => op.category === category);
    return acc;
  }, {} as Record<string, Operation[]>);

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons] || Database;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-rust-600" />
          <h2 className="text-lg font-semibold">Operations</h2>
          <span className="px-2 py-1 text-xs bg-rust-100 dark:bg-rust-900 text-rust-700 dark:text-rust-300 rounded-full">
            {filteredOperations.length}
          </span>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category} {category !== 'All' && `(${operationsByCategory[category]?.length || 0})`}
            </option>
          ))}
        </select>

        {/* Operations List */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {selectedCategory === 'All' ? (
            Object.entries(operationsByCategory).map(([category, ops]) => (
              <div key={category} className="slide-up">
                <div className="flex items-center space-x-2 mb-3">
                  {getCategoryIcon(category)}
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-xs text-gray-500">
                    {ops.length}
                  </span>
                </div>
                <div className="space-y-2 mb-6">
                  {ops.map(operation => (
                    <OperationItem
                      key={operation.name}
                      operation={operation}
                      isSelected={selectedOperation?.name === operation.name}
                      onSelect={() => onOperationSelect(operation)}
                      onAddToRecipe={() => onAddToRecipe(operation)}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-2">
              {filteredOperations.map(operation => (
                <OperationItem
                  key={operation.name}
                  operation={operation}
                  isSelected={selectedOperation?.name === operation.name}
                  onSelect={() => onOperationSelect(operation)}
                  onAddToRecipe={() => onAddToRecipe(operation)}
                />
              ))}
            </div>
          )}
          
          {filteredOperations.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No operations found</p>
              <p className="text-sm">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface OperationItemProps {
  operation: Operation;
  isSelected: boolean;
  onSelect: () => void;
  onAddToRecipe: () => void;
}

const OperationItem: React.FC<OperationItemProps> = ({
  operation,
  isSelected,
  onSelect,
  onAddToRecipe,
}) => {
  const formatOperationName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Encoding': 'text-blue-600 dark:text-blue-400',
      'Hashing': 'text-green-600 dark:text-green-400',
      'Crypto': 'text-purple-600 dark:text-purple-400',
      'Text': 'text-orange-600 dark:text-orange-400',
      'Data': 'text-pink-600 dark:text-pink-400',
    };
    return colors[category as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div
      className={`operation-item ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onSelect()}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {formatOperationName(operation.name)}
            </h4>
            <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 ${getCategoryColor(operation.category)}`}>
              {operation.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {operation.description}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToRecipe();
          }}
          className="ml-3 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-rust-100 dark:hover:bg-rust-900/50 text-rust-600 dark:text-rust-400"
          title="Add to recipe"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default OperationsList;
