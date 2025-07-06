"use client";
import React, { useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";
import WorkflowNode from "./CustomNode";
import InsertButton from "./InsertBoutton"; 

const nodeTypes = {
  customWorkflowNode: WorkflowNode,
  insertButton: InsertButton,
};

const initialNodes: Node[] = [
  {
    id: "trigger-node",
    type: "customWorkflowNode",
    position: { x: 250, y: 50 },
    data: {
      step: {
        name: "Choose a Trigger",
        type: "trigger",
        service: "",
        workflow_id: "",
        status: "draft",
        serviceActionId: "",
        order: 0,
        config: [],
        trigger: "",
      },
    },
  },
  {
    id: "action-node",
    type: "customWorkflowNode",
    position: { x: 250, y: 300 },
    data: {
      step: {
        name: "Choose an Action",
        type: "action",
        service: "",
        workflow_id: "",
        status: "draft",
        serviceActionId: "",
        order: 1,
        config: [],
        action: "",
      },
    },
  },
  {
    id: "insert-0",
    type: "insertButton",
    position: { x: 260, y: 200 },
    data: { between: ["trigger-node", "action-node"] },
  },
];

const initialEdges: Edge[] = [
  { id: "edge-1", source: "trigger-node", target: "insert-0" },
  { id: "edge-2", source: "insert-0", target: "action-node" },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  };

  const addActionBetween = (fromId: string, toId: string) => {
    const timestamp = Date.now();
    const newActionId = `action-${timestamp}`;
    const insertId = `insert-${timestamp}`;

    const fromNode = nodes.find((n) => n.id === fromId);
    const toNode = nodes.find((n) => n.id === toId);

    const newY = fromNode && toNode
      ? (fromNode.position.y + toNode.position.y) / 2
      : 200;

    const newActionNode: Node = {
      id: newActionId,
      type: "customWorkflowNode",
      position: { x: 250, y: newY },
      data: {
        step: {
          name: "New Action",
          type: "action",
          service: "",
          workflow_id: "",
          status: "draft",
          serviceActionId: "",
          order: 1,
          config: [],
          action: "",
        },
      },
    };

    const newInsertNode: Node = {
      id: insertId,
      type: "insertButton",
      position: { x: 260, y: newY + 100 },
      data: { between: [newActionId, toId] },
    };

    setNodes((prev) =>
      prev
        .filter((n) => !(n.type === "insertButton" && n.data?.between?.[0] === fromId && n.data?.between?.[1] === toId))
        .concat(newActionNode, newInsertNode)
    );

    setEdges((prev) =>
      prev
        .filter((e) => !(e.source === fromId && e.target === toId))
        .concat(
          { id: `e-${fromId}-${newActionId}`, source: fromId, target: newActionId },
          { id: `e-${newActionId}-${insertId}`, source: newActionId, target: insertId },
          { id: `e-${insertId}-${toId}`, source: insertId, target: toId }
        )
    );
  };

  // 🔁 Écoute l'événement déclenché par InsertButton
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      const { from, to } = custom.detail;
      addActionBetween(from, to);
    };

    window.addEventListener("addActionBetween", handler);
    return () => {
      window.removeEventListener("addActionBetween", handler);
    };
  }, [nodes]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
