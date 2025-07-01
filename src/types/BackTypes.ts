import { ParametersSchema, WorkflowData, WorkflowStepInput,  ParameterField, ParameterType } from "./workflow";

export interface BackendParam {
  parameter_name: string;
  parameter_key: string;
  parameter_type: ParameterType;
  options?: string[];
}

export interface BackendAction {
  id: string;
  workflow_id: string;
  status: "draft" | "deployed" | "error";
  execution_order: number;
  url: string;
  parameters: BackendParam[];
  last_executed_at?: string; 
}

export interface BackendWorkflow {
  id: string;
  name: string;
  status: "draft" | "deployed" | "error";
  actions: BackendAction[];
}

export function mapBackendParams(params: BackendParam[]): ParametersSchema {
  return params.map((p): ParameterField => ({
    name: p.parameter_name,
    key: p.parameter_key,
    type: p.parameter_type,
    options: p.options,
    value: undefined 
  }));
}

export function mapBackendActionToStep(action: BackendAction): WorkflowStepInput {
  return {
    id: action.id,
    workflow_id: action.workflow_id,
    type: "action", 
    service_id: "", 
    status: action.status,
    order: action.execution_order,
    lastExecution: action.last_executed_at ? new Date(action.last_executed_at) : undefined,
    config: mapBackendParams(action.parameters),
  };
}

export function mapBackendWorkflow(data: BackendWorkflow): WorkflowData {
  return {
    id: data.id,
    name: data.name,
    status: data.status,
    steps: data.actions.map(mapBackendActionToStep),
  };
}
