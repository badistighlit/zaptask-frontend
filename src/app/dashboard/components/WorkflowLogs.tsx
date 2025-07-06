import { WorkflowData } from "@/types/workflow";

interface WorkflowLogsProps {
  workflows: WorkflowData[]; // à typer plus précisément selon tes logs réels
}

export default function WorkflowLogs({ workflows }: WorkflowLogsProps) {
  if (!workflows || workflows.length === 0) {
    return (
      <p className="text-gray-400 italic text-center">
        Aucun log disponible pour le moment.
      </p>
    );
  }

  return (
    <pre
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                 text-sm font-mono p-4 rounded-lg max-h-56 overflow-auto 
                 shadow-lg ring-1 ring-gray-700"
      aria-label="Logs des workflows"
    >
      <code>
        <span className="text-cyan-400"> Exemple de logs (a IMPLEMENT  POUR DE  vrais)</span>{"\n"}
        <span>
          <span className="text-gray-500">[2025-07-01T12:34:56Z]</span>{" "}
          <span className="text-green-400">Executed Trigger</span>{" "}
          <span className="text-yellow-300">New Email</span>
        </span>
        {"\n"}
        <span>
          <span className="text-gray-500">[2025-07-01T12:34:58Z]</span>{" "}
          <span className="text-green-400">Ran Action</span>{" "}
          <span className="text-yellow-300">Save to Notion</span>
        </span>
        {"\n"}
        <span>
          <span className="text-gray-500">[2025-07-01T12:35:05Z]</span>{" "}
          <span className="text-red-500 font-bold">Error:</span>{" "}
          <span className="text-red-400">Failed to connect to API</span>
        </span>
      </code>
    </pre>
  );
}
