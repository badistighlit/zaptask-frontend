import { Node } from "reactflow";
import { CustomNodeData } from "./CustomNode";
import { useEffect, useState } from "react";

const fixedHeight = 200;
const nodeWidth = 220;

interface AddNodeButtonProps {
  nodes: Node<CustomNodeData>[];
  rfTransform: { x: number; y: number; zoom: number };
}

export default function AddNodeButton({ nodes,rfTransform }: AddNodeButtonProps) {
    const [, forceUpdate] = useState(0);
      useEffect(() => {
              forceUpdate((n) => n + 1);
            }, [rfTransform]);

  

  if (nodes.length < 2) return null;

  return (
    <>
      {nodes.slice(0, -1).map((node, index) => {
        const nextNode = nodes[index + 1];

        const midX = node.position.x + nodeWidth / 2;
        const bottomOfCurrent = node.position.y + fixedHeight;
        const topOfNext = nextNode.position.y;
        const midY = (bottomOfCurrent + topOfNext) / 2;

        const screenX = midX * rfTransform.zoom + rfTransform.x;
        const screenY = midY * rfTransform.zoom + rfTransform.y;

        

        return (
          <div
            key={`insert-${node.id}-${nextNode.id}`}
            style={{
              position: "absolute",
              left: screenX,
              top: screenY,
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
            }}
          >
            <button
              onClick={() => alert("click paw")}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "15px",
                cursor: "pointer",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                padding: "6px 12px",
                fontSize: "14px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
              }}
            >
              +
            </button>
          </div>
        );
      })}
    </>
  );
}
