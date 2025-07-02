"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchWorkflowsByUser } from "@/services/workflow";
import { WorkflowData, WorkflowStatus } from "@/types/workflow";
import WorkflowCard from "./components/WorkflowCard";
import {
  Loader2,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";

// item par page
const ITEMS_PER_PAGE = 10;

const statuses: (WorkflowStatus | "all")[] = ["all", "draft", "deployed", "error"];

export default function MyWorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | "all">("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const response = await fetchWorkflowsByUser();
      if (Array.isArray(response)) {
        setWorkflows(response);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      const matchesStatus = statusFilter === "all" || wf.status === statusFilter;
      const matchesSearch = wf.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [workflows, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredWorkflows.length / ITEMS_PER_PAGE);

  const currentWorkflows = filteredWorkflows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function goPrev() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  function goNext() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 select-none">
        Mes Workflows
      </h1>

      {/* filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0 mb-8">
        {/* recherch par nom */}
        <div className="relative flex items-center w-full sm:w-1/2">
          <Search className="absolute left-3 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/*  statut */}
        <div className="flex items-center space-x-3">
          <Filter className="text-gray-600 w-6 h-6" />
          <select
            className="rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | "all")}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "Tous les statuts"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* liste */}
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 text-blue-600 select-none">
          <Loader2 className="animate-spin w-14 h-14" />
          <p className="text-xl font-semibold">Chargement en cours...</p>
        </div>
      ) : filteredWorkflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 text-gray-400 select-none">
          <Inbox className="w-12 h-12" />
          <p className="text-xl">Aucun workflow disponible pour le moment.</p>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {currentWorkflows.map((wf) => (
              <div
                key={wf.id}
                className="transform hover:scale-[1.02] transition-transform duration-200"
              >
                <WorkflowCard workflow={wf} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-6 mt-10 select-none">
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className="flex items-center px-5 py-3 rounded-2xl border border-gray-300 bg-white text-gray-700 hover:bg-indigo-50 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-shadow"
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-6 h-6 mr-3" />
              Précédent
            </button>

            <span className="text-gray-800 font-semibold text-lg">
              Page {currentPage} sur {totalPages}
            </span>

            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className="flex items-center px-5 py-3 rounded-2xl border border-gray-300 bg-white text-gray-700 hover:bg-indigo-50 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-shadow"
              aria-label="Page suivante"
            >
              Suivant
              <ChevronRight className="w-6 h-6 ml-3" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
