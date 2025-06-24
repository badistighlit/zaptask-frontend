"use client";
import { WorkflowData } from "@/types/workflow";
import { Save } from "lucide-react"; 
export interface PushWorkflowButtonProps {
  workflow: WorkflowData;
  onPush: (workflow: WorkflowData) => void;
}

export default function SaveWorkflowButton({ workflow, onPush }: PushWorkflowButtonProps) {
  const handlePush = () => {
    onPush(workflow);
  };

  const isDisabled = !workflow?.steps?.length;

  return (
    <button
      onClick={handlePush}
      disabled={isDisabled}
      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-colors 
        ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
    >
      <Save size={18} />
      Save Workflow
    </button>
  );
}
