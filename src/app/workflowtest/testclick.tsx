"use client";

import React from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  NodeProps,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";

function SimpleNode({ data }: NodeProps<{ label: string }>) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Tu as cliqué sur : ${data.label}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: 120,          // Forcer largeur
        height: 50,          // Forcer hauteur
        padding: 10,
        border: "1px solid #888",
        borderRadius: 6,
        background: "#eee",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {data.label}
    </div>
  );
}


export default function TestFlow() {
  const [nodes, , onNodesChange] = useNodesState([
    {
      id: "1",
      type: "simple",
      position: { x: 100, y: 100 },
      data: { label: "Clique-moi" },
    },
  ]);
  const [edges, , onEdgesChange] = useEdgesState([]);

  const nodeTypes = React.useMemo(() => ({ simple: SimpleNode }), []);

  console.log("nodes", nodes);
  console.log("nodeTypes", nodeTypes);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      //  fitView
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}
