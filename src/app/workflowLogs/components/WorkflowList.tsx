'use client';

import { WorkflowData } from '@/types/workflow';
import WorkflowCard from '../../myWorkflows/components/WorkflowCard';

interface Props {
  workflows: WorkflowData[];
}

export default function WorkflowList({ workflows }: Props) {
  if (!workflows || workflows.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Aucun workflow trouvé.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}
