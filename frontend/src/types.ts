export interface Operation {
  name: string;
  category: string;
  description: string;
  parameters: Parameter[];
}

export interface Parameter {
  name: string;
  param_type: string;
  description: string;
  required: boolean;
  default_value?: string;
}

export interface OperationRequest {
  operation: string;
  input: string;
  parameters?: Record<string, string>;
}

export interface OperationResponse {
  success: boolean;
  output?: string;
  error?: string;
}

export interface RecipeStep {
  id: string;
  operation: string;
  parameters: Record<string, string>;
  enabled: boolean;
}
