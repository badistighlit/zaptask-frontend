"use client";

import WorkflowBuilder from "./components/WorkflowBuilder";

export default function WorkflowBuilderPage() {
  return (
    <div className="h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Workflow Builder</h1>
      <div className="flex-1 border rounded-md overflow-hidden">
        <WorkflowBuilder />
      </div>
    </div>
  );
}
