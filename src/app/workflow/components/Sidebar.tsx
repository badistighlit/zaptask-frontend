"use client";

import { ChangeEvent, FormEvent } from "react";
import { Service, ActionOrTrigger } from "@/types/workflow";

interface SidebarProps {
  services: Service[];
  triggers: ActionOrTrigger[];
  actions: ActionOrTrigger[];
  selectedService: string;
  selectedTrigger: string;
  selectedAction: string;
  details: string;
  setSelectedService: (value: string) => void;
  setSelectedTrigger: (value: string) => void;
  setSelectedAction: (value: string) => void;
  setDetails: (value: string) => void;
  onServiceChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  addStep: (e: FormEvent<HTMLFormElement>) => void;
}

export default function Sidebar({
  services,
  selectedService,
  onServiceChange,
  addStep,
}: SidebarProps) {
  return (
<aside className="w-80 bg-white border-l border-gray-300 p-6 overflow-y-auto text-gray-800 sticky top-0 h-screen">
      <h2 className="text-xl font-bold mb-6">Ajouter une étape</h2>

      <form onSubmit={addStep} className="space-y-4">
        <div>
          <label htmlFor="service" className="block mb-1 font-medium">
            Service
          </label>
          <select
            id="service"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedService}
            onChange={onServiceChange}
            required
          >
            <option value="">Choisir un service</option>
            {Array.isArray(services) &&services.map((s) => (
              <option key={s.identifier} value={s.identifier}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Ajouter l’étape
        </button>
      </form>
    </aside>
  );
}
