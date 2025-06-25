//workflow
export interface WorkflowStepInput {
  id: string; 
  type: "trigger" | "action";
  service:string;
  ref_id: string; 
  config: Record<string, ConfigValue>;
  order: number;
}

export interface WorkflowData {
  name: string;
  is_active?: boolean;
  userId : string;
  steps: WorkflowStepInput[];
}

//configuration parametres
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
      case "date": return value instanceof Date || typeof value === "string"; // string acceptable si ISO date
      default: return true;
    }
  });
}

//Action,service,trigger

export interface ActionOrTrigger {
  identifier: string;
  name: string;
  type: "trigger" | "action";
  config_schema: ConfigSchema; 
  parameters: { [key: string]: unknown }[]; // temporairement permissif

}


export interface Service {
  identifier: string;
  name?: string;
}





//import { Node } from "reactflow";
//import { CustomNodeData } from "@/app/workflowtest/CustomAlertNode";
//export type NodesState = Node<CustomNodeData>[];
//export type SetNodes = React.Dispatch<React.SetStateAction<NodesState>>;