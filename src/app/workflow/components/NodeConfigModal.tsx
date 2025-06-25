import React, { useEffect, useState } from "react";
import { ActionOrTrigger, ConfigSchema, ConfigValue, parametersSchema, Service } from "@/types/workflow";
import { isConnectedService, connectService } from "@/services/workflow";
import ConfigInputField from "./ConfigInputField";




interface NodeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: Record<string, ConfigValue>;
  trigger?: ActionOrTrigger;
  action?: ActionOrTrigger;
  service?: Service;
  //configSchema: ConfigSchema;
  configSchema: parametersSchema;

  type: "trigger" | "action";
  onChange: (key: string, value: ConfigValue) => void;
  onSave: (selectedId?: string) => void;
  triggerOptions: ActionOrTrigger[];
  actionOptions: ActionOrTrigger[];
}

const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
  onSave,
  trigger,
  action,
  service,
  type,
  triggerOptions,
  actionOptions,
}) => {
  

  const [selectedId, setSelectedId] = useState<string>(
    trigger?.identifier || action?.identifier || ""
  );
  
  const userId: string = "user123";
  const [localSchema, setLocalSchema] = useState<parametersSchema>({});
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const inputStyle = {
    width: "100%",
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 14,
    backgroundColor: "#f8f9fc",
  };

  useEffect(() => {
    const selected =
      type === "trigger"
        ? triggerOptions.find((t) => t.identifier === selectedId)
        : actionOptions.find((a) => a.identifier === selectedId);

    setLocalSchema(selected?.parameters || {});
  }, [selectedId, triggerOptions, actionOptions, type]);

  useEffect(() => {
    const checkConnection = async () => {
      const selected =
        type === "trigger"
          ? triggerOptions.find((t) => t.identifier === selectedId)
          : actionOptions.find((a) => a.identifier === selectedId);

      if (selected && service ) {
        try {
          const connected = await isConnectedService(service.identifier);
          setIsConnected(connected);
        } catch (error) {
          console.error("Erreur de connexion au service", error);
          setIsConnected(false);
        }
      }
    };
    checkConnection();
  }, [selectedId, service, type, triggerOptions, actionOptions, userId]);

  const handleSaveClick = () => {
    onSave(selectedId);
  };

  const handleConnectClick = async () => {
    if (!service || !selectedId || !userId) return;
    try {
      setLoading(true);
      await connectService(service.identifier);
      setIsConnected(true);
    } catch (error) {
      console.error("Échec de la connexion au service :", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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

        {/* Choix de l'action/trigger */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 4 }}>
            {type === "trigger" ? "Choisir un Trigger" : "Choisir une Action"}
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={inputStyle}
          >
            <option value="" disabled>-- Sélectionner --</option>
            {(type === "trigger" ? triggerOptions : actionOptions).map((opt) => (
              <option key={opt.identifier} value={opt.identifier}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Connexion service */}
        {!isConnected ? (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <p style={{ color: "#666" }}>Ce service n est pas encore connecté.</p>
            <button
              onClick={handleConnectClick}
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        ) : (
          <>
           {Object.entries(localSchema).map(([key, field]) => (
              <ConfigInputField
                key={key}
                name={key}
                type={field.type}
                options={field.options}
                value={config[key]}
                onChange={onChange}
              />
))}

            {/* Boutons */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default NodeConfigModal;
