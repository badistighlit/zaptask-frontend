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
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl font-semibold">Création du workflow en cours...</p>
    </div>
  );
}
