import React, { useState } from 'react';
import { Trash2, Play, GripVertical, ChefHat, Save, Upload, ArrowDown, Clock, X } from 'lucide-react';
import { RecipeStep, Operation } from '../types';

interface RecipeProps {
  recipe: RecipeStep[];
  operations: Operation[];
  onRemoveStep: (stepId: string) => void;
  onExecute: () => void;
  loading: boolean;
}

interface SavedRecipe {
  id: string;
  name: string;
  description: string;
  steps: RecipeStep[];
  created: Date;
  lastUsed?: Date;
}

const Recipe: React.FC<RecipeProps> = ({
  recipe,
  operations,
  onRemoveStep,
  onExecute,
  loading,
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);

  const getOperationName = (operationId: string) => {
    const operation = operations.find(op => op.name === operationId);
    return operation 
      ? operation.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : operationId;
  };

  const getOperationCategory = (operationId: string) => {
    const operation = operations.find(op => op.name === operationId);
    return operation?.category || 'Unknown';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Encoding': '🔤',
      'Hashing': '🔒',
      'Crypto': '🛡️',
      'Text': '📝',
      'Data': '📊',
    };
    return icons[category] || '⚙️';
  };

  const saveRecipe = () => {
    if (!recipeName.trim() || recipe.length === 0) return;
    
    const newRecipe: SavedRecipe = {
      id: Date.now().toString(),
      name: recipeName.trim(),
      description: recipeDescription.trim(),
      steps: [...recipe],
      created: new Date(),
    };
    
    setSavedRecipes(prev => [...prev, newRecipe]);
    setRecipeName('');
    setRecipeDescription('');
    setShowSaveDialog(false);
  };

  const exportRecipe = (recipe: SavedRecipe) => {
    const blob = new Blob([JSON.stringify(recipe, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Recipe Panel */}
      <div className="card fade-in">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-5 w-5 text-rust-600" />
              <h2 className="text-lg font-semibold">Recipe</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {recipe.length} step{recipe.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {recipe.length > 0 && (
                <>
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    title="Save Recipe"
                  >
                    <Save className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => setShowSavedRecipes(!showSavedRecipes)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    title="Saved Recipes"
                  >
                    <Upload className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {recipe.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <ChefHat className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No operations in recipe</p>
              <p className="text-xs mt-1">Add operations from the list to create a recipe</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                {recipe.map((step, index) => (
                  <div key={step.id} className="group">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      
                      <div className="flex-shrink-0 w-8 h-8 bg-rust-100 dark:bg-rust-900/30 rounded-full flex items-center justify-center text-sm font-medium text-rust-700 dark:text-rust-300">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {getCategoryIcon(getOperationCategory(step.operation))}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {getOperationName(step.operation)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                            {getOperationCategory(step.operation)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveStep(step.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="Remove step"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {index < recipe.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={onExecute}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>{loading ? 'Executing Recipe...' : 'Execute Recipe'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Save Recipe Dialog */}
      {showSaveDialog && (
        <div className="card fade-in border-2 border-rust-200 dark:border-rust-700">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Save Recipe</h3>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="Recipe name..."
              className="input w-full"
              autoFocus
            />
            
            <textarea
              value={recipeDescription}
              onChange={(e) => setRecipeDescription(e.target.value)}
              placeholder="Recipe description (optional)..."
              className="textarea w-full h-20 resize-none"
            />
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={saveRecipe}
                disabled={!recipeName.trim()}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Save Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Recipes */}
      {showSavedRecipes && (
        <div className="card fade-in">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Saved Recipes</h3>
              <button
                onClick={() => setShowSavedRecipes(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {savedRecipes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Save className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No saved recipes</p>
                <p className="text-sm">Create and save recipes to use them later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedRecipes.map((savedRecipe) => (
                  <div
                    key={savedRecipe.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-medium">{savedRecipe.name}</h5>
                        {savedRecipe.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {savedRecipe.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => exportRecipe(savedRecipe)}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          title="Export Recipe"
                        >
                          <Upload className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => setSavedRecipes(prev => prev.filter(r => r.id !== savedRecipe.id))}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                          title="Delete Recipe"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span>{savedRecipe.steps.length} operations</span>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {savedRecipe.created.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        // Load recipe logic would go here
                        setShowSavedRecipes(false);
                      }}
                      className="btn-primary w-full"
                    >
                      Load Recipe
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipe;
