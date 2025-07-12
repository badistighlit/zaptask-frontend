'use client';

import { WorkflowData } from '@/types/workflow';
import Link from 'next/link';

export default function WorkflowListItem({ workflow }: { workflow: WorkflowData }) {
  const name = workflow.name ?? "Nom non défini";
  const status = workflow.status ?? "Statut inconnu";
  const savedAt = workflow.savedAt
    ? new Date(workflow.savedAt).toLocaleString()
    : "Date inconnue";

  return (
    <Link href={`/logs/${workflow.id}`}>
      <div className="border p-4 rounded-xl shadow hover:bg-gray-50 transition cursor-pointer">
        <div className="font-bold text-lg">{name}</div>
        <div className="text-sm text-gray-500">Status: {status}</div>
        <div className="text-xs text-gray-400">Saved at: {savedAt}</div>
      </div>
    </Link>
  );
}
