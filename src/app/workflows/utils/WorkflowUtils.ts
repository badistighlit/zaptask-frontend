
import { Node } from "reactflow";

const NODE_HEIGHT = 120; //  hauteur des noeuds
const VERTICAL_GAP = 80; // espace entre les noeuds
const INSERT_BUTTON_WIDTH = 40;
const INSERT_BUTTON_HEIGHT = 40;
const NODE_X = 250; // position fixe verticale


// Organisation et conversion des nodes 

import { WorkflowData } from "@/types/workflow";
import { Edge } from "reactflow";

// conversion des steps en noedus
export function convertStepsToNodes(steps: WorkflowData["steps"],  onDeleteNode?: (id: string) => void
): Node[] {
  const nodes: Node[] = steps.map((step, index) => ({
    id: step.ref_id,
    type: "customWorkflowNode",
    position: { x: NODE_X, y: 50 + index * (NODE_HEIGHT + VERTICAL_GAP) },
    data: { step, onDeleteNode },
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