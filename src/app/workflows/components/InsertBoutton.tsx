import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Plus } from "lucide-react";

export default function InsertButton({ data }: NodeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const customEvent = new CustomEvent("addActionBetween", {
      detail: {
        from: data.between[0],
        to: data.between[1],
      },
    });

    window.dispatchEvent(customEvent);
  };

  return (
    <div
      className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 cursor-pointer transition"
      onClick={handleClick}
      title="Ajouter une action entre ces étapes"
    >
      <Plus className="w-4 h-4 text-gray-600" />

      {/* Ces handles permettent les connexions via React Flow */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
