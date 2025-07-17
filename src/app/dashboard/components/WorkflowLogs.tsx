import { WorkflowData } from "@/types/workflow";
import { useEffect, useState } from "react";
import { getWorkflowLogs } from "@/services/workflow";
import { WorkflowLog } from "@/types/logs";
import { useRouter } from "next/navigation";

interface WorkflowLogsProps {
  workflows: WorkflowData[];
}

export default function WorkflowLogs({ workflows }: WorkflowLogsProps) {
  const [logs, setLogs] = useState<WorkflowLog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [latestWorkflowId, setLatestWorkflowId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!workflows || workflows.length === 0) {
      setLoading(false);
      return;
    }

    const sortedByDeployment = [...workflows]
      .filter((wf) => wf.deployedAt)
      .sort((a, b) => new Date(b.deployedAt!).getTime() - new Date(a.deployedAt!).getTime());

    const latestWorkflow = sortedByDeployment[0];

    if (!latestWorkflow || !latestWorkflow.id) {
      setLoading(false);
      return;
    }

    setLatestWorkflowId(latestWorkflow.id);

    getWorkflowLogs(latestWorkflow.id)
      .then((res) => {
        if (res && Array.isArray(res.logs)) {
          setLogs(res.logs);
        } else {
          setLogs(null);
        }
      })
      .catch(() => setLogs(null))
      .finally(() => setLoading(false));
  }, [workflows]);

  if (loading) {
    return <p className="text-gray-400 italic text-center">Chargement des logs...</p>;
  }

if (!workflows || workflows.length === 0) {
  return <p className="text-gray-400 italic text-center">No workflows found.</p>;
}

if (!latestWorkflowId) {
  return <p className="text-gray-400 italic text-center">No deployed workflow available.</p>;
}

if (!logs || logs.length === 0) {
  return <p className="text-gray-400 italic text-center">No logs available for the deployed workflow.</p>;
}


  return (
    <div
      onClick={() => router.push(`/workflowLogs/${latestWorkflowId}`)}
      className="cursor-pointer"
    >
      <pre
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                   text-sm font-mono p-4 rounded-lg max-h-56 overflow-auto 
                   shadow-lg ring-1 ring-gray-700 hover:ring-2 hover:ring-indigo-400 transition"
        aria-label="Logs des workflows"
      >
        <code>
          {logs.map((log) => (
            <div key={log.id}>
              <span className="text-gray-500">[{new Date(log.executedAt).toISOString()}]</span>{" "}
              <span className="text-green-400">{log.type === "trigger" ? "Executed Trigger" : "Ran Action"}</span>{" "}
              <span className="text-yellow-300">{log.actionName}</span>
              {log.exception && (
                <>
                  {"\n"}
                  <span className="text-red-500 font-bold">Error:</span>{" "}
                  <span className="text-red-400">{log.exception}</span>
                </>
              )}
              {"\n"}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
