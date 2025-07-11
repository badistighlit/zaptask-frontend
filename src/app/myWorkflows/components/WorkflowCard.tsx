"use client";

import { WorkflowData } from "@/types/workflow";
import { BadgeCheck, Edit, Workflow, Captions } from "lucide-react";
import Link from "next/link";

interface Props {
  workflow: WorkflowData;
}

export default function WorkflowCard({ workflow }: Props) {
  const isDeployed = workflow.status === "deployed";

  const formatDate = (date?: Date) => {
    if (!date) return "Not defined";
    return new Date(date).toLocaleString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="
        flex items-center justify-between
        border border-gray-200 
        p-5 rounded-3xl
        bg-white
        shadow-sm
        hover:shadow-lg
        transition-shadow duration-300
        cursor-pointer
        select-none
        "
      tabIndex={0}
      role="group"
      aria-label={`Workflow ${workflow.name} - status ${workflow.status}`}
    >
      <div className="flex items-center gap-5">
        {/* Workflow icon */}
        <Workflow className="w-12 h-12 text-indigo-600" />

        <div>
          <h3 className="text-xl font-semibold text-gray-900">{workflow.name}</h3>

          <div className="flex items-center gap-3 text-sm mt-1">
            {isDeployed ? (
              <span className="flex items-center text-green-600 font-semibold">
                <BadgeCheck className="w-5 h-5 mr-1" />
                Deployed
              </span>
            ) : workflow.status === "draft" ? (
              <span className="text-gray-500 font-semibold italic">Draft</span>
            ) : (
              <span className="text-red-600 font-semibold flex items-center gap-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Error
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-600">
            <div>
              <strong>Saved:</strong> {formatDate(workflow.savedAt)}
            </div>
            <div>
              <strong>Deployed:</strong> {formatDate(workflow.deployedAt)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href={`/workflows/${workflow.id}`}>
          <button
            className="
              flex items-center gap-2 px-4 py-2 rounded-2xl
              bg-indigo-50 text-indigo-700
              font-semibold
              hover:bg-indigo-100
              focus:outline-none focus:ring-2 focus:ring-indigo-400
              shadow-sm
              transition
              "
            aria-label={`Edit workflow ${workflow.name}`}
          >
            <Edit className="w-5 h-5" />
            Edit
          </button>
        </Link>

        <Link href={`/logs/${workflow.id}`}>
          <button
            className="
              flex items-center gap-2 px-4 py-2 rounded-2xl
              bg-gray-100 text-gray-700
              font-semibold
              hover:bg-gray-200
              focus:outline-none focus:ring-2 focus:ring-gray-400
              shadow-sm
              transition
              "
            aria-label={`View logs for workflow ${workflow.name}`}
          >
            <Captions className="w-5 h-5" />
            Logs
          </button>
        </Link>
      </div>
    </div>
  );
}
