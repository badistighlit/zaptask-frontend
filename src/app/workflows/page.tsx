"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createEmptyWorkflow } from "@/services/workflow";
import { date } from "yup";

export default function WorkflowsPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const createWorkflow = async () => {
      try {
        const workflow = await createEmptyWorkflow("draft - " + new Date().toISOString());
        router.push(`/workflows/${workflow.id}`);
      } catch (e) {
        console.error("Erreur lors de la création du workflow :", e);
        alert("Erreur lors de la création du workflow");
        setLoading(false);
      }
    };

    createWorkflow();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {loading && (
        <>
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
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
          <p className="text-lg font-medium">Création du workflow...</p>
        </>
      )}
    </div>
  );
}
