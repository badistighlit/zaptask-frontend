import { parametersSchema, parametreType, parametreField, WorkflowData } from "./workflow";

interface BackendParam {
  parameter_name: string;
  parameter_key: string;
  parameter_type: parametreType;
  options?: string[];
}

interface UpdateAction {
  id?: string;
  service_action_id: string;
  workflow_id: string;
  parameters: Record<string, any>;
  execution_order: number;
}

interface UpdateWorkflowPayload {
  name: string;
  actions: UpdateAction[];
}

function buildUpdatePayload(workflow: WorkflowData): UpdateWorkflowPayload {
  return {
    name: workflow.name,
    actions: workflow.steps.map(step => ({
      id: step.id,
      service_action_id: step.ref_id, 
      workflow_id: step.workflow_id,
      parameters: step.config,
      execution_order: step.order,
    }))
  };
}



export function mapBackendParams(params: BackendParam[]): parametersSchema {
  return params.map((p): parametreField => ({
    name: p.parameter_name,
    key: p.parameter_key,
    type: p.parameter_type,
    options: p.options,
  }));
}
