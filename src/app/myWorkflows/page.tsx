"use client";

import { useEffect, useState } from "react";
import { fetchWorkflowsByUser } from "@/services/workflow";
import { WorkflowData } from "@/types/workflow";
import WorkflowCard from "./components/WorkflowCard";

export default function MyWorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);

  useEffect(() => {
    async function load() {
      const response = await fetchWorkflowsByUser();
      if (Array.isArray(response)) {
        setWorkflows(response);
      }
    }
    load();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Mes Workflows</h1>

      {workflows.length === 0 ? (
        <p className="text-gray-500">Aucun workflow pour le moment.</p>
      ) : (
        workflows.map((wf) => <WorkflowCard key={wf.id} workflow={wf} />)
      )}
    </div>
  );
}
