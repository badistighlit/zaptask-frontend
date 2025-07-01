//workflow
export type WorkflowStatus = "draft" | "deployed" | "error";
export type WorkflowStepType = "trigger" | "action";

export interface WorkflowStepInput {
  id: string;
  workflow_id: string;
  type: WorkflowStepType;
  status: WorkflowStatus;
  service_id: string;
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


//configuration parametres
export type ConfigValue = string | number | boolean | undefined;

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
  | "week";


//export type httpRequestParametreType = "body" |"query" |"url";

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




//old version configuration
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

//Action,service,trigger

export interface ActionOrTrigger {
  identifier: string;
  service_id : string;
  name: string;
  type: "trigger" | "action";
  parameters: ParametersSchema; 

}


export interface Service {
  identifier: string;
  name?: string;
}





//import { Node } from "reactflow";
//import { CustomNodeData } from "@/app/workflowtest/CustomAlertNode";
//export type NodesState = Node<CustomNodeData>[];
//export type SetNodes = React.Dispatch<React.SetStateAction<NodesState>>;