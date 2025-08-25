import { useState, useEffect } from 'react';
import { Operation, OperationRequest, RecipeStep } from './types';
import { fetchOperations, executeOperation } from './api';
import Header from './components/Header';
import OperationsList from './components/OperationsList';
import InputOutput from './components/InputOutput';
import Recipe from './components/Recipe';

function App() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [recipe, setRecipe] = useState<RecipeStep[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  useEffect(() => {
    setConnectionStatus('connecting');
    fetchOperations()
      .then(ops => {
        setOperations(ops);
        setConnectionStatus('connected');
      })
      .catch(err => {
        setError(err.message);
        setConnectionStatus('disconnected');
      });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleOperationSelect = async (operation: Operation) => {
    setSelectedOperation(operation);
    setError('');

    if (!input.trim()) {
      setError('Please enter some input data');
      return;
    }

    setLoading(true);
    try {
      const request: OperationRequest = {
        operation: operation.name,
        input: input,
        parameters: {},
      };

      const response = await executeOperation(request);
      
      if (response.success && response.output) {
        setOutput(response.output);
        setError('');
      } else {
        setError(response.error || 'Operation failed');
        setOutput('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  const addToRecipe = (operation: Operation) => {
    const newStep: RecipeStep = {
      id: Date.now().toString(),
      operation: operation.name,
      parameters: {},
      enabled: true,
    };
    setRecipe([...recipe, newStep]);
  };

  const removeFromRecipe = (stepId: string) => {
    setRecipe(recipe.filter(step => step.id !== stepId));
  };

  const executeRecipe = async () => {
    if (!input.trim()) {
      setError('Please enter some input data');
      return;
    }

    setLoading(true);
    setError('');
    
    let currentInput = input;
    
    try {
      for (const step of recipe.filter(s => s.enabled)) {
        const request: OperationRequest = {
          operation: step.operation,
          input: currentInput,
          parameters: step.parameters,
        };

        const response = await executeOperation(request);
        
        if (response.success && response.output) {
          currentInput = response.output;
        } else {
          throw new Error(response.error || `Step ${step.operation} failed`);
        }
      }
      
      setOutput(currentInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recipe execution failed');
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const moveOutputToInput = () => {
    setInput(output);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setRecipe([]);
    setSelectedOperation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-rust-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        connectionStatus={connectionStatus}
        operationsCount={operations.length}
        onClearAll={clearAll}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Operations Panel */}
          <div className="xl:col-span-3">
            <OperationsList
              operations={operations}
              onOperationSelect={handleOperationSelect}
              onAddToRecipe={addToRecipe}
              selectedOperation={selectedOperation}
            />
          </div>

          {/* Main Content */}
          <div className="xl:col-span-6 space-y-6">
            <InputOutput
              input={input}
              output={output}
              error={error}
              loading={loading}
              onInputChange={setInput}
              onCopyOutput={() => copyToClipboard(output)}
              onMoveOutputToInput={moveOutputToInput}
            />
          </div>

          {/* Recipe Panel */}
          <div className="xl:col-span-3">
            <Recipe
              recipe={recipe}
              operations={operations}
              onRemoveStep={removeFromRecipe}
              onExecute={executeRecipe}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
