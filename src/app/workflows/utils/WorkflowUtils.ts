
import { Node } from "reactflow";

const NODE_HEIGHT = 120; //  hauteur des noeuds
const VERTICAL_GAP = 80; // espace entre les noeuds
const INSERT_BUTTON_WIDTH = 40;
const INSERT_BUTTON_HEIGHT = 40;
const NODE_X = 250; // position fixe verticale


// Organisation et conversion des nodes 

import { ParameterField, WorkflowData, WorkflowStepInput } from "@/types/workflow";
import { Edge } from "reactflow";

// conversion des steps en noedus
export function convertStepsToNodes(
  steps: WorkflowData["steps"],
  onDeleteNode?: (id: string) => void,
  canDeleteNode?: (id: string) => boolean
  ): Node[] {
  const nodes: Node[] = steps.map((step, index) => ({
    id: step.ref_id,
    type: "customWorkflowNode",
    position: { x: NODE_X, y: 50 + index * (NODE_HEIGHT + VERTICAL_GAP) },
    data: { step, onDeleteNode,canDeleteNode  },
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


export function convertStepsToEdges(steps: WorkflowData["steps"]): Edge[] {
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

  // fonction de reorganisation et position


  export const reorderAndReposition = (nodes: Node[]) => {
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










// nodes par defauts quand le workflow est vide
export const initialWorkflowNode = (
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
      ref_id: `temp-${id}`,
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


export const getLocalNodeIdentifier = (node: Node): string => {
  if (node.type === "customWorkflowNode") {
    return node.data?.step?.ref_id || node.id;
  }
  return node.id;
};


export const isStepIncomplete = (step: WorkflowStepInput): boolean => {
  const isBaseInvalid =
    !step.service ||
    !step.serviceActionId ||
    !((step.type === "action" && step.action) || (step.type === "trigger" && step.trigger));

  const hasMissingParams = step.config.some(param => param.value === undefined || param.value === null || param.value === "");

  return isBaseInvalid || hasMissingParams;
};




export const isWorkflowTested = (steps: WorkflowStepInput[]): boolean => {
  return steps.every(step => step.status === "tested");
};

export const extractStepsFromNodes = (nodes: Node[]): WorkflowStepInput[] => {
  return nodes
    .filter((node) => node.type === "customWorkflowNode")
    .map((node) => node.data?.step)
    .filter(Boolean); 
};



export const initialSteps: WorkflowStepInput[] = [
  {
    ref_id: "temp-trigger",
    name: "Choose a Trigger",
    type: "trigger",
    service: "",
    workflow_id: "",
    status: "draft",
    serviceActionId: "",
    order: 0,
    config: [],
    trigger: "",
    action: "",
  },
  {
    ref_id: "temp-action",
    name: "Choose an Action",
    type: "action",
    service: "",
    workflow_id: "",
    status: "draft",
    serviceActionId: "",
    order: 1,
    config: [],
    trigger: "",
    action: "",
  },
];





// step configurator utils

export const isConfigDifferent = (a: ParameterField[], b: ParameterField[]) => {
  if (a.length !== b.length) return true;

  return a.some((paramA, i) => {
    const paramB = b[i];
    return (
      paramA.key !== paramB.key ||
      paramA.value !== paramB.value
    );
  });
};
