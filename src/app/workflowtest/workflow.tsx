"use client";
import React, { useCallback, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  type Node,
  type Edge,
  type Connection,
} from "reactflow";

import CustomAlertNode from "./CustomAlertNode";
import "reactflow/dist/style.css";

const nodeTypes = {
  alertNode: CustomAlertNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "alertNode",
    position: { x: 100, y: 100 },
    data: {
      label: "Node 1",
      message: "Ceci est une alerte personnalisée !",
      color: "#fdf0d5",
      description: "Premier nœud",
    },
  },
  {
    id: "2",
    type: "alertNode",
    position: { x: 400, y: 100 },
    data: {
      label: "Node 2",
      message: "Deuxième alerte !",
      color: "#e8f5e8",
      description: "Deuxième nœud",
    },
  },
];

const initialEdges: Edge[] = [];

const CustomFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeIdRef = useRef(3); // Compteur pour les IDs des nouveaux nœuds

  const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

  // Fonction pour générer une position aléatoire
  const getRandomPosition = () => ({
    x: Math.random() * 400 + 50,
    y: Math.random() * 300 + 50,
  });

  // Fonction pour créer un nouveau nœud
  const addNewNode = useCallback(() => {
    const newNode: Node = {
      id: nodeIdRef.current.toString(),
      type: "alertNode",
      position: getRandomPosition(),
      data: {
        label: `Node ${nodeIdRef.current}`,
        message: `Message du nœud ${nodeIdRef.current}`,
        color: "#f0f8ff",
        description: `Nouveau nœud ${nodeIdRef.current}`,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    nodeIdRef.current += 1;
  }, [setNodes]);

  // Fonction pour supprimer tous les nœuds
  const clearAllNodes = useCallback(() => {
    setNodes([]);
    setEdges([]);
    nodeIdRef.current = 1;
  }, [setNodes, setEdges]);

  // Fonction pour réinitialiser avec les nœuds par défaut
  const resetNodes = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    nodeIdRef.current = 3;
  }, [setNodes, setEdges]);

  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      {/* Barre d'outils */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          display: "flex",
          gap: 8,
          backgroundColor: "white",
          padding: 8,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={addNewNode}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          ➕ Nouveau nœud
        </button>
        <button
          onClick={resetNodes}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          🔄 Reset
        </button>
        <button
          onClick={clearAllNodes}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          🗑️ Tout effacer
        </button>
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#f8f9fa",
            borderRadius: 4,
            fontSize: 14,
            color: "#666",
            alignSelf: "center",
          }}
        >
          Nœuds: {nodes.length}
        </div>
      </div>

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
        <Background />
      </ReactFlow>
    </div>
  );
};

export default CustomFlow;