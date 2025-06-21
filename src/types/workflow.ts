export interface WorkflowStepInput {
  id: string; 
  type: "trigger" | "action";
  ref_id: string; 
  config: Record<string, unknown>; 
  order: number;
}

export interface WorkflowData {
  name: string;
  is_active?: boolean;
  steps: WorkflowStepInput[];
}


export interface ConfigSchemaField {
  description?: string;
  type?: string;
  required?: boolean;
}

export type ConfigSchema = Record<string, ConfigSchemaField>;

export interface Action {
  id: string;
  name: string;
  service_id: string;
  config_schema: ConfigSchema; 
}

export interface Trigger {
  id: string;
  name: string;
  service_id: string;
  config_schema: ConfigSchema; 
}

export interface Service {
  id: string;
  name: string;
  description?: string;
}


//import { Node } from "reactflow";
//import { CustomNodeData } from "@/app/workflowtest/CustomAlertNode";
//export type NodesState = Node<CustomNodeData>[];
//export type SetNodes = React.Dispatch<React.SetStateAction<NodesState>>;