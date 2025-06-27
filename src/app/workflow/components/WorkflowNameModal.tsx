"use client";
import React, { useState, FormEvent } from "react";

interface WorkflowNameModalProps {
  onSubmit: (name: string) => void;
}

const WorkflowNameModal: React.FC<WorkflowNameModalProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Créer un nouveau workflow</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full border px-3 py-2 mb-4 rounded"
            placeholder="Nom du workflow"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Créer
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkflowNameModal;
