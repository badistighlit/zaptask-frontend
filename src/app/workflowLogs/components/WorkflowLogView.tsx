'use client';

import { WorkflowLog } from '@/types/logs';
import LogItem from './LogItem';
import { Activity, AlertTriangle } from 'lucide-react';

export default function WorkflowLogView({ logs }: { logs: WorkflowLog[] }) {

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
  );

  
  const triggers = sortedLogs.filter(log => log.type === 'trigger');
  const actions = sortedLogs.filter(log => log.type === 'action');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-yellow-700">
          <Activity className="w-5 h-5" />
          Triggers
        </h2>
        {triggers.length ? (
          triggers.map(log => <LogItem key={log.id} log={log} />)
        ) : (
          <p className="text-sm text-gray-500">No triggers logged.</p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-green-700">
          <AlertTriangle className="w-5 h-5" />
          Actions
        </h2>
        {actions.length ? (
          actions.map(log => <LogItem key={log.id} log={log} />)
        ) : (
          <p className="text-sm text-gray-500">No actions logged.</p>
        )}
      </div>
    </div>
  );
}
