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
      .then((data) => {
        if (Array.isArray(data)) {
          setWorkflows(data);
        } else {
          console.warn("fetchWorkflowsByUser a retourné autre chose qu'un tableau :", data);
          setWorkflows([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-lg text-indigo-600 font-semibold">
        Chargement...
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-10 text-gray-900 select-none">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 gap-y-10">
        {/* Brouillons */}
        <div
          tabIndex={0}
          role="button"
          onClick={() => router.push("/myworkflows")}
          onKeyDown={(e) => e.key === "Enter" && router.push("/myworkflows")}
          className="cursor-pointer rounded-2xl border border-indigo-300 p-6 flex flex-col shadow-md
                     hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out
                     focus:outline-none focus:ring-4 focus:ring-indigo-400 bg-gradient-to-tr from-indigo-50 to-white"
          aria-label="Accéder aux brouillons"
        >
          <div className="flex items-center space-x-5 mb-5">
            <Edit size={44} className="text-indigo-600" />
            <div>
              <h3 className="text-2xl font-semibold text-indigo-900 select-text">
                Brouillons
              </h3>
              <p className="text-indigo-700 font-medium mt-1 select-text">
                {Array.isArray(workflows)
                  ? workflows.filter((wf) => wf.status === "draft").length
                  : 0}
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
          className="cursor-pointer rounded-2xl border border-green-300 p-6 flex flex-col shadow-md
                     hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out
                     focus:outline-none focus:ring-4 focus:ring-green-400 bg-gradient-to-tr from-green-50 to-white"
          aria-label="Accéder aux workflows déployés"
        >
          <div className="flex items-center space-x-5 mb-5">
            <PlayCircle size={44} className="text-green-600" />
            <div>
              <h3 className="text-2xl font-semibold text-green-900 select-text">
                Déployés
              </h3>
              <p className="text-green-700 font-medium mt-1 select-text">
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
          className="cursor-pointer rounded-2xl border border-gray-400 p-6 flex flex-col shadow-md
                     hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out
                     focus:outline-none focus:ring-4 focus:ring-gray-500 bg-gradient-to-tr from-gray-100 to-white"
          aria-label="Accéder aux logs des workflows"
        >
          <div className="flex items-center space-x-5 mb-5">
            <FileText size={44} className="text-gray-700" />
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 select-text">
                Logs
              </h3>
              <p className="text-gray-600 font-medium mt-1 select-text">
                Voir les logs des workflows
              </p>
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
          className="cursor-pointer rounded-2xl border border-purple-300 p-6 flex flex-col
                     items-center justify-center text-center shadow-md
                     hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out
                     focus:outline-none focus:ring-4 focus:ring-purple-400 bg-gradient-to-tr from-purple-50 to-white"
          aria-label="Créer un nouveau workflow"
        >
          <PlusCircle size={48} className="text-purple-600 mb-5" />
          <h3 className="text-2xl font-semibold text-purple-900 select-text">
            Créer un workflow
          </h3>
          <p className="text-purple-700 font-medium mt-2 select-text">
            Démarrer un nouveau workflow
          </p>
        </div>
      </div>
    </div>
  );
}
