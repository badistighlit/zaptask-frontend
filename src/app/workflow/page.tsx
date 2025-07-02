"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createEmptyWorkflow } from "@/services/workflow";

export default function WorkflowPage() {
  const router = useRouter();

  useEffect(() => {
    const createDraft = async () => {
      try {
        const now = new Date();
        const formattedDate = now.toISOString().replace(/[:.]/g, "-");
        const draftName = `draft-${formattedDate}`;

        const res = await createEmptyWorkflow(draftName);
        router.push(`/workflow/${res.id}`);
      } catch (err) {
        console.error("Erreur lors de la création du draft workflow :", err);
      }
    };

    createDraft();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <svg
        className="animate-spin h-12 w-12 text-indigo-600 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p className="text-xl font-semibold text-gray-700">
        Création du workflow en cours...
      </p>
    </div>
  );
}
