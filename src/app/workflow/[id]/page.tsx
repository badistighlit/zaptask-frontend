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

  if (loading) return <div>Chargement du workflow...</div>;
  if (!workflowData) return <div>Workflow introuvable</div>;
  //console.log("Workflow Data:", workflowData);

  return <CustomFlow existingWorkflow={workflowData} />;
}
