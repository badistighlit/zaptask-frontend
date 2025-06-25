"use client";

import React, { useCallback, useEffect, useState, ChangeEvent, FormEvent, /*FormEvent*/ } from "react";
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
  
  //useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";
import "@/app/workflow/styles/Flow.css";
import Sidebar from "./Sidebar";

import CustomNode, { CustomNodeData } from "./CustomNode";
import {edgeOptions}   from "./EdgesConfig";

import { createWorkflow, fetchActionsByService, fetchServices, fetchTriggersByService,  testWorkflow } from "../../../services/workflow"; 
import {  ActionOrTrigger, Service, WorkflowData, WorkflowStepInput } from "@/types/workflow";
import AddNodeButton from "./addNodeBoutton";
import SaveWorkflowButton from "./SaveWorkflowButton";
import TestWorkflowButton from "./TestWorkflowButton";

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node<CustomNodeData>[] = [];
const initialEdges: Edge[] = [];


//A MAJ
const userId = "user123";

const CustomFlow = () => {


  //hook pour la position des noeuds avant apres zoom
 const [rfTransform, setRfTransform] = useState({ x: 0, y: 0, zoom: 0.8 });



  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // state pour la sidebar
  const [services, setServices] = useState<Service[]>([]);

  const [triggers, setTriggers] = useState<ActionOrTrigger[]>([]);
  const [actions, setActions] = useState<ActionOrTrigger[]>([]);



  // state pour l'insertion de noeuds


  const [selectedService, setSelectedService] = useState("");

  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [details, setDetails] = useState("");


 

//state pour le workflow

//const [workflow,setWorkflow] = useState<WorkflowData>();
const [workflowName, setWorkflowName] = useState("");

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



  

  //chargement des données 
useEffect(() => {
  fetchServices()
    .then((data) => {
      console.log("fetchServices returned:", data);
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

    setSelectedTrigger("");
    setSelectedAction("");
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

  // Calcul pour posiiotion
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


  // Reset des champs du formulaire
  setSelectedService("");
  setSelectedTrigger("");
  setSelectedAction("");
  setDetails("");
};



return (
  
  <div className="flex h-screen w-full">
    
    <div className="flex-grow relative"> {}
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
    workflow={buildWorkflowFromNodes(nodes, workflowName, userId)}
    onPush={handleTest}
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

      <AddNodeButton
        nodes={nodes}
        rfTransform={rfTransform}
      />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">

       <SaveWorkflowButton
       workflow={buildWorkflowFromNodes(nodes, workflowName, userId)}
      onPush={handleSave}
      />

   
      </div>

   

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



export function buildWorkflowFromNodes(nodes : Node<CustomNodeData>[],workflowName : string,userId : string):WorkflowData {
const steps: WorkflowStepInput[] = nodes.map((node, index) => {
    return {
      id: node.id,
      type: node.data.type as "trigger" | "action",
      service : node.data.service,
      ref_id: node.data.action || node.data.trigger || "", 
      config: node.data.config || {},
      order: index,
    };
  });

  return {
    name: workflowName,
    userId: userId,
    is_active: false,
    steps,
  };

}


export default CustomFlow;
