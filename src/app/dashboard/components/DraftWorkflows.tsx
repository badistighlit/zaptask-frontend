import { WorkflowData } from "@/types/workflow";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

interface DraftWorkflowsProps {
  workflows: WorkflowData[];
}

export default function DraftWorkflows({ workflows }: DraftWorkflowsProps) {
  const router = useRouter();

  const drafts = workflows.filter((wf) => wf.status === "draft").slice(0, 5);

  if (drafts.length === 0) {
    return <p className="text-muted-foreground italic">Aucun brouillon disponible.</p>;
  }

  return (
    <ul className="space-y-2 text-sm max-h-48 overflow-auto">
      {drafts.map((wf) => (
        <li key={wf.id} className="flex justify-between items-center">
          <span>{wf.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/workflow/${wf.id}`);
            }}
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded flex items-center gap-1"
          >
            <Edit size={16} />
            Edit
          </button>
        </li>
      ))}
    </ul>
  );
}
