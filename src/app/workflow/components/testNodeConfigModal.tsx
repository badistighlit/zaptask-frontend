import React, { useState } from "react";
import NodeConfigModal from "./NodeConfigModal";
import { ActionOrTrigger, ConfigValue, parametersSchema } from "@/types/workflow";

const fakeTrigger: ActionOrTrigger = {
  identifier: "google-calendar-event-created",
  name: "google-calendar-event-created",
  type: "trigger",
  config_schema: {},
  parameters: {
    eventName: { name: "eventName", type: "text" },
    startTime: { name: "startTime", type: "datetime-local" },
    notify: { name: "notify", type: "checkbox" },
    visibility: { name: "visibility", type: "radio", options: ["public", "private", "default"] },
  } as parametersSchema,
};

const fakeAction: ActionOrTrigger = {
  identifier: "action_1",
  name: "Fake Action",
  type: "action",
  config_schema: {},
  parameters: {
    param1: { name: "param1", type: "text" },
    param2: { name: "param2", type: "number" },
  } as parametersSchema,
};

const TestNodeConfigModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [config, setConfig] = useState<Record<string, ConfigValue>>({
    eventName: "",
    startTime: new Date(),
    notify: false,
    visibility: "public",
  });

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
        configSchema={{}}
      />
    </div>
  );
};

export default TestNodeConfigModal;
