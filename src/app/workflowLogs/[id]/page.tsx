'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getWorkflowLogs } from "@/services/workflow";
import { WorkflowLogs } from "@/types/logs";
import WorkflowLogView from "../components/WorkflowLogView";
import { Edit } from "lucide-react";
import router from "next/router";

export default function LogsDetailPage() {
  const params = useParams();
  const workflowId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [data, setData] = useState<WorkflowLogs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workflowId) return;

    getWorkflowLogs(workflowId)
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [workflowId]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Workflow not found</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
<header className="mb-8 flex justify-between items-start">
  <div>
    <h1 className="text-4xl font-bold text-gray-900">Workflow Logs</h1>
    <div className="mt-3 inline-block bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg shadow-sm select-none">
      {data.name}
    </div>
  </div>

  <button
    onClick={(e) => {
      e.stopPropagation();
      router.push(`/workflows/${workflowId}`);
    }}
    className="
      flex items-center gap-2 px-4 py-2 rounded-2xl
      bg-indigo-50 text-indigo-700
      font-semibold
      hover:bg-indigo-100
      focus:outline-none focus:ring-2 focus:ring-indigo-400
      shadow-sm
      transition
    "
    aria-label={`Edit workflow`}
  >
    <Edit className="w-5 h-5" />
    Edit
  </button>
</header>

      <WorkflowLogView logs={data.logs} />
    </div>
  );
}
