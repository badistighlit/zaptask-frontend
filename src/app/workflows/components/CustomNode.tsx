import React, { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Handle, Position, NodeProps } from "reactflow";
import { WorkflowStepInput } from "@/types/workflow";
import { Zap, Film, X } from "lucide-react";
import { useDeleteActionOrTrigger } from "@/services/workflow"; 
import { useNotify } from "@/components/NotificationProvider";

type NodeData = {
  step: WorkflowStepInput;
  onDeleteNode?: (id: string) => void;

};

export default function WorkflowNode({ data }: NodeProps<NodeData>) {
  const { step } = data;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { deleteActionOrTrigger } = useDeleteActionOrTrigger();
  const notify = useNotify();

  const statusColorMap: Record<string, string> = {
    draft: "bg-gray-100 border-gray-300 text-gray-700",
    configured: "bg-blue-100 border-blue-500 text-blue-800",
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

    try {
      await deleteActionOrTrigger(step.ref_id);
     

      if (data.onDeleteNode) {
        data.onDeleteNode(step.ref_id);
      }

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
        className={`relative rounded-xl border p-4 shadow-md w-72 cursor-pointer hover:brightness-105 transition ${statusClass}`}
        title={`${step.name} (${step.type})`}
      >
        <button
          onClick={openConfirm}
          className="absolute top-2 right-2 rounded-full p-1 bg-white/70 shadow-sm hover:bg-red-500 hover:text-white transition-colors duration-200"
          title="Delete node"
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
