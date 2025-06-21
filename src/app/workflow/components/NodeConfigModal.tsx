import React, { useState } from "react";
import { Action, ConfigSchema, Service, Trigger } from "@/types/workflow";

interface NodeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: Record<string, string>;
  trigger?: Trigger;
  action?: Action;
  service?: Service;
  configSchema: ConfigSchema;
  type: "trigger" | "action";
  onChange: (key: string, value: string) => void;
  onSave: (selectedId?: string) => void;
  triggerOptions: Trigger[];
  actionOptions: Action[];
}

const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  configSchema,
  onChange,
  onSave,
  trigger,
  action,
  type,
  triggerOptions,
  actionOptions,
}) => {


  const [selectedId, setSelectedId] = useState<string>(
    trigger?.id || action?.id || ""
  );


   if (!isOpen) return null;
  const handleSaveClick = () => {
    onSave(selectedId); 
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fffdf5",
          padding: 28,
          borderRadius: 14,
          minWidth: 450,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          color: "#333",
          border: "1px solid #ddd",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: 20,
            paddingBottom: 10,
            borderBottom: "2px solid #007bff",
            color: "#007bff",
            fontSize: "1.3rem",
          }}
        >
          Configurer le nœud
        </h3>

        {/* Choix Trigger ou Action */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: 4,
              color: "#333",
            }}
          >
            {type === "trigger" ? "Choisir un Trigger" : "Choisir une Action"}
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 14,
              backgroundColor: "#f8f9fc",
            }}
          >
            <option value="" disabled>
              -- Sélectionner --
            </option>
            {(type === "trigger" ? triggerOptions : actionOptions).map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Config */}
        {Object.keys(configSchema).length === 0 ? (
          <p style={{ color: "#555" }}>Aucune configuration nécessaire</p>
        ) : (
          Object.entries(configSchema).map(([key, field]) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: 4,
                  color: "#333",
                }}
              >
                {key}
                {field.description && (
                  <span style={{ fontWeight: "normal", color: "#777" }}>
                    {" "}
                    ({field.description})
                  </span>
                )}
              </label>
              <input
                type="text"
                value={config[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  fontSize: 14,
                  backgroundColor: "#f8f9fc",
                }}
              />
            </div>
          ))
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            marginTop: 24,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: 6,
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSaveClick}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: 6,
              backgroundColor: "#007bff",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeConfigModal;
