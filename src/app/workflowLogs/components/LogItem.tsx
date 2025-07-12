'use client';

import { WorkflowLog } from '@/types/logs';
import clsx from 'clsx';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function LogItem({ log }: { log: WorkflowLog }) {
  const isSuccess = log.status === 'success';

  return (
    <div
      className={clsx(
        'rounded-2xl p-5 shadow-md bg-white space-y-4 w-full overflow-hidden',
        isSuccess ? 'ring-1 ring-green-200' : 'ring-1 ring-red-200'
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-start gap-2 text-gray-800 font-semibold text-base break-all">
          {isSuccess ? (
            <CheckCircle2 className="text-green-600 w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="text-red-600 w-5 h-5 flex-shrink-0" />
          )}
          <div className="flex flex-col">
            <span className="truncate max-w-xs sm:max-w-sm" title={log.actionName}>
              {log.actionName}
            </span>
            <span className="text-sm font-normal text-gray-500 truncate">
              ({log.serviceName})
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 whitespace-nowrap">
          {new Date(log.executedAt).toLocaleString()}
        </div>
      </div>

      {/* HTTP Code */}
      <div className="text-sm text-gray-700">
        <strong>HTTP:</strong> {log.httpCode}
      </div>

      {/* URL */}
      {log.url && (
        <div className="text-sm text-gray-700 break-all">
          <strong>URL:</strong>{' '}
          <span className="text-gray-600">{log.url}</span>
        </div>
      )}

      {/* Parameters */}
      {log.parameters?.length > 0 && (
        <div className="text-sm text-gray-700">
          <strong>Parameters:</strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {log.parameters.map((param, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs break-all max-w-full"
                title={`${param.key}: ${param.value}`}
              >
                {param.key}: {param.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Exception */}
      {log.exception && (
        <div className="overflow-auto max-w-full">
          <pre className="bg-gray-900 text-red-200 text-xs p-4 mt-2 rounded-lg whitespace-pre-wrap break-words font-mono">
            {log.exception}
          </pre>
        </div>
      )}
    </div>
  );
}
