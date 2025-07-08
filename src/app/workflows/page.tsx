"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEmptyWorkflow } from "@/services/workflow";

export default function WorkflowsPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!name.trim()) return alert("Merci de saisir un nom");

    setLoading(true);
    try {
      const workflow = await createEmptyWorkflow(name);
      router.push(`/workflows/${workflow.id}`);
    } catch (e) {
      alert("Erreur lors de la création du workflow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Créer un nouveau workflow</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du workflow"
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleCreate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Création..." : "Créer"}
      </button>
    </div>
  );
}
