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

const CustomFlow = ({ existingWorkflow }: Props) => {
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

    // TODO: Implémenter buildWorkflowFromData si besoin pour charger nodes/edges depuis existingWorkflow
    // const { nodes, edges } = buildWorkflowFromData(existingWorkflow);

    // Pour l'instant on ne charge pas, mais tu peux décommenter ci-dessus
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [existingWorkflow, setNodes, setEdges]);

  // Charger la liste des services au montage
  useEffect(() => {
    fetchServices()
      .then((data) => setServices(data))
      .catch((err) => console.error("Erreur fetch services:", err));
  }, []);

  // Quand on change de service, charger triggers et actions
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

  // Auto-selection du trigger si la liste change et que rien n'est sélectionné
  useEffect(() => {
    if (triggers.length > 0 && !selectedTrigger) {
      setSelectedTrigger(triggers[0].identifier);
    } else if (triggers.length === 0) {
      setSelectedTrigger("");
    }
  }, [triggers]);

  // Auto-selection de l'action si la liste change et que rien n'est sélectionné
  useEffect(() => {
    if (actions.length > 0 && !selectedAction) {
      setSelectedAction(actions[0].identifier);
    } else if (actions.length === 0) {
      setSelectedAction("");
    }
  }, [actions]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onServiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newService = e.target.value;
    setSelectedService(newService);
    setSelectedTrigger("");
    setSelectedAction("");
  };

  const addStep = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedService) {
      alert("Veuillez sélectionner un service.");
      return;
    }

    const isTrigger = nodes.length === 0;
    const selectedId = isTrigger ? selectedTrigger : selectedAction;
    const sourceList = isTrigger ? triggers : actions;
/*
    if (!selectedId) {
      alert(`Veuillez sélectionner un ${isTrigger ? "trigger" : "action"}.`);
      return;
    }*/

    const selectedItem = sourceList.find((item) => item.identifier === selectedId);
    if (!selectedItem) {
      console.error("Action/Trigger introuvable pour l'identifiant:", selectedId);
      alert("L'élément sélectionné est introuvable. Veuillez choisir un autre.");
      return;
    }

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
        label: details || `${selectedService} - ${selectedItem.name}`,
        serviceActionId: selectedItem.serviceActionId,
        service: selectedService,
        trigger: isTrigger ? selectedItem.identifier : "", 
        action: !isTrigger ?  selectedItem.identifier : "",
        type: selectedItem.type,
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

    // Reset uniquement les sélections de triggers/actions et details, garder selectedService
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
    name: node.data.label,
    service: node.data.service,
    serviceActionId: node.data.serviceActionId,
    workflow_id: workflowId,
    type: node.data.type as "trigger" | "action",
    service_id: node.data.service,
    status: "draft",
    ref_id: node.data.type === "trigger" ? node.data.trigger : node.data.action,
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

export default CustomFlow;
