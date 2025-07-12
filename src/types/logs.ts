import { ParameterField } from "./workflow";

export interface WorkflowLog {
  id: string;
  actionId: string;
  actionName: string;
  serviceName: string;
  status: "success" | "error";
  httpCode: string;
  exception?: string;
  url?: string | null;
  parameters: ParameterField[];
  executedAt: Date;
  type: "action" | "trigger";
}

export interface WorkflowLogs {
  workflowId: string;
  name : string;
  logs: WorkflowLog[];
}
