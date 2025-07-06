// components/workflow/InsertButton.tsx
import { NodeProps, Handle, Position } from "reactflow";

type InsertNodeData = {
  between: [string, string]; // [source, target]
};

export default function InsertButton({ data }: NodeProps<InsertNodeData>) {
  const handleInsert = (e: React.MouseEvent) => {
    e.stopPropagation();
    const [from, to] = data.between;
    const event = new CustomEvent("addActionBetween", {
      detail: { from, to },
    });
    window.dispatchEvent(event);
  };

  return (
    <div
      onClick={handleInsert}
      className="w-8 h-8 rounded-full bg-blue-500 text-white text-center flex items-center justify-center shadow cursor-pointer hover:bg-blue-600"
    >
      +
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
