'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getWorkflowLogs } from "@/services/workflow";
import { WorkflowLogs } from "@/types/logs";
import WorkflowLogView from "../components/WorkflowLogView";

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
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Workflow Logs</h1>
        <div className="mt-3 inline-block bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg shadow-sm select-none">
          {data.name}
        </div>
        <hr className="mt-6 border-gray-200" />
      </header>

      <WorkflowLogView logs={data.logs} />
    </div>
  );
}
