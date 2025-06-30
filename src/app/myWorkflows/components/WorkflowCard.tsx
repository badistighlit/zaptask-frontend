"use client";

import { WorkflowData } from "@/types/workflow";
import { BadgeCheck, Edit, Workflow, Captions } from "lucide-react";
import Link from "next/link";

interface Props {
  workflow: WorkflowData;
}

export default function WorkflowCard({ workflow }: Props) {
  const isDeployed = workflow.status === "deployed";

  return (
    <div className="flex items-center justify-between border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white">
      <div className="flex items-center gap-4">
        {/* Logo workflow */}
        <Workflow className="w-10 h-10 text-indigo-600" />

        <div>
          <h3 className="text-lg font-semibold">{workflow.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            {isDeployed ? (
              <span className="flex items-center text-green-600 font-medium">
                <BadgeCheck className="w-4 h-4 mr-1" />
                Déployé
              </span>
            ) : (
              <span className="text-gray-500 font-medium">Brouillon</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/workflow/${workflow.id}`}>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition">
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </Link>

        <Link href={`/logs/${workflow.id}`}>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
            <Captions className="w-4 h-4" />
            Logs
          </button>
        </Link>
      </div>
    </div>
  );
}
