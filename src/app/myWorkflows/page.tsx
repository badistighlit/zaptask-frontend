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
  Calendar,
  LayoutList
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const statuses: (WorkflowStatus | "all")[] = [
  "all",
  "draft",
  "deployed",
  "error",
];

export default function MyWorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState("recent");

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
    let filtered = workflows.filter((wf) => {
      const matchesStatus = statusFilter === "all" || wf.status === statusFilter;
      const matchesSearch = wf.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    if (sortOrder === "recent") {
      filtered = filtered.sort(
        (a, b) => new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime()
      );
    } else if (sortOrder === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [workflows, searchTerm, statusFilter, sortOrder]);

  const totalPages = Math.ceil(filteredWorkflows.length / ITEMS_PER_PAGE);

  const currentWorkflows = filteredWorkflows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortOrder]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold mb-6 text-indigo-900 select-none flex items-center justify-center gap-3">
        <LayoutList className="w-10 h-10 text-indigo-600" />
        My Workflows
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="flex items-center space-x-3">
          <Filter className="text-gray-600 w-6 h-6" />
          <select
            className="w-full rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | "all")}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "All Statuses"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="text-gray-600 w-6 h-6" />
          <select
            className="w-full rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Workflow List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 text-indigo-600 select-none">
          <Loader2 className="animate-spin w-14 h-14" />
          <p className="text-xl font-semibold">Chargement en cours...</p>
        </div>
      ) : filteredWorkflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 text-gray-400 select-none">
          <Inbox className="w-12 h-12" />
          <p className="text-xl">Aucun workflow trouvé.</p>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {currentWorkflows.map((wf) => (
              <div key={wf.id} className="transform hover:scale-[1.01] transition-transform">
                <WorkflowCard
                  workflow={wf}
                  onDelete={(id) =>
                    setWorkflows((prev) => prev.filter((w) => w.id !== id))
                  }
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-6 mt-10 select-none">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-5 py-3 rounded-2xl border border-gray-300 bg-white text-gray-700 hover:bg-indigo-50 disabled:opacity-50 shadow-md"
            >
              <ChevronLeft className="w-6 h-6 mr-3" />
              Précédent
            </button>

            <span className="text-gray-800 font-semibold text-lg">
              Page {currentPage} sur {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center px-5 py-3 rounded-2xl border border-gray-300 bg-white text-gray-700 hover:bg-indigo-50 disabled:opacity-50 shadow-md"
            >
              Suivant <ChevronRight className="w-6 h-6 ml-3" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
