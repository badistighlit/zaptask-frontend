import { WorkflowData } from "@/types/workflow";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeployedWorkflowsProps {
  workflows: WorkflowData[];
}

export default function DeployedWorkflows({ workflows }: DeployedWorkflowsProps) {
  const router = useRouter();

  const deployed = workflows.filter((wf) => wf.status === "deployed").slice(0, 5);

  if (deployed.length === 0) {
    return <p className="text-muted-foreground italic">Aucun workflow déployé.</p>;
  }

  return (
    <ul className="space-y-2 text-sm max-h-48 overflow-auto">
      {deployed.map((wf) => (
        <li key={wf.id} className="flex justify-between items-center">
          <span>{wf.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/workflow/${wf.id}`);
            }}
            className="text-green-600 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
          >
        <Edit size={16} />

            Éditer
          </button>
        </li>
      ))}
    </ul>
  );
}
