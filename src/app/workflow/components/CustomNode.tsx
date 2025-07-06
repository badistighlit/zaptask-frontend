import React, { useEffect, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import {
  fetchServices,
  fetchTriggersByService,
  fetchActionsByService,
} from "@/services/workflow";
import {
  Service,
  ActionOrTrigger,
  ParametersSchema,
  ConfigValue,
} from "@/types/workflow";
import NodeConfigModal from "./NodeConfigModal";

import "../styles/nodeStyles.css";

export interface CustomNodeData {
  id: string;
  label: string;
  serviceActionId: string;
  type: "trigger" | "action";
  service: string;
  trigger: string;
  action: string;
  configured: boolean;
  config: ParametersSchema;
}

type CustomNodeProps = {
  id: string;
  data: CustomNodeData;
  selected: boolean;
  onChange?: (id: string, data: CustomNodeData) => void;
};

const CustomNode: React.FC<CustomNodeProps> = ({ id, data, selected, onChange }) => {
  const { id: nodeId, label, type, service: serviceId } = data;

  const [modalOpen, setModalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [triggers, setTriggers] = useState<ActionOrTrigger[]>([]);
  const [actions, setActions] = useState<ActionOrTrigger[]>([]);
  const [service, setService] = useState<Service | undefined>(undefined);
  const [trigger, setTrigger] = useState<ActionOrTrigger | undefined>(undefined);
  const [action, setAction] = useState<ActionOrTrigger | undefined>(undefined);

  // Extract config values from ParametersSchema (array) to a map {key: value}
  const extractConfigValues = (params: ParametersSchema): Record<string, ConfigValue> => {
    const res: Record<string, ConfigValue> = {};
    params.forEach(param => {
      res[param.key] = param.value ?? "";
    });
    return res;
  };

  // Extract ParametersSchema from map and update values
  const updateConfigValues = (
    params: ParametersSchema,
    values: Record<string, ConfigValue>
  ): ParametersSchema => {
    return params.map(param => ({
      ...param,
      value: values[param.key] ?? "",
    }));
  };

  // Load services once
  useEffect(() => {
    const loadServices = async () => {
      const allServices = await fetchServices();
      setServices(allServices);
    };
    loadServices();
  }, []);

  // Load service data when data.service changes
  useEffect(() => {
    if (!data.service) {
      setService(undefined);
      setTriggers([]);
      setActions([]);
      return;
    }
    const loadServiceData = async () => {
      const s = services.find(s => s.identifier === data.service);
      setService(s);

      if (s) {
        const trg = await fetchTriggersByService(s.identifier);
        setTriggers(trg);

        const act = await fetchActionsByService(s.identifier);
        setActions(act);
      }
    };
    loadServiceData();
  }, [data.service, services]);

  // Update trigger and action objects when data changes
  useEffect(() => {
    if (!triggers.length || !actions.length) return;

    const trg = triggers.find(t => t.identifier === data.trigger);
    setTrigger(trg);

    const act = actions.find(a => a.identifier === data.action);
    setAction(act);
  }, [data.trigger, data.action, triggers, actions]);

  // Handle config changes in modal
  const handleConfigChange = (key: string, value: ConfigValue) => {
    // Update config map in modal (no immediate update to node data)
  };

  // Save new config from modal
  const handleSaveConfig = (selectedId: string, configMap: Record<string, ConfigValue>) => {
    let newParams: ParametersSchema = [];

    if (type === "trigger") {
      const trg = triggers.find(t => t.identifier === selectedId);
      if (trg) {
        newParams = trg.parameters.map(p => ({
          ...p,
          value: configMap[p.key] ?? "",
        }));
      }
    } else if (type === "action") {
      const act = actions.find(a => a.identifier === selectedId);
      if (act) {
        newParams = act.parameters.map(p => ({
          ...p,
          value: configMap[p.key] ?? "",
        }));
      }
    }

    // Update node data with new config and identifiers
    onChange?.(id, {
      ...data,
      configured: true,
      config: newParams,
      ...(type === "trigger"
        ? { trigger: selectedId }
        : { action: selectedId }),
    });

    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <div className="custom-node" onDoubleClick={openModal} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6, background: "#f9f9f9" }}>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        style={{ background: "#555" }}
      />
      <div>
        <strong>{label}</strong>
      </div>
      <div>
        <small>Type: {type}</small>
      </div>
      <div>
        <small>Service: {service?.name || data.service}</small>
      </div>
      <div>
        <small>
          {type === "trigger" ? `Trigger: ${trigger?.name || data.trigger}` : `Action: ${action?.name || data.action}`}
        </small>
      </div>
      <div>
        <small>Configuré: {data.configured ? "Oui" : "Non"}</small>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ background: "#555" }}
      />

      {modalOpen && service && (
        <NodeConfigModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          config={extractConfigValues(data.config)}
          trigger={trigger}
          action={action}
          service={service}
          configSchema={type === "trigger" ? (trigger?.parameters || []) : (action?.parameters || [])}
          type={type}
          onChange={handleConfigChange}
          onSave={handleSaveConfig}
          triggerOptions={triggers}
          actionOptions={actions}
        />
      )}
    </div>
  );
};

export default CustomNode;
