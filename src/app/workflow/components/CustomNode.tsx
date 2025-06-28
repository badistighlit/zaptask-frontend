import React, { useEffect, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import {
  fetchServices,
  fetchTriggersByService,
  fetchActionsByService,
} from "../../../services/workflow";
import {
  Service,
  ActionOrTrigger,
  ConfigValue,
  parametersSchema,
} from "@/types/workflow";
import NodeConfigModal from "./NodeConfigModal";

import "../styles/nodeStyles.css";
import TestNodeConfigModal from "./testNodeConfigModal";

export interface CustomNodeData {
  id: string;
  label: string;
  type: "trigger" | "action";
  service: string;
  trigger: string;
  action: string;
  configured: boolean;
  config: Record<string, ConfigValue>;
}

type CustomNodeProps = {
  id: string;
  data: CustomNodeData;
};

const CustomNode: React.FC<CustomNodeProps> = ({ id, data }) => {
  const { setNodes } = useReactFlow();

  const [services, setServices] = useState<Service[]>([]);
  const [triggers, setTriggers] = useState<ActionOrTrigger[]>([]);
  const [actions, setActions] = useState<ActionOrTrigger[]>([]);
  const [formConfig, setFormConfig] = useState<Record<string, ConfigValue>>(
    data.config || {}
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchServices().then(setServices).catch(console.error);
  }, []);

  useEffect(() => {
    if (data.service) {
      fetchTriggersByService(data.service)
        .then(setTriggers)
        .catch(console.error);
      fetchActionsByService(data.service)
        .then(setActions)
        .catch(console.error);
    }
  }, [data.service]);

  const serviceObj = services.find((s) => s.identifier === data.service);
  const triggerObj = triggers.find((t) => t.identifier === data.trigger);
  const actionObj = actions.find((a) => a.identifier === data.action);

  const configSchema: parametersSchema =
    triggerObj?.parameters || actionObj?.parameters || [];

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormConfig(data.config || {});
    setIsModalOpen(true);
  };

  const handleConfigChange = (key: string, value: ConfigValue) => {
    setFormConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancel = () => setIsModalOpen(false);

const handleSave = (selectedId?: string) => {
  if (!selectedId) return;

  const updatedData: CustomNodeData = {
    ...data,
    config: formConfig,
    configured: true,
    ...(data.type === "trigger"
      ? { trigger: selectedId }
      : { action: selectedId }),
  };

  setNodes((nds) =>
    nds.map((n) => (n.id === id ? { ...n, data: updatedData } : n))
  );

  setIsModalOpen(false);
};


  return (
    <>
      <div
        onClick={handleNodeClick}
        className={`custom-node ${data.type === "trigger" ? "trigger-node" : "action-node"}`}
      >
        <div className="type-badge">
          {data.type === "trigger" ? "Trigger" : "Action"}
        </div>
        <div className="label">{data.label || "Étape"}</div>
        <div className="info">Service: {serviceObj?.name || data.service}</div>
        <div className="info">
          {data.type === "trigger"
            ? `Trigger: ${triggerObj?.name || data.trigger}`
            : `Action: ${actionObj?.name || data.action}`}
        </div>

        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>

           <NodeConfigModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        config={formConfig}
        configSchema={configSchema}
        trigger={triggerObj}
        action={actionObj}
        service={serviceObj}
        type={data.type}
        triggerOptions={triggers}
        actionOptions={actions}
        onChange={handleConfigChange}
        onSave={handleSave}
      />
    </>
  );
};

export default CustomNode;
