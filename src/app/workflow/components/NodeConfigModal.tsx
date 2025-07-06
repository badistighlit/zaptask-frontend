import React, { useEffect, useState } from "react";
import { ParametersSchema, ConfigValue, ActionOrTrigger, Service } from "@/types/workflow";
import ConfigInputField from "./ConfigInputField";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./NodeConfigTabs";
import { isConnectedService, connectService } from "@/services/workflow";

interface NodeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: Record<string, ConfigValue>;
  trigger?: ActionOrTrigger;
  action?: ActionOrTrigger;
  service?: Service;
  configSchema: ParametersSchema;
  type: "trigger" | "action";
  onChange: (key: string, value: ConfigValue) => void;
  onSave: (selectedId: string, config: Record<string, ConfigValue>) => void;
  triggerOptions: ActionOrTrigger[];
  actionOptions: ActionOrTrigger[];
}

const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  trigger,
  action,
  service,
  type,
  onChange,
  onSave,
  triggerOptions,
  actionOptions,
}) => {
  const [selectedId, setSelectedId] = useState<string>(trigger?.identifier || action?.identifier || "");
  const [localSchema, setLocalSchema] = useState<ParametersSchema>([]);
  const [tab, setTab] = useState("config");
  const [isServiceConnected, setIsServiceConnected] = useState(true);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [localConfig, setLocalConfig] = useState<Record<string, ConfigValue>>({});

  // Sync local config with props
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  // Select default trigger/action
  useEffect(() => {
    const list = type === "trigger" ? triggerOptions : actionOptions;
    if (!selectedId || !list.some(item => item.identifier === selectedId)) {
      setSelectedId(list[0]?.identifier || "");
    }
  }, [triggerOptions, actionOptions, type, selectedId]);

  // Update schema and config when selection changes
  useEffect(() => {
    const list = type === "trigger" ? triggerOptions : actionOptions;
    const selected = list.find(item => item.identifier === selectedId);
    if (selected) {
      setLocalSchema(selected.parameters || []);
      // Recreate localConfig based on parameters, keep existing values if present
      const newConfig: Record<string, ConfigValue> = {};
      selected.parameters?.forEach(param => {
        newConfig[param.key] = localConfig[param.key] ?? "";
      });
      setLocalConfig(newConfig);
    } else {
      setLocalSchema([]);
      setLocalConfig({});
    }
  }, [selectedId, triggerOptions, actionOptions, type]);

  // Check if the user is connected to the service
  useEffect(() => {
    if (!service?.identifier) return;

    const checkConnection = async () => {
      setCheckingConnection(true);
      try {
        const connected = await isConnectedService(service.identifier);
        setIsServiceConnected(connected);
      } catch (e) {
        console.error("Erreur de vérification de la connexion :", e);
        setIsServiceConnected(false);
      } finally {
        setCheckingConnection(false);
      }
    };

    checkConnection();
  }, [service?.identifier]);

  const handleFieldChange = (key: string, value: ConfigValue) => {
    const field = localSchema.find(f => f.key === key);
    let newValue: ConfigValue = value;

    if (field?.type === "checkbox") {
      // Convert string "true"/"false" to boolean
      if (typeof value === "string") {
        newValue = value === "true";
      }
    }

    setLocalConfig(prev => ({ ...prev, [key]: newValue }));
    onChange(key, newValue);
  };

  const validateConfig = (): boolean =>
    localSchema.every(field => {
      const val = localConfig[field.key];
      if (field.required) {
        if (field.type === "checkbox") return val === true || val === false;
        if (["number", "range"].includes(field.type)) return val !== undefined && !isNaN(Number(val));
        return val !== undefined && val !== null && String(val).trim() !== "";
      }
      return true;
    });

  const handleSave = () => {
    const list = type === "trigger" ? triggerOptions : actionOptions;
    const selected = list.find(item => item.identifier === selectedId);

    if (!selected) {
      alert("Veuillez sélectionner un élément valide.");
      return;
    }

    if (!validateConfig()) {
      alert("Veuillez remplir tous les champs requis correctement.");
      return;
    }

    onSave(selected.identifier, localConfig);
  };

  const handleConnectClick = async () => {
    if (!service?.identifier) return;

    try {
      await connectService(service.identifier);

      const interval = setInterval(async () => {
        try {
          const connected = await isConnectedService(service.identifier);
          if (connected) {
            clearInterval(interval);
            setIsServiceConnected(true);
          }
        } catch (err) {
          console.error("Polling de connexion échoué :", err);
        }
      }, 1000);
    } catch (e) {
      console.error("Connexion au service échouée :", e);
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
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 12,
          minWidth: 500,
          maxWidth: "90vw",
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>
          Configurer {type === "trigger" ? "le déclencheur" : "l'action"}
        </h2>

        {checkingConnection ? (
          <p>Vérification de la connexion au service...</p>
        ) : !isServiceConnected ? (
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: "red", marginBottom: 8 }}>
              Vous n&apos;êtes pas connecté à ce service.
            </p>
            <button
              onClick={handleConnectClick}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
              }}
            >
              Se connecter au service
            </button>
          </div>
        ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="test" disabled={!validateConfig()}>
                Tester
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config">
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: 4 }}>
                  {type === "trigger" ? "Choisir un Trigger" : "Choisir une Action"}
                </label>
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  style={{ width: "100%", padding: 10, borderRadius: 6 }}
                >
                  <option value="" disabled>
                    -- Sélectionner --
                  </option>
                  {(type === "trigger" ? triggerOptions : actionOptions).map(opt => (
                    <option key={opt.identifier} value={opt.identifier}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {localSchema.map(field => {
                let fieldValue: string;
                const val = localConfig[field.key];

                if (field.type === "checkbox") {
                  if (typeof val === "boolean") {
                    fieldValue = val ? "true" : "false";
                  } else if (typeof val === "string") {
                    fieldValue = val === "true" ? "true" : "false";
                  } else {
                    fieldValue = "false";
                  }
                } else if (field.type === "number" || field.type === "range") {
                  fieldValue = val !== undefined && val !== null ? String(val) : "";
                } else {
                  fieldValue = val !== undefined && val !== null ? String(val) : "";
                }

                return (
                  <ConfigInputField
                    key={field.key}
                    keyProp={field.key}
                    name={field.name}
                    type={field.type}
                    options={field.options}
                    value={fieldValue}
                    onChange={handleFieldChange}
                  />
                );
              })}

              {!validateConfig() && (
                <p style={{ color: "red", fontSize: 12, marginTop: 8 }}>
                  Veuillez remplir tous les champs requis.
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                <button
                  onClick={onClose}
                  style={{ marginRight: 10, padding: "8px 16px", borderRadius: 6 }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                  }}
                >
                  Sauvegarder
                </button>
              </div>
            </TabsContent>

            <TabsContent value="test">
              <p>Tous les champs sont remplis. Interface de test ici.</p>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default NodeConfigModal;
