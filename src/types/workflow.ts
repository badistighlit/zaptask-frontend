//workflow
export interface WorkflowStepInput {
  id: string; 
  workflow_id : string;

  type: "trigger" | "action";
  service:string;
  ref_id: string; 
  config: Record<string, ConfigValue>;
  order: number;
}

export interface WorkflowData {
  id? : string;
  name: string;
  is_active?: boolean;
  userId : string;
  steps: WorkflowStepInput[];
}

//configuration parametres
export type parametreType =
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

export interface parametreField  {
  name : string;
  type : parametreType;
  value?: string;
  key : string;
  
 // httpRequestParametre : httpRequestParametreType;
  options ? : string[]

}

export type parametersSchema = parametreField[];




//old version configuration


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

//Action,service,trigger

export interface ActionOrTrigger {
  identifier: string;
  service_id : string;
  name: string;
  type: "trigger" | "action";
  config_schema: ConfigSchema; 
  parameters: parametersSchema; 

}


export interface Service {
  identifier: string;
  name?: string;
}





//import { Node } from "reactflow";
//import { CustomNodeData } from "@/app/workflowtest/CustomAlertNode";
//export type NodesState = Node<CustomNodeData>[];
//export type SetNodes = React.Dispatch<React.SetStateAction<NodesState>>;