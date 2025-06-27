import React, { useEffect, useState } from "react";
import { parametersSchema } from "@/types/workflow";
import ConfigInputField from "./ConfigInputField";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./NodeConfigTabs";

interface ActionOrTrigger {
  identifier: string;
  name: string;
  type: "trigger" | "action";
  parameters: parametersSchema;
}

interface Service {
  identifier: string;
}

interface NodeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: Record<string, any>;
  trigger?: ActionOrTrigger;
  action?: ActionOrTrigger;
  service?: Service;
  configSchema: parametersSchema;
  type: "trigger" | "action";
  onChange: (key: string, value: any) => void;
  onSave: (selectedId?: string) => void;
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
  configSchema,
  type,
  onChange,
  onSave,
  triggerOptions,
  actionOptions,
}) => {
  const [selectedId, setSelectedId] = useState<string>(trigger?.identifier || action?.identifier || "");
  const [localSchema, setLocalSchema] = useState<parametersSchema>([]);
  const [tab, setTab] = useState("config");

  useEffect(() => {
    const selected = (type === "trigger" ? triggerOptions : actionOptions).find(t => t.identifier === selectedId);
    setLocalSchema(selected?.parameters || []);
  }, [selectedId, triggerOptions, actionOptions, type]);

  const validateConfig = (): boolean => {
    return localSchema.every((field) => {
      const val = config[field.key];

      if (field.type === "checkbox") {
        return typeof val === "boolean";
      }

      if (field.type === "number" || field.type === "range") {
        return val !== undefined && !isNaN(Number(val));
      }

      return val !== undefined && val !== null && String(val).trim() !== "";
    });
  };

  const isValid = validateConfig();

  const handleSave = () => {
    onSave(selectedId);
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

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="test" disabled={!isValid}>
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
                onChange={(e) => setSelectedId(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 6 }}
              >
                <option value="" disabled>
                  -- Sélectionner --
                </option>
                {(type === "trigger" ? triggerOptions : actionOptions).map((opt) => (
                  <option key={opt.identifier} value={opt.identifier}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {localSchema.map((field) => (
              <ConfigInputField
                key={field.key}
                name={field.name}
                type={field.type}
                options={field.options}
                value={config[field.key]}
                onChange={onChange}
              />
            ))}

            {!isValid && (
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
            <p> Tous les champs sont remplis. Interface de test ici.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NodeConfigModal;
