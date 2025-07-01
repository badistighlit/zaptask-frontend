"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";

import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  MiniMap,
  Connection,
  Node,
  Edge,
  Position,
} from "reactflow";

import "reactflow/dist/style.css";
import "@/app/workflow/styles/Flow.css";

import Sidebar from "./Sidebar";
import AddNodeButton from "./addNodeBoutton";
import SaveWorkflowButton from "./SaveWorkflowButton";
import TestWorkflowButton from "./TestWorkflowButton";
import CustomNode, { CustomNodeData } from "./CustomNode";
import { edgeOptions } from "./EdgesConfig";
//import WorkflowNameModal from "./WorkflowNameModal";

import {
  
  testWorkflow,
  fetchServices,
  fetchTriggersByService,
  fetchActionsByService,
  updateWorkflow,
} from "../../../services/workflow";

import {
  ActionOrTrigger,
  Service,
  WorkflowData,
  WorkflowStepInput,
} from "@/types/workflow";

const nodeTypes = {
  custom: CustomNode,
};

type Props = {
  existingWorkflow?: WorkflowData;
};

const initialNodes: Node<CustomNodeData>[] = [];
const initialEdges: Edge[] = [];

//const userId = "user123"; // TODO: Remplacer avec auth

const CustomFlow = ({ existingWorkflow }: Props) => {
 // const router = useRouter();

  const [rfTransform, setRfTransform] = useState({ x: 0, y: 0, zoom: 0.8 });
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [services, setServices] = useState<Service[]>([]);
  const [triggers, setTriggers] = useState<ActionOrTrigger[]>([]);
  const [actions, setActions] = useState<ActionOrTrigger[]>([]);

  const [selectedService, setSelectedService] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [details, setDetails] = useState("");

  const [workflowName, setWorkflowName] = useState("");
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  // Chargement du workflow existant
  useEffect(() => {
    if (!existingWorkflow) return;

    setWorkflowName(existingWorkflow.name);
    setWorkflowId(existingWorkflow.id || null);

    const { nodes, edges } = buildWorkflowFromData(existingWorkflow);

    setNodes(nodes);
    setEdges(edges);
  }, [existingWorkflow, setNodes, setEdges]);

  useEffect(() => {
    fetchServices()
      .then((data) => setServices(data))
      .catch((err) => console.error("Erreur fetch services:", err));
  }, []);

  useEffect(() => {
    if (!selectedService) {
      setTriggers([]);
      setActions([]);
      setSelectedTrigger("");
      setSelectedAction("");
      return;
    }

    fetchTriggersByService(selectedService)
      .then(setTriggers)
      .catch((err) => console.error("Erreur fetch triggers:", err));

    fetchActionsByService(selectedService)
      .then(setActions)
      .catch((err) => console.error("Erreur fetch actions:", err));
  }, [selectedService]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onServiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
  };

  const addStep = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedService) return;

    const fixedHeight = 200;
    const spacing = 80;
    const centerX = 400;
    const newNodeId = (nodes.length + 1).toString();

    const newNode: Node<CustomNodeData> = {
      id: newNodeId,
      type: "custom",
      position: {
        x: centerX,
        y: nodes.length * (fixedHeight + spacing),
      },
      data: {
        id: newNodeId,
        label: details || `${selectedService} - ${selectedTrigger}`,
        service: selectedService,
        trigger: selectedTrigger,
        type: nodes.length === 0 ? "trigger" : "action",
        action: selectedAction,
        configured: true,
        config: [],
      },
      draggable: false,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };

    setNodes((prev) => {
      const updatedNodes = [...prev, newNode];

      if (updatedNodes.length > 1) {
        const sourceId = updatedNodes[updatedNodes.length - 2].id;
        const targetId = newNodeId;

        setEdges((prevEdges) => [
          ...prevEdges,
          {
            id: `e${sourceId}-${targetId}`,
            source: sourceId,
            target: targetId,
            ...edgeOptions,
          },
        ]);
      }

      return updatedNodes;
    });

    setSelectedService("");
    setSelectedTrigger("");
    setSelectedAction("");
    setDetails("");
  };

  const handleTest = async (workflow: WorkflowData) => {
    try {
      await testWorkflow(workflow);
    } catch (error) {
      console.error("Erreur test workflow:", error);
    }
  };
/*
  const handleSave = async (workflow: WorkflowData) => {
    try {
      await createWorkflow(workflow);
    } catch (error) {
      console.error("Erreur création workflow:", error);
    }
  };
  */

  if (!workflowId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Création du workflow en cours...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex-grow relative">
        <div className="workflow-header">
          <label htmlFor="workflow-name">Nom du workflow :</label>
          <input
            id="workflow-name"
            type="text"
            placeholder="Entrez un nom..."
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="workflow-name-input"
          />
        </div>

        <div className="absolute top-4 left-4 z-50">
          <TestWorkflowButton
            onPush={() =>
              handleTest(buildWorkflowFromNodes(nodes, workflowName, workflowId))
            }
          />
        </div>

        <div className="absolute top-4 right-4 z-50">
          <SaveWorkflowButton
            workflow={buildWorkflowFromNodes(nodes, workflowName, workflowId)}
            onPush={async (wf) => {
              try {
                await updateWorkflow(wf);
              } catch (e) {
                console.error("Erreur update workflow:", e);
              }
            }}
          />
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={edgeOptions}
          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnScroll
          onMove={(_, viewport) => setRfTransform(viewport)}
          fitView={false}
          fitViewOptions={{ padding: 0.2 }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          style={{ width: "100%", height: "100vh" }}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>

        <AddNodeButton nodes={nodes} rfTransform={rfTransform} />
      </div>

      <Sidebar
        services={services}
        triggers={triggers}
        actions={actions}
        selectedService={selectedService}
        selectedTrigger={selectedTrigger}
        selectedAction={selectedAction}
        details={details}
        setSelectedService={setSelectedService}
        setSelectedTrigger={setSelectedTrigger}
        setSelectedAction={setSelectedAction}
        setDetails={setDetails}
        onServiceChange={onServiceChange}
        addStep={addStep}
      />
    </div>
  );
};

// Build workflow à partir des noeuds
function buildWorkflowFromNodes(
  nodes: Node<CustomNodeData>[],
  workflowName: string,
  workflowId: string
): WorkflowData {
  const steps: WorkflowStepInput[] = nodes.map((node, index) => ({
    id: node.id,
    workflow_id: workflowId,
    type: node.data.type as "trigger" | "action",
    service_id: node.data.service,
    status: "draft",
    ref_id: node.data.action || node.data.trigger || "",
    config: node.data.config || {},
    order: index,
  }));

  return {
    id: workflowId,
    name: workflowName,
    status: "draft",
    steps,
  };
}

// Reconstruction des nodes/edges depuis un workflow existant
function buildWorkflowFromData(data: WorkflowData) {
  if (!data.steps || data.steps.length === 0) {
    return { nodes: [], edges: [] };
  }

  const nodes: Node<CustomNodeData>[] = data.steps.map((step, index) => ({
    id: step.id,
    type: "custom",
    position: { x: 400, y: index * 280 },
    data: {
      id: step.id,
      label: step.service_id,
      service: step.service_id,
      trigger: step.type === "trigger" ? step.id : "",   // TODO à confirmer le type avec le backend
      action: step.type === "action" ? step.id : "",      // TODO à confirmer par la suite
      type: step.type,
      configured: true,
      config: step.config || [],
    },
    draggable: false,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  }));

  const edges: Edge[] = nodes.slice(1).map((node, idx) => ({
    id: `e${nodes[idx].id}-${node.id}`,
    source: nodes[idx].id,
    target: node.id,
    ...edgeOptions,
  }));

  return { nodes, edges };
}

export default CustomFlow;
