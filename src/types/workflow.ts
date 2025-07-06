//

export type WorkflowStatus = "draft" | "deployed" | "error";
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
  |"textarea" ;


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
  ref_id: any;
  workflow_id: string;
  type: WorkflowStepType;
  status: WorkflowStatus;
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
}


// 

/*
export type ConfigValue = string | number | boolean | Date;

export interface ConfigSchemaField {
  description?: string;
  type: "string" | "number" | "boolean" | "date";
  required?: boolean;
}

export type ConfigSchema = Record<string, ConfigSchemaField>;

export function validateConfig(
  config: Record<string, unknown>,
  schema: ConfigSchema
): boolean {
  return Object.entries(schema).every(([key, def]) => {
    const value = config[key];

    if (def.required && (value === undefined || value === null)) return false;

    switch (def.type) {
      case "string": return typeof value === "string";
      case "number": return typeof value === "number";
      case "boolean": return typeof value === "boolean";
      case "date": return value instanceof Date || typeof value === "string";
      default: return true;
    }
  });
}
*/
