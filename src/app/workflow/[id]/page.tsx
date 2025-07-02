"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CustomFlow from "../components/WorkFlowBuilder";
import { fetchWorkflowById } from "@/services/workflow";
import { WorkflowData } from "@/types/workflow";

export default function WorkflowIdPage() {
  const params = useParams() as Record<string, string | string[]> | null;

  const id = params?.id;
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const loadWorkflow = async () => {
      try {
        const data = await fetchWorkflowById(id);
        setWorkflowData(data);
      } catch (error) {
        console.error("Erreur lors du chargement du workflow :", error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkflow();
  }, [id]);

  if (loading)
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
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p className="text-lg font-medium">Chargement du workflow...</p>
    </div>
  );
  
  if (!workflowData) return <div>Workflow introuvable</div>;
  //console.log("Workflow Data:", workflowData);

  return <CustomFlow existingWorkflow={workflowData} />;
}
