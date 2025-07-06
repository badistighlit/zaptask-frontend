"use client";
import React, { useEffect, useState } from "react";
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
import { ActionOrTrigger, WorkflowStepType } from "@/types/workflow";
import ServiceSelectorModal from "./ServiceSelectorModal";
import { CustomEdge } from "./CustomEdges";
import StepConfigurator from "./StepConfigurator";
import { X } from "lucide-react";

const nodeTypes = {
  customWorkflowNode: WorkflowNode,
  insertButton: InsertButton,
};

const edgeTypes = {
  custom: CustomEdge,
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

  const [modalOpen, setModalOpen] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [currentStepType, setCurrentStepType] = useState<WorkflowStepType>("action");

  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [selectedConfigNodeId, setSelectedConfigNodeId] = useState<string | null>(null);

  const handleNodeClick = (node: Node | undefined) => {
    if (!node) return;

    if (node.type === "customWorkflowNode") {
      const step = node.data.step;

      // Toujours set selectedConfigNodeId pour garder la trace
      setSelectedConfigNodeId(node.id);
      setConfiguratorOpen(false); // Ferme temporairement la config

      if (!step.service) {
        // Node non configuré => ouvrir modale de sélection
        setCurrentStepId(node.id);
        setCurrentStepType(step.type);
        setModalOpen(true);
      } else {
        // Node configuré => ouvrir la config directement
        setConfiguratorOpen(true);
      }
    }

    if (node.type === "insertButton") {
      const [from, to] = node.data.between;
      addActionBetween(from, to);
    }
  };

const handleSelectServiceAction = (item: ActionOrTrigger) => {
  setNodes((prevNodes) =>
    prevNodes.map((node) => {
      if (node.id === currentStepId && node.type === "customWorkflowNode") {
        return {
          ...node,
          data: {
            ...node.data,
            step: {
              ...node.data.step,
              service: item.service_id,
              serviceActionId: item.serviceActionId,
              name: item.name,
              config: item.parameters,
              action: item.type === "action" ? item.identifier : "",
              trigger: item.type === "trigger" ? item.identifier : "",
              status: "configured", // <- statut configuré ici
            },
          },
        };
      }
      return node;
    })
  );

  setModalOpen(false);
  setConfiguratorOpen(true);
};

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
        .filter(
          (n) =>
            !(
              n.type === "insertButton" &&
              n.data?.between?.[0] === fromId &&
              n.data?.between?.[1] === toId
            )
        )
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
    <div className="w-full h-full relative">
<div className="w-full h-[90vh] relative overflow-y-auto" style={{ maxHeight: '90vh' }}>
  <ReactFlow
    nodes={nodes}
    edges={edges}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onConnect={onConnect}
    onNodeClick={(event, node) => handleNodeClick(node)}
    nodeTypes={nodeTypes}
    edgeTypes={edgeTypes}
    //fitView
    nodesDraggable={false}     // empêche déplacement noeuds
    nodesConnectable={true}    // laisse possibilité connecter
    panOnDrag={false}          // empêche déplacement de la vue au drag
    panOnScroll={false}        // empêche pan via molette (important)
    zoomOnScroll={false}       // désactive zoom avec molette (important)
    style={{ minHeight: 1200 }}
  >
    <Background />
    <Controls />
  </ReactFlow>
</div>

      {/* Sidebar Configuration */}
      {configuratorOpen && selectedConfigNodeId && (
        <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-lg border-l z-50 overflow-y-auto flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold">Configurer les paramètres</h2>
                <button
                onClick={() => {
                    setConfiguratorOpen(false);
                    setSelectedConfigNodeId(null);
                }}
                className="p-1 rounded hover:bg-gray-200"
                aria-label="Close configuration sidebar"
                >
                <X size={24} />
                </button>
          </div>

          {(() => {
            const node = nodes.find((n) => n.id === selectedConfigNodeId);
            if (!node) return <p className="p-4">Étape non trouvée</p>;

            return (
<StepConfigurator
  step={node.data.step}
  onChange={(updatedStep) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedConfigNodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              step: updatedStep,
            },
          };
        }
        return n;
      })
    );
  }}
  onTest={() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedConfigNodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              step: {
                ...n.data.step,
                status: "tested",
              },
            },
          };
        }
        return n;
      })
    );
  }}
/>
            );
          })()}
        </div>
      )}

      {/* Modal de sélection service/action/trigger */}
      <ServiceSelectorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        stepType={currentStepType}
        onSelect={handleSelectServiceAction}
      />
    </div>
  );
}
