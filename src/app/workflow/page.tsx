"use client";

import dynamic from "next/dynamic";

// React Flow ne fonctionne pas en SSR, donc on le charge dynamiquement côté client
const WorkflowBuilder = dynamic(() => import('../../components/workflow/WorkFlowBuilder'), {
  ssr: false,
});

export default function WorkflowPage() {
  return <WorkflowBuilder />;
}
