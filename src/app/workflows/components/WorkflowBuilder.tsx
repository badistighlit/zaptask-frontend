"use client";
import React, {  useEffect, useState } from "react";
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
import { ActionOrTrigger, WorkflowData, WorkflowStepType } from "@/types/workflow";
import ServiceSelectorModal from "./ServiceSelectorModal";
import { CustomEdge } from "./CustomEdges";
import StepConfigurator from "./StepConfigurator";
import {  Rocket, Save, X } from "lucide-react";
import { deployWorkflow, updateWorkflow } from "@/services/workflow";
import { useNotify } from "@/components/NotificationProvider";

interface WorkflowBuilderProps {
  initialWorkflow: WorkflowData;
}

const nodeTypes = {
  customWorkflowNode: WorkflowNode,
  insertButton: InsertButton,
};

const edgeTypes = {
  custom: CustomEdge,
};



const NODE_HEIGHT = 120; //  hauteur des noeuds
const VERTICAL_GAP = 80; // espace entre les noeuds
const INSERT_BUTTON_WIDTH = 40;
const INSERT_BUTTON_HEIGHT = 40;
const NODE_X = 250; // position fixe verticale

// conversion des steps en noedus
function convertStepsToNodes(steps: WorkflowData["steps"]): Node[] {
  const nodes: Node[] = steps.map((step, index) => ({
    id: step.ref_id,
    type: "customWorkflowNode",
    position: { x: NODE_X, y: 50 + index * (NODE_HEIGHT + VERTICAL_GAP) },
    data: { step },
  }));

  const insertButtons: Node[] = [];

  for (let i = 0; i < steps.length - 1; i++) {
    const currentNodeY = 50 + i * (NODE_HEIGHT + VERTICAL_GAP);
    const nextNodeY = 50 + (i + 1) * (NODE_HEIGHT + VERTICAL_GAP);
    insertButtons.push({
      id: `insert-${steps[i].ref_id}-${steps[i + 1].ref_id}`,
      type: "insertButton",
      position: {
        x: NODE_X - INSERT_BUTTON_WIDTH / 2 + 145,
        y: (currentNodeY + NODE_HEIGHT + nextNodeY) / 2 - INSERT_BUTTON_HEIGHT / 2 - 5,
      },
      data: { between: [steps[i].ref_id, steps[i + 1].ref_id] },
    });
  }

  return [...nodes, ...insertButtons];
}

function convertStepsToEdges(steps: WorkflowData["steps"]): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < steps.length - 1; i++) {
    edges.push({
      id: `edge-${steps[i].ref_id}-insert-${steps[i].ref_id}-${steps[i + 1].ref_id}`,
      source: steps[i].ref_id,
      target: `insert-${steps[i].ref_id}-${steps[i + 1].ref_id}`,
    });
    edges.push({
      id: `edge-insert-${steps[i].ref_id}-${steps[i + 1].ref_id}-${steps[i + 1].ref_id}`,
      source: `insert-${steps[i].ref_id}-${steps[i + 1].ref_id}`,
      target: steps[i + 1].ref_id,
    });
  }
  return edges;
}

// nodes par defauts quand le workflow est vide
const initialWorkflowNode = (
  id: string,
  y: number,
  type: "trigger" | "action",
  name: string
): Node => ({
  id,
  type: "customWorkflowNode",
  position: { x: NODE_X, y },
  data: {
    step: {
      name,
      type,
      service: "",
      workflow_id: "",
      status: "draft",
      serviceActionId: "",
      order: 0,
      config: [],
      trigger: "",
      action: "",
    },
  },
});

const initialNodes: Node[] = [
  initialWorkflowNode("trigger-node", 50, "trigger", "Choose a Trigger"),
  initialWorkflowNode("action-node", 50 + NODE_HEIGHT + VERTICAL_GAP, "action", "Choose an Action"),
  {
    id: "insert-0",
    type: "insertButton",
    position: {
      x: NODE_X,
      y: 50 + NODE_HEIGHT + VERTICAL_GAP / 2,
    },
    data: { between: ["trigger-node", "action-node"] },
  },
];

const initialEdges: Edge[] = [
  { id: "edge-1", source: "trigger-node", target: "insert-0" },
  { id: "edge-2", source: "insert-0", target: "action-node" },
];

export default function WorkflowBuilder({ initialWorkflow }: WorkflowBuilderProps) {
  // si on a des steps convertit, sinon on garde les nodes initiaux
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialWorkflow.steps && initialWorkflow.steps.length > 0
      ? convertStepsToNodes(initialWorkflow.steps)
      : initialNodes
  );
  const [workflowName, setWorkflowName] = useState(initialWorkflow.name || "");


  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialWorkflow.steps && initialWorkflow.steps.length > 0
      ? convertStepsToEdges(initialWorkflow.steps)
      : initialEdges
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [currentStepType, setCurrentStepType] = useState<WorkflowStepType>("action");

  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [selectedConfigNodeId, setSelectedConfigNodeId] = useState<string | null>(null);


  const notify = useNotify();




  useEffect(() => {
    
    setNodes((nds) => reorderAndReposition(nds));
  }, []);

  const handleNodeClick = (node: Node | undefined) => {
    if (!node) return;

    if (node.type === "customWorkflowNode") {
      const step = node.data.step;

      setSelectedConfigNodeId(node.id);
      setConfiguratorOpen(false);

      if (!step.service) {
        setCurrentStepId(node.id);
        setCurrentStepType(step.type);
        setModalOpen(true);
      } else {
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
                status: "draft",
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






const addActionBetween = (fromId: string, toId: string | null) => {
  const timestamp = Date.now();
  const newActionId = `action-${timestamp}`;
  const insertId = `insert-${timestamp}`;

  const fromNode = nodes.find((n) => n.id === fromId);
  const toNode = toId ? nodes.find((n) => n.id === toId) : null;

  if (!fromNode) return;

  // gestion du dernier noeud si toId is null
  const newX = NODE_X;
  const newY = toNode
    ? (fromNode.position.y + toNode.position.y) / 2
    : fromNode.position.y + NODE_HEIGHT + VERTICAL_GAP;

  const newActionNode: Node = {
    id: newActionId,
    type: "customWorkflowNode",
    position: { x: newX, y: newY },
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
        trigger: "",
      },
    },
  };

  // Position du bouton insert 
  const insertX = NODE_X - INSERT_BUTTON_WIDTH / 2 + 145;
  const insertY = newY + NODE_HEIGHT + VERTICAL_GAP / 2 - INSERT_BUTTON_HEIGHT / 2 - 5;

  const newInsertNode: Node = {
    id: insertId,
    type: "insertButton",
    position: { x: insertX, y: insertY },
    data: { between: [newActionId, null] },
  };

  // MAJ des nodoes
  const updatedNodes = nodes.filter((n) => {
    if (toId === null) {
     
      return !(n.type === "insertButton" && n.id === `insert-after-${fromId}`);
    } else {
      
      return !(
        n.type === "insertButton" &&
        n.data?.between?.[0] === fromId &&
        n.data?.between?.[1] === toId
      );
    }
  }).concat(newActionNode, newInsertNode);



  // MAJ edges
  let updatedEdges = edges.filter((e) => {
    if (toId === null) {
      
      return !(e.source === fromId && e.target === `insert-after-${fromId}`);
    } else {
      return !(e.source === fromId && e.target === toId);
    }
  });

  if (toId === null) {
    // ajout edge fromNode -> newActionNode -> newInsertNode
    updatedEdges = updatedEdges.concat(
      { id: `e-${fromId}-${newActionId}`, source: fromId, target: newActionId },
      { id: `e-${newActionId}-${insertId}`, source: newActionId, target: insertId }
    );
  } else {
    // ajout edge fromNode -> newActionNode -> insert -> toNode
    updatedEdges = updatedEdges.concat(
      { id: `e-${fromId}-${newActionId}`, source: fromId, target: newActionId },
      { id: `e-${newActionId}-${insertId}`, source: newActionId, target: insertId },
      { id: `e-${insertId}-${toId}`, source: insertId, target: toId }
    );
  }

  const reordered = reorderAndReposition(updatedNodes);

  setNodes(reordered);
  setEdges(updatedEdges);
};









  // fonction de reorganisation et position
  const reorderAndReposition = (nodes: Node[]) => {
    const workflowNodes = nodes.filter((n) => n.type === "customWorkflowNode");
    const insertButtons: Node[] = [];

    workflowNodes.sort((a, b) => a.position.y - b.position.y);

    const updated: Node[] = [];

    workflowNodes.forEach((node, index) => {
      const y = 50 + index * (NODE_HEIGHT + VERTICAL_GAP);
      const x = node.position.x;

      updated.push({
        ...node,
        position: { x, y },
      });

      if (index < workflowNodes.length - 1) {
        const nextNode = workflowNodes[index + 1];
        const nextY = 50 + (index + 1) * (NODE_HEIGHT + VERTICAL_GAP);

        insertButtons.push({
          id: `insert-${node.id}-${nextNode.id}`,
          type: "insertButton",
          position: {
            x: NODE_X - INSERT_BUTTON_WIDTH / 2 + 145,
            y: (y + NODE_HEIGHT + nextY) / 2 - INSERT_BUTTON_HEIGHT / 2 - 5,
          },
          data: { between: [node.id, nextNode.id] },
        });
      }
    });



    // boutton après le dernier noeud
      if (workflowNodes.length > 0) {
    const lastNode = workflowNodes[workflowNodes.length - 1];
    const lastY = 50 + (workflowNodes.length - 1) * (NODE_HEIGHT + VERTICAL_GAP);

    insertButtons.push({
      id: `insert-after-${lastNode.id}`,
      type: "insertButton",
      position: {
        x: NODE_X - INSERT_BUTTON_WIDTH / 2 + 145,
        y: lastY + NODE_HEIGHT + VERTICAL_GAP / 2 - INSERT_BUTTON_HEIGHT / 2 - 5,
      },
      data: { between: [lastNode.id, null] }, 
    });
  }



    return [...updated, ...insertButtons];
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


  // sauvegarde 
  /*
  const handleSave = async () => {
    const workflowSteps = nodes
      .filter((n) => n.type === "customWorkflowNode")
      .sort((a, b) => a.position.y - b.position.y)
      .map((node, index) => ({
        ...node.data.step,
        order: index,
      }));

    const updatedWorkflow: WorkflowData = {
      ...initialWorkflow,
      name: workflowName,
      steps: workflowSteps,
    };

    try {
      await updateWorkflow(updatedWorkflow);
      alert("Workflow sauvegardé avec succès !");
    } catch (error) {
      alert("Erreur lors de la sauvegarde.");
      console.error(error);
    }
  };*/

  // sauvegarde et update 
  const handleSave = async () => {
  const workflowSteps = nodes
    .filter((n) => n.type === "customWorkflowNode")
    .sort((a, b) => a.position.y - b.position.y)
    .map((node, index) => ({
      ...node.data.step,
      order: index,
    }));

  const updatedWorkflow: WorkflowData = {
    ...initialWorkflow,
    name: workflowName,
    steps: workflowSteps,
  };

  try {
    const savedWorkflow = await updateWorkflow(updatedWorkflow);
    notify("Workflow saved successfully!", "success" );
  


    //update les changements 
    const updatedNodes = convertStepsToNodes(savedWorkflow.steps);
    const updatedEdges = convertStepsToEdges(savedWorkflow.steps);

   
    setNodes(reorderAndReposition(updatedNodes));
    setEdges(updatedEdges);
  } catch (error) {
    notify( "Error saving the workflow",  "error" );

    console.error(error);
  }
};

const handleDeploy = async () => {
  try {
    if (!initialWorkflow.id) {
      alert("Workflow ID is required to deploy.");
      return;
    }
    handleSave();

    await deployWorkflow(initialWorkflow.id); 


    notify("Workflow deployed successfully!", "success");

  } catch (error) {
    notify("Error while deploying the workflow. please check the logs", "error");
    console.error(error);
  }
};

 return (
  <div className="w-full h-full relative">
    {/* Barre du haut avec uniquement le nom du workflow */}
    <div className="flex items-center gap-4 p-4 border-b bg-white sticky top-0 z-40">
      <input
        type="text"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        placeholder="Nom du workflow"
        className="flex-grow border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Canvas principal */}
    <div className="w-full h-[90vh] relative overflow-y-auto" style={{ maxHeight: "90vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(event, node) => handleNodeClick(node)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={true}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        style={{ minHeight: 1200 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>

    {/* Panneau de configuration latéral */}
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
            aria-label="Fermer le panneau de configuration"
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
                  nds.map((n) =>
                    n.id === selectedConfigNodeId
                      ? {
                          ...n,
                          data: {
                            ...n.data,
                            step: updatedStep,
                          },
                        }
                      : n
                  )
                );
              }}
              onTest={() => {
                setNodes((nds) =>
                  nds.map((n) =>
                    n.id === selectedConfigNodeId
                      ? {
                          ...n,
                          data: {
                            ...n.data,
                            step: {
                              ...n.data.step,
                              status: "tested",
                            },
                          },
                        }
                      : n
                  )
                );
              }}

            />
          );
        })()}
      </div>
    )}

    {/* Modal de sélection de service */}
    <ServiceSelectorModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      stepType={currentStepType}
      onSelect={handleSelectServiceAction}
    />
<div className="absolute bottom-4 left-4 right-4 z-50 flex justify-between pointer-events-none">
  <button
    onClick={handleDeploy}
    aria-label="Déployer le workflow"
    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-2xl shadow-md transition-all duration-200 pointer-events-auto text-sm font-medium"
  >
    <Rocket className="w-4 h-4" />
    Déployer
  </button>

  <button
    onClick={handleSave}
    aria-label="Sauvegarder le workflow"
    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl shadow-md transition-all duration-200 pointer-events-auto text-sm font-medium"
  >
    <Save className="w-4 h-4" />
    Sauvegarder
  </button>
</div>




  </div>

  
);

}
