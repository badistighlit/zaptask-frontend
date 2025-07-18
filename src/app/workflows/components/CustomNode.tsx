import React, { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Handle, Position, NodeProps } from "reactflow";
import { WorkflowStepInput } from "@/types/workflow";
import { Zap, Film, X, AlertTriangle,OctagonAlert } from "lucide-react";
import { useDeleteActionOrTrigger } from "@/services/workflow";
import { useNotify } from "@/components/NotificationProvider";
import { isStepIncomplete } from "../utils/WorkflowUtils";


type NodeData = {
  id: string;
  step: WorkflowStepInput;
  onDeleteNode?: (id: string) => void;
  canDeleteNode?: (id: string) => boolean;
};

export default function WorkflowNode({ data }: NodeProps<NodeData>) {
  const { step } = data;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { deleteActionOrTrigger } = useDeleteActionOrTrigger();
  const notify = useNotify();

  const isIncomplete = isStepIncomplete(step);

  const statusColorMap: Record<string, string> = {
    draft: "bg-gray-100 border-gray-300 text-gray-700",
    configured: "bg-gray-100 border-gray-300 text-gray-700",
    notConfigured : "bg-yellow-100 border-yellow-500 text-yellow-800",
    error : "bg-red-100 border-red-500 text-red-800",
    tested: "bg-green-100 border-green-500 text-green-800",
  };

  const statusClass = statusColorMap[step.status || "draft"] || statusColorMap["draft"];
  const typeIcon = step.type === "trigger" ? <Zap size={16} /> : <Film size={16} />;
  const subText = step.service
    ? `Service: ${step.service}`
    : step.status === "draft"
    ? "Not configured"
    : "";

  const openConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

   const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);

    if (data.canDeleteNode && !data.canDeleteNode(data.step.ref_id)) {
      notify("A workflow must have at least one action.", "error");
      return;
    }

    if (!step.ref_id || step.ref_id.startsWith("temp-")) {
      data.onDeleteNode?.(data.step.ref_id); 
      return;
    }

    try {
      await deleteActionOrTrigger(step.ref_id);
      data.onDeleteNode?.(step.ref_id); 
    } catch (e) {
      console.error("Failed to delete step:", e);
      notify("Failed to delete step.", "error");
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div
        className={`relative rounded-xl border p-4 shadow-md w-72 cursor-pointer transition
        ${statusClass} ${isIncomplete ? "border-yellow-300 ring-1 ring-red-200" : "hover:brightness-105"}`}
        title={`${step.name} (${step.type})`}
      >
        {isIncomplete && (
          <div 
            className="absolute bottom-2 right-2 text-yellow-400" 
            title="This step is incomplete"
            style={{ opacity: 0.7 }}
          >
            <AlertTriangle size={18} />
          </div>
        )}


          {step.status === "error" && (
            <div
              className="absolute bottom-2 right-2 text-red-600"
              title="An error occurred during execution. Check logs or review configuration."
              style={{ opacity: 0.9 }}
            >
              <OctagonAlert size={18} />
            </div>
          )}

        <button
          onClick={step.type !== "trigger" ? openConfirm : undefined}
          disabled={step.type === "trigger"}
          className={`
            absolute top-2 right-2 rounded-full p-1 
            ${step.type === "trigger" ? "cursor-not-allowed bg-gray-200 text-gray-400" : "bg-white/70 hover:bg-red-400 hover:text-white"} 
            shadow-sm transition-colors duration-200
          `}
          title={step.type === "trigger" ? "Cannot delete a trigger" : "Delete node"}
        >
          <X size={14} />
        </button>

        <div className="flex items-center gap-2 mb-1 text-xs uppercase font-semibold">
          <span>{typeIcon}</span>
          <span>{step.type === "trigger" ? "Trigger" : "Action"}</span>
        </div>
        <h3 className="font-semibold truncate text-lg">{step.name}</h3>
        {subText && <p className="text-sm mt-1 truncate">{subText}</p>}
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title="Confirm deletion"
        message={`Are you sure you want to delete "${step.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
