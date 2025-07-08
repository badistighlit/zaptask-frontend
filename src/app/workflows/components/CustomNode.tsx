import { Handle, Position, NodeProps } from "reactflow";
import { WorkflowStepInput } from "@/types/workflow";
import { Zap, Film } from "lucide-react"; 

type NodeData = {
  step: WorkflowStepInput;
};

export default function WorkflowNode({ data }: NodeProps<NodeData>) {
  const { step } = data;

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
    ? "Non configuré"
    : "";

  return (
    <div
      className={`rounded-xl border p-4 shadow-md w-72 cursor-pointer hover:brightness-105 transition ${statusClass}`}
      title={`${step.name} (${step.type})`}
    >
      <div className="flex items-center gap-2 mb-1 text-xs uppercase font-semibold">
        <span>{typeIcon}</span>
        <span>{step.type === "trigger" ? "Trigger" : "Action"}</span>
      </div>
      <h3 className="font-semibold truncate text-lg">{step.name}</h3>
      {subText && <p className="text-sm mt-1 truncate">{subText}</p>}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
