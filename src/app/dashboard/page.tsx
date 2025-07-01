"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, PlayCircle, Edit, PlusCircle } from "lucide-react";
import { fetchWorkflowsByUser } from "@/services/workflow";
import { WorkflowData } from "@/types/workflow";
import DeployedWorkflows from "./components/DeployedWorkflows";
import WorkflowLogs from "./components/WorkflowLogs";
import DraftWorkflows from "./components/DraftWorkflows";

export default function DashboardPage() {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchWorkflowsByUser()
      .then((data) => setWorkflows(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center text-lg">Loading...</div>;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Brouillons */}
        <div
          tabIndex={0}
          role="button"
          onClick={() => router.push("/myworkflows")}
          onKeyDown={(e) => e.key === "Enter" && router.push("/myworkflows")}
          className="cursor-pointer rounded-xl border border-gray-300 p-6 flex flex-col shadow-md
                     hover:shadow-xl hover:scale-[1.03] transition-transform duration-200 ease-in-out
                     focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Edit size={40} className="text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold">Brouillons</h3>
              <p className="text-gray-600">
                {workflows.filter((wf) => wf.status === "draft").length} brouillon(s)
              </p>
            </div>
          </div>
          <DraftWorkflows workflows={workflows} />
        </div>

        {/* Déployés */}
        <div
          tabIndex={0}
          role="button"
          onClick={() => router.push("/myworkflows")}
          onKeyDown={(e) => e.key === "Enter" && router.push("/myworkflows")}
          className="cursor-pointer rounded-xl border border-gray-300 p-6 flex flex-col shadow-md
                     hover:shadow-xl hover:scale-[1.03] transition-transform duration-200 ease-in-out
                     focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          <div className="flex items-center space-x-4 mb-4">
            <PlayCircle size={40} className="text-green-600" />
            <div>
              <h3 className="text-xl font-semibold">Déployés</h3>
              <p className="text-gray-600">
                {workflows.filter((wf) => wf.status === "deployed").length} workflow(s) déployé(s)
              </p>
            </div>
          </div>
          <DeployedWorkflows workflows={workflows} />
        </div>

        {/* Logs */}
        <div
          tabIndex={0}
          role="button"
          onClick={() => router.push("/logs")}
          onKeyDown={(e) => e.key === "Enter" && router.push("/logs")}
          className="cursor-pointer rounded-xl border border-gray-300 p-6 flex flex-col shadow-md
                     hover:shadow-xl hover:scale-[1.03] transition-transform duration-200 ease-in-out
                     focus:outline-none focus:ring-4 focus:ring-gray-400"
        >
          <div className="flex items-center space-x-4 mb-4">
            <FileText size={40} className="text-gray-700" />
            <div>
              <h3 className="text-xl font-semibold">Logs</h3>
              <p className="text-gray-600">Voir les logs des workflows</p>
            </div>
          </div>
          <WorkflowLogs workflows={workflows} />
        </div>

        {/* Créer un workflow */}
        <div
          tabIndex={0}
          role="button"
          onClick={() => router.push("/workflow")}
          onKeyDown={(e) => e.key === "Enter" && router.push("/workflow")}
          className="cursor-pointer rounded-xl border border-gray-300 p-6 flex flex-col
                     items-center justify-center text-center shadow-md
                     hover:shadow-xl hover:scale-[1.03] transition-transform duration-200 ease-in-out
                     focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          <PlusCircle size={40} className="text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold">Créer un workflow</h3>
          <p className="text-gray-600 mt-2">Démarrer un nouveau workflow</p>
        </div>
      </div>
    </div>
  );
}
