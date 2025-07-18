//

export type WorkflowStatus = "draft" | "tested" | "deployed" | "error";
export type WorkflowActionStatus = "draft" | "tested" | "deployed" | "error";
export type WorkflowStepType = "trigger" | "action";
export type ConfigValue = string | number | boolean | undefined;

export type ParameterOption = {
  label: string;
  value: string;
};
export type ParameterType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "datetime"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"
  | "object"
  | "array"
  | "textarea"
  | "multiline"
  | "select";


// parameters

export interface ParameterField {
  name: string;                
  key: string;                 
  type: ParameterType;
  value?: ConfigValue;
  options?: string[];
  required?: boolean;
  description?: string;
}

export type ParametersSchema = ParameterField[];


// WORKFLOW

export interface WorkflowStepInput {
  ref_id: string;
  workflow_id: string;
  type: WorkflowStepType;
  status: WorkflowActionStatus;
  serviceActionId: string;      // ID de l’action du service (UUID)
  name: string;
  service: string;             
  lastExecution?: Date;
  config: ParametersSchema;
  order: number;
  trigger?: string;
  action?: string;
}

export interface WorkflowData {
  id?: string;
  name: string;
  status: WorkflowStatus;
  steps: WorkflowStepInput[];
  savedAt : Date;
  deployedAt?: Date;
}


//  ACTIONS TRIGGERS  SERVICES 

export interface ActionOrTrigger {
  serviceActionId: string;     
  identifier: string;          
  service_id: string;          
  name: string;                
  type: WorkflowStepType;
  parameters: ParametersSchema;
}

export interface Service {
  identifier: string;         
  name?: string;
  hasTriggers: boolean;
  hasActions: boolean;
}


