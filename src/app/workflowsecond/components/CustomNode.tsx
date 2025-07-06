import React from "react";
import { Handle, Position } from "reactflow";
import { NodeProps } from "reactflow";
import { WorkflowStepInput } from "@/types/workflow";

type NodeData = {
  step: WorkflowStepInput;
};

const CustomWorkflowNode: React.FC<NodeProps<NodeData>> = ({ data, id }) => {
  const { step } = data;

  return (
    <div className="rounded-2xl shadow-md border border-gray-200 bg-white p-4 w-72">
      {/* TYPE LABEL */}
      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
        {step.type === "trigger" ? "Trigger" : "Action"}
      </div>

      {/* NAME */}
      <h3 className="text-md font-bold text-gray-800 truncate">{step.name}</h3>

      {/* SERVICE */}
      <div className="text-sm text-gray-600 mt-1">Service: {step.service}</div>

      {/* PARAMETERS */}
      {step.config.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-gray-500 mb-1">Paramètres :</div>
          <ul className="text-sm text-gray-700 space-y-1 max-h-28 overflow-y-auto">
            {step.config.map((param) => (
              <li key={param.key} className="flex justify-between">
                <span className="truncate">{param.name}</span>
                <span className="text-gray-400 truncate">
                  {String(param.value ?? "—")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => console.log("Test", step)}
          className="text-blue-600 text-sm hover:underline"
        >
          Tester
        </button>
      </div>

      {/* Flow Handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomWorkflowNode;
