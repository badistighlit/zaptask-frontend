'use client';

import { useEffect, useState } from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Loader } from 'lucide-react';
import { useFetchStats } from '@/services/workflow';
import { FrontStatsData } from '@/types/statsTypes';

const statusColorMap: Record<
  'draft' | 'tested' | 'deployed' | 'error',
  string
> = {
  draft: '#9CA3AF',     // Gray
  tested: '#3B82F6',    // Blue
  deployed: '#22C55E',  // Green
  error: '#EF4444',     // Red
};

export default function StatsPage() {
  const { fetchStats } = useFetchStats();
  const [data, setData] = useState<FrontStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader className="animate-spin w-6 h-6 mr-2" />
        Loading stats...
      </div>
    );
  }

  if (!data) {
    return <div className="text-center mt-10 text-red-500">Failed to load statistics.</div>;
  }

  const failedExecutions = data.executions.statuses.find((s) => s.label === 'error')?.percent ?? 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Workflow Statistics</h1>

      {/* Alert */}
      {failedExecutions > 70 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow">
          <strong className="font-bold">Warning:</strong>{' '}
          <span>More than {failedExecutions}% of executions failed.</span>
        </div>
      )}

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border rounded shadow">
          <p className="text-gray-500 text-sm">Total Workflows</p>
          <p className="text-2xl font-bold">{data.workflows.total}</p>
        </div>
        <div className="p-4 bg-white border rounded shadow">
          <p className="text-gray-500 text-sm">Total Actions</p>
          <p className="text-2xl font-bold">{data.actions.total}</p>
        </div>
        <div className="p-4 bg-white border rounded shadow">
          <p className="text-gray-500 text-sm">Total Executions</p>
          <p className="text-2xl font-bold">{data.executions.total}</p>
        </div>
      </div>

      {/* Workflows by month */}
      <div className="p-4 bg-white border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Workflows by Month</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.workflows.monthlyCounts}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Status breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Workflows by status */}
        <div className="p-4 bg-white border rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Workflows by Status</h2>
          <PieChart width={300} height={200}>
            <Pie
              data={data.workflows.statuses}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {data.workflows.statuses.map((status, i) => (
                <Cell
                  key={i}
                  fill={statusColorMap[status.label as keyof typeof statusColorMap] || '#D1D5DB'}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Actions by status */}
                <div className="p-4 bg-white border rounded shadow">
                <h2 className="text-lg font-semibold mb-2">Actions by Status</h2>
                <BarChart width={300} height={200} data={data.actions.statuses}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count">
                    {data.actions.statuses.map((status, index) => (
                        <Cell
                        key={`cell-${index}`}
                        fill={statusColorMap[status.label as keyof typeof statusColorMap] || '#D1D5DB'}
                        />
                    ))}
                    </Bar>
                </BarChart>
                </div>


        {/* Executions by status */}
        <div className="p-4 bg-white border rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Executions by Status</h2>
          <ul className="text-sm space-y-1">
            {data.executions.statuses.map((status) => (
              <li key={status.label} className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusColorMap[status.label as keyof typeof statusColorMap] }}
                  />
                  <span className="capitalize">{status.label}</span>
                </span>
                <span>
                  {status.count} ({status.percent}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Used services */}
      <div className="p-4 bg-white border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Used Services</h2>
        <div className="flex flex-wrap gap-2">
          {data.usedServices.length ? (
            data.usedServices.map((s) => (
              <span
                key={s}
                className="bg-gray-100 border border-gray-300 text-sm px-2 py-1 rounded"
              >
                {s}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No services used.</span>
          )}
        </div>
      </div>

      {/* Last execution errors */}
      <div className="p-4 bg-white border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Last Execution Errors</h2>
        {data.executions.lastErrors.length ? (
          <ul className="space-y-2 text-sm text-gray-600">
            {data.executions.lastErrors.map((err, idx) => (
              <li key={idx}>
                <strong className="text-red-600">{err.actionId}</strong> —{' '}
                {err.message || 'No message'} ({new Date(err.executedAt).toLocaleString()})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No recent errors.</p>
        )}
      </div>
    </div>
  );
}
