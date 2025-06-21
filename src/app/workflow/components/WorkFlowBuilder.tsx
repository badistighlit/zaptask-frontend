"use client";

import React, { useCallback, useEffect, useState, ChangeEvent, FormEvent } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  Connection,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./Sidebar";

import CustomNode, { CustomNodeData } from "./CustomNode";

import { fetchServices, fetchTriggersByService, fetchActionsByService } from "../../../services/workflow"; 
import { Action, Service } from "@/types/workflow";

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node<CustomNodeData>[] = [];

const initialEdges: Edge[] = [];

const CustomFlow = () => {





  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // state pour la sidebar
  const [services, setServices] = useState<Service[]>([]);
  const [triggers, setTriggers] = useState<Action[]>([]);
  const [actions, setActions] = useState<Action[]>([]);

  const [selectedService, setSelectedService] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [details, setDetails] = useState("");

  

  //chargement des données 
  useEffect(() => {
    fetchServices()
      .then((data) => setServices(data))
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
    console.log("appel")
    e.preventDefault();
    if (!selectedService ) return;



    //UI calcul de la position du nouveau noeud

      const fixedHeight = 150; 
      const spacing = 50;      
      const centerX = 400;

    const newNode: Node<CustomNodeData> = {
      id: (nodes.length + 1).toString(),
      type: "custom",
      position: {
              x: centerX,
              y: nodes.length * (fixedHeight + spacing),
    },
      data: {
        id: (nodes.length + 1).toString(),
        label: details || `${selectedService} - ${selectedTrigger}`,
        service: selectedService,
        trigger: selectedTrigger,
        type: nodes.length === 0 ? "trigger" : "action", 
        action: selectedAction,
        configured: true,
        config: {},
      },
      draggable: false
    };

    setNodes((nds) => [...nds, newNode]);

    setSelectedService("");
    setSelectedTrigger("");
    setSelectedAction("");
    setDetails("");
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
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

      <div style={{ flexGrow: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background color="#e0f7fa"  />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CustomFlow;
