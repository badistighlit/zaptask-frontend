export interface WorkflowStats {
  total: number;
  statuses: {
    label: string;
    count: number;
    percent: number;
  }[];
  monthlyCounts: {
    month: string;
    count: number;
  }[];
}

export interface ActionStats {
  total: number;
  statuses: {
    label: string;
    count: number;
    percent: number;
  }[];
}

export interface ExecutionStats {
  total: number;
  statuses: {
    label: string;
    count: number;
    percent: number;
  }[];
  lastErrors: {
    actionId: string;
    message: string;
    executedAt: string;
  }[];
}

export interface FrontStatsData {
  workflows: WorkflowStats;
  actions: ActionStats;
  executions: ExecutionStats;
  usedServices: string[];
}
