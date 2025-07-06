import {
  ParametersSchema,
  ParameterField,
  ParameterType,
  WorkflowData,
  WorkflowStepInput,
} from "./workflow";


// Lecture 


export interface BackendParam {
  parameter_name: string;
  parameter_key: string;
  parameter_type: ParameterType;
  parameter_value?: string;
  options?: string[];
  required?: boolean;
  description?: string;
}

export interface BackendService {
  identifier: string;
  name: string;
}

export interface BackendServiceAction {
  id: string;
  name: string;
  identifier: string;
  type: "trigger" | "action";
  parameters: BackendParam[];
}

export interface BackendWorkflowAction {
  id: string;
  workflow_id: string;
  service_action_id: string;
  identifier: string;
  name: string;
  service: {
    identifier: string;
    name: string;
  };
  type: "trigger" | "action";
  status: "draft" | "deployed" | "error";
  execution_order: number;
  url: string;
  parameters: BackendParam[];
  last_executed_at?: string | null;
}

export interface BackendWorkflow {
  id: string;
  name: string;
  status: "draft" | "deployed" | "error";
  actions: BackendWorkflowAction[];
  saved_at: string | null;
  deployed_at: string | null;
}


// create / update 


export interface PushWorkflowAction {
  service_action_id: string;
  identifier: string;
  parameters: { [key: string]: string }; 
  execution_order: number;
}

export interface PushWorkflow {
  name: string;
  actions: PushWorkflowAction[];
}



//
// mappers backend → frontend
// 

export function mapBackendParams(params: BackendParam[]): ParametersSchema {
  return params.map((p): ParameterField => ({
    name: p.parameter_name,
    key: p.parameter_key,
    type: p.parameter_type,
    options: p.options,
    required: p.required,
    description: p.description,
    value: p.parameter_value ?? undefined,
  }));
}


// * avoir par la siute
/*
export function mapBackendActionToStep(action: BackendWorkflowAction): WorkflowStepInput {
  return {
    workflow_id: action.workflow_id,
    serviceActionId: action.service_action_id,
    type: action.type,
    status: action.status,
    name: action.name,
    service: action.service.identifier,
    order: action.execution_order,
    config: mapBackendParams(action.parameters),
    lastExecution: action.last_executed_at ? new Date(action.last_executed_at) : undefined,
    trigger: action.type === "trigger" ? action.identifier : undefined, 
    action: action.type === "action" ? action.identifier : undefined,   
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
  */

// 
// mappers frontend → backend 
// 

export function mapStepToPushAction(step: WorkflowStepInput): PushWorkflowAction {
  const parameters: Record<string, string> = {};

  for (const param of step.config) {
    if (param.key && param.value !== undefined) {
      parameters[param.key] = String(param.value);
    }
  }

  return {
    service_action_id: step.serviceActionId,
    identifier: step.type === "trigger" ? step.trigger || "" : step.action || "",
    parameters,
    execution_order: step.order,
  };
}

export function mapWorkflowToPush(workflow: WorkflowData): PushWorkflow {
  return {
    name: workflow.name,
    actions: workflow.steps.map(mapStepToPushAction),
  };
}
