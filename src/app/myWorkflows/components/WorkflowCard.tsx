"use client";

import { useState } from "react";
import { WorkflowData } from "@/types/workflow";
import { BadgeCheck, Edit, Workflow, Captions, Trash2, FlaskConical, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useDeleteWorkflow } from "@/services/workflow";
import { useNotify } from "@/components/NotificationProvider";

interface Props {
  workflow: WorkflowData;
  onDelete?: (id: string) => void;
}

export default function WorkflowCard({ workflow, onDelete }: Props) {
  const notify = useNotify();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const deleteWorkflow = useDeleteWorkflow();

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

  const handleDelete = async () => {
    try {
      if (!workflow.id) {
        notify("Workflow ID is missing.", "error");
        return;
      }
      await deleteWorkflow(workflow.id);
      setModalOpen(false);
      onDelete?.(workflow.id);
    } catch (e) {
      console.error("Failed to delete workflow:", e);
      notify("Erreur lors de la suppression.", "error");
    }
  };

  const handleCardClick = () => {
    router.push(`/workflows/${workflow.id}`);
  };

  const renderStatusBadge = () => {
    switch (workflow.status) {
      case "deployed":
        return (
          <span className="flex items-center text-green-600 font-semibold">
            <BadgeCheck className="w-5 h-5 mr-1" />
            Deployed
          </span>
        );
      case "tested":
        return (
          <span className="flex items-center text-blue-600 font-semibold">
            <FlaskConical className="w-5 h-5 mr-1" />
            Tested
          </span>
        );
      case "draft":
        return (
          <span className="text-gray-500 font-semibold italic">Draft</span>
        );
      case "error":
        return (
          <span className="text-red-600 font-semibold flex items-center gap-1">
            <XCircle className="w-5 h-5" />
            Error
          </span>
        );
      default:
        return (
          <span className="text-yellow-600 font-semibold italic">
            Unknown
          </span>
        );
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
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
          <Workflow className="w-12 h-12 text-indigo-600" />

          <div>
            <h3 className="text-xl font-semibold text-gray-900">{workflow.name}</h3>

            <div className="flex items-center gap-3 text-sm mt-1">
              {renderStatusBadge()}
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/workflows/${workflow.id}`);
            }}
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

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/workflowLogs/${workflow.id}`);
            }}
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

          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
            className="
              flex items-center gap-2 px-4 py-2 rounded-2xl
              bg-red-100 text-red-700
              font-semibold
              hover:bg-red-200
              focus:outline-none focus:ring-2 focus:ring-red-400
              shadow-sm
              transition
            "
            aria-label={`Delete workflow ${workflow.name}`}
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        title="Delete workflow"
        message={`Are you sure you want to delete "${workflow.name}"?\nThis action cannot be undone.`}
        confirmText="Yes, delete it"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}
