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
    return <p className="text-gray-400 italic text-center">Aucun brouillon disponible.</p>;
  }

  return (
    <ul
      className="space-y-2 text-sm max-h-48 overflow-auto 
                 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100
                 rounded-md bg-indigo-50 p-2 shadow-inner"
    >
      {drafts.map((wf) => (
        <li
          key={wf.id}
          className="flex justify-between items-center bg-white border border-indigo-200 rounded-md p-2
                     hover:bg-indigo-100 transition cursor-pointer select-text"
          title={`Workflow: ${wf.name}`}
          onClick={() => router.push(`/workflow/${wf.id}`)}
        >
          <span className="truncate max-w-[70%] font-semibold text-indigo-900">{wf.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/workflow/${wf.id}`);
            }}
            className="flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:text-indigo-800
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 transition"
            aria-label={`Éditer le workflow ${wf.name}`}
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
