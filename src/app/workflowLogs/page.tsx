"use client";

import { useEffect, useState } from "react";
import { fetchWorkflowsByUser } from "@/services/workflow";
import WorkflowList from "./components/WorkflowList";
import { WorkflowData } from "@/types/workflow";

export default function LogsPage() {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowsByUser()
      .then((data) => setWorkflows(data))
      .catch(() => setWorkflows([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <p className="text-lg font-medium">Chargement des workflows...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Workflow Logs</h1>
      <WorkflowList
       workflows={workflows} 
         onDelete={(id) => {
            setWorkflows((prev) => prev.filter((w) => w.id !== id));
                }}
   />
    </div>
  );
}
