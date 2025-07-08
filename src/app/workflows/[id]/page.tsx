"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchWorkflowById } from "@/services/workflow";
import WorkflowBuilder from "../components/WorkflowBuilder";
import { WorkflowData } from "@/types/workflow";

export default function WorkflowPage() {
  const params = useParams();
  const workflowId = params?.id as string | undefined;

  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workflowId) return;

    fetchWorkflowById(workflowId)
      .then((data) => setWorkflow(data))
      .catch(() => setWorkflow(null))
      .finally(() => setLoading(false));
  }, [workflowId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-600">
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-lg font-medium">Chargement du workflow...</p>
      </div>
    );
  }

  if (!workflow) return <div className="p-8 text-center text-red-600">Workflow introuvable</div>;

  return <WorkflowBuilder initialWorkflow={workflow} />;
}
