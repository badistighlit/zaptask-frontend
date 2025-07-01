import { WorkflowData } from "@/types/workflow";

interface WorkflowLogsProps {
  workflows: WorkflowData[]; // tu peux typer plus précisément si tu as des logs spécifiques
}

export default function WorkflowLogs({ workflows }: WorkflowLogsProps) {
    if (!workflows || workflows.length === 0) {
        return <p className="text-muted-foreground italic">Aucun log disponible pour le moment.</p>;
    }
    
  return (
    <pre className="bg-gray-100 text-xs p-3 rounded whitespace-pre-wrap max-h-48 overflow-auto">
      {`// Logs à implémenter
// [2025-07-01T12:34:56Z] Executed Trigger "New Email"
// [2025-07-01T12:34:58Z] Ran Action "Save to Notion"
// ...
`}
    </pre>
  );
}
