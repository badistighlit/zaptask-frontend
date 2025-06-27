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
import WorkflowNameModal from "./WorkflowNameModal";

import {
  createWorkflow,
  testWorkflow,
  fetchServices,
  fetchTriggersByService,
  fetchActionsByService,
  createEmptyWorkflow,
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

const initialNodes: Node<CustomNodeData>[] = [];
const initialEdges: Edge[] = [];

const userId = "user123"; // TODO: Remplacer avec auth

const CustomFlow = () => {
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

  const handleWorkflowNameSubmit = async (name: string) => {
    try {
      const res = await createEmptyWorkflow(name);
      setWorkflowName(res.name);
      setWorkflowId(res.id);
    } catch (err) {
      console.error("Erreur lors de la création du workflow :", err);
    }
  };

  const handleSave = async (workflow: WorkflowData) => {
    try {
      const res = await createWorkflow(workflow);
      console.log("Workflow created successfully:", res);
    } catch (error) {
      console.error("Error during workflow submission:", error);
    }
  };

  const handleTest = async (workflow: WorkflowData) => {
    try {
      const res = await testWorkflow(workflow);
      console.log("Workflow tested successfully:", res);
    } catch (error) {
      console.error("Error during workflow testing:", error);
    }
  };

  useEffect(() => {
    fetchServices()
      .then((data) => {
        setServices(data);
      })
      .catch((err) => console.error(err));
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
      .then((data) => setTriggers(data))
      .catch((err) => console.error(err));

    fetchActionsByService(selectedService)
      .then((data) => setActions(data))
      .catch((err) => console.error(err));
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
        config: {},
      },
      draggable: false,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };

    setNodes((nds) => {
      const updatedNodes = [...nds, newNode];

      if (updatedNodes.length > 1) {
        const sourceId = updatedNodes[updatedNodes.length - 2].id;
        const targetId = newNodeId;

        setEdges((eds) => [
          ...eds,
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

  // popup si workflowid nest pas defini
  if (!workflowId) {
    return <WorkflowNameModal onSubmit={handleWorkflowNameSubmit} />;
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
              handleTest(
                buildWorkflowFromNodes(nodes, workflowName, userId,workflowId)
              )
            }
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
          panOnScroll={true}
          onMove={(e, viewport) => setRfTransform(viewport)}
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

// build du workflow à partir des noeuds
function buildWorkflowFromNodes(
  nodes: Node<CustomNodeData>[],
  workflowName: string,
  userId: string,
  workflowId: string
): WorkflowData {
  const steps: WorkflowStepInput[] = nodes.map((node, index) => ({
    id: node.id,
    workflow_id: workflowId, 
    type: node.data.type as "trigger" | "action",
    service: node.data.service,
    ref_id: node.data.action || node.data.trigger || "",
    config: node.data.config || {},
    order: index,
  }));

  return {
    name: workflowName,
    userId,
    is_active: false,
    steps,
  };
}

export default CustomFlow;
