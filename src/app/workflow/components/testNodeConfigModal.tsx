import React, { useState, useEffect } from "react";
import NodeConfigModal from "./NodeConfigModal";
import { ActionOrTrigger, ConfigValue } from "@/types/workflow";

// ✅ Nouvelle structure en liste
const fakeTrigger: ActionOrTrigger = {
  identifier: "google-calendar-event-created",
  service_id: "paw",
  name: "google-calendar-event-created",
  type: "trigger",
  config_schema: {},
  parameters: [
    { key: "eventName", name: "Nom de l’événement", type: "text" },
    { key: "startTime", name: "Heure de début", type: "datetime-local" },
    { key: "notify", name: "Notifier", type: "checkbox" },
    { key: "visibility", name: "Visibilité", type: "radio", options: ["public", "private", "default"] },
  ],
};

const fakeAction: ActionOrTrigger = {
  identifier: "action_1",
  service_id: "paw",
  name: "Fake Action",
  type: "action",
  config_schema: {},
  parameters: [
    { key: "param1", name: "Paramètre 1", type: "text" },
    { key: "param2", name: "Paramètre 2", type: "number" },
  ],
};

const TestNodeConfigModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [config, setConfig] = useState<Record<string, ConfigValue>>({});

  // Initialise config selon le trigger choisi
  useEffect(() => {
    const initialConfig: Record<string, ConfigValue> = {};
    fakeTrigger.parameters.forEach((param) => {
      if (param.type === "checkbox") initialConfig[param.key] = false;
      else if (param.type === "datetime-local") initialConfig[param.key] = new Date();
      else if (param.options && param.options.length > 0) initialConfig[param.key] = param.options[0];
      else initialConfig[param.key] = "";
    });
    setConfig(initialConfig);
  }, []);

  const handleChange = (key: string, value: ConfigValue) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (selectedId?: string) => {
    alert(`Saved config for id: ${selectedId}\n` + JSON.stringify(config, null, 2));
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Node Config Modal</button>
      <NodeConfigModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        config={config}
        onChange={handleChange}
        onSave={handleSave}
        trigger={fakeTrigger}
        action={fakeAction}
        service={{ identifier: "google-calendar" }}
        type="trigger"
        triggerOptions={[fakeTrigger]}
        actionOptions={[fakeAction]}
        configSchema={[]} // obsolete, mais requis dans les props
      />
    </div>
  );
};

export default TestNodeConfigModal;
