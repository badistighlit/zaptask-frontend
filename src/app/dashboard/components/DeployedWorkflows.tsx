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
    return (
      <p className="text-gray-400 italic text-center py-4 select-none">
        No workflow deployed.
      </p>
    );
  }

  return (
    <ul
      className="space-y-2 text-sm max-h-48 overflow-auto
                 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-50
                 rounded-md bg-white p-2"
    >
      {deployed.map((wf) => (
        <li
          key={wf.id}
          className="flex justify-between items-center bg-white border border-green-100 rounded-md p-2
                     hover:bg-green-50 transition cursor-pointer select-text"
          title={`Workflow: ${wf.name}`}
          onClick={() => router.push(`/workflow/${wf.id}`)}
        >
          <span className="truncate max-w-[70%] font-medium text-gray-800">{wf.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/workflows/${wf.id}`);
            }}
            className="flex items-center gap-1 text-green-600 font-semibold text-sm hover:text-green-800
                       focus:outline-none focus:ring-2 focus:ring-green-400 rounded px-2 py-1 transition"
            aria-label={`Édit ${wf.name}`}
          >
            <Edit size={16} />
            <span>Éditer</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
