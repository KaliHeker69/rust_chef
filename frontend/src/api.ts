import { Operation, OperationRequest, OperationResponse } from './types';

const API_BASE = '/api';

export async function fetchOperations(): Promise<Operation[]> {
  const response = await fetch(`${API_BASE}/operations`);
  if (!response.ok) {
    throw new Error('Failed to fetch operations');
  }
  return response.json();
}

export async function executeOperation(request: OperationRequest): Promise<OperationResponse> {
  const response = await fetch(`${API_BASE}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error('Failed to execute operation');
  }
  
  return response.json();
}
