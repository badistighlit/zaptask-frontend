"use client";

import React, { useEffect, useState } from "react";
import {
  ParameterField,
  WorkflowStepInput,
  ConfigValue,
  ParameterType,
} from "@/types/workflow";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDebounce } from "../hooks/useDebounce"; // Assure-toi d’avoir ce hook
import { useTestWorkflowAction } from "@/services/workflow";
import { WorkflowActionStatus } from "@/types/workflow";

interface StepConfiguratorProps {
  step: WorkflowStepInput | null;
  onChange: (updatedStep: WorkflowStepInput) => void;
}

const StepConfigurator: React.FC<StepConfiguratorProps> = ({
  step,
  onChange,
  
}) => {
  const [localConfig, setLocalConfig] = useState<ParameterField[]>([]);
  const [activeTab, setActiveTab] = useState("configure");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { testWorkflowAction } = useTestWorkflowAction(); // test


  // Débounce localConfig pour éviter les sauvegardes à chaque frappe
  const debouncedConfig = useDebounce(localConfig, 600);

  useEffect(() => {
    if (step?.config && Array.isArray(step.config)) {
      setLocalConfig(step.config);
    } else {
      setLocalConfig([]);
    }
  }, [step?.ref_id]);

  useEffect(() => {
    if (!step) return;
    onChange({ ...step, config: debouncedConfig });
    setLastSaved(new Date());
  }, [debouncedConfig]);


  //si les la liste des options est à 1 on pose default value  avec la premiere value
  useEffect(() => {
  const updatedConfig = localConfig.map((param) => {
    if (
      param.type === "select" &&
      Array.isArray(param.options) &&
      param.options.length > 0 &&
      (param.value === undefined || param.value === null || param.value === "")
    ) {
      return { ...param, value: param.options[0] };
    }
    return param;
  });

  const changed = updatedConfig.some((p, i) => p.value !== localConfig[i].value);
  if (changed) {
    setLocalConfig(updatedConfig);
  }
}, [localConfig]);






  const handleInputChange = (key: string, newValue: ConfigValue) => {
    const updatedConfig = localConfig.map((param) =>
      param.key === key ? { ...param, value: newValue } : param
    );
    setLocalConfig(updatedConfig);
  };

  const getInputValue = (value: ConfigValue, type: ParameterType): string | number => {
    if (value === undefined || value === null) return "";
    if (type === "checkbox") return ""; // géré par checked
    if (typeof value === "boolean") return value ? "true" : "false";
    return value;
  };

  const renderField = (param: ParameterField) => {
    const inputId = `param-${param.key}`;
    const value = getInputValue(param.value, param.type);

    const commonProps = {
      id: inputId,
      required: param.required,
      className: "w-full border px-2 py-1 rounded",
      name: param.key,
      autoComplete: "on", // Permet le remplissage automatique
    };

    if (param.type === "textarea" || param.type === "multiline") {
      return (
        <textarea
          {...commonProps}
          defaultValue={String(value)}
          onChange={(e) => handleInputChange(param.key, e.target.value)}
        />
      );
    }

    if (param.type === "datetime") {
      return (
        <input
          {...commonProps}
          type="datetime-local"
          defaultValue={String(value)}
          onChange={(e) => handleInputChange(param.key, e.target.value)}
        />
      );
    }

    if (param.type === "checkbox") {
      return (
        <input
          {...commonProps}
          type="checkbox"
          checked={Boolean(param.value)}
          autoComplete="off" // souvent off pour checkbox
          onChange={(e) => handleInputChange(param.key, e.target.checked)}
        />
      );
    }

    if (param.type === "radio" && param.options) {
      return param.options.map((opt) => (
        <label key={opt} className="mr-4">
          <input
            type="radio"
            name={param.key}
            value={opt}
            checked={param.value === opt}
            autoComplete="off"
            onChange={(e) => handleInputChange(param.key, e.target.value)}
          />{" "}
          {opt}
        </label>
      ));
    }

if (param.type === "select" && Array.isArray(param.options) && param.options.length > 0) {
  return (
    <label key={param.key} className="mr-4">
      <select
        name={param.key}
        value={typeof param.value === "string" || typeof param.value === "number" ? param.value : param.options[0]}
        autoComplete="on"
        onChange={(e) => handleInputChange(param.key, e.target.value)}
        disabled={param.options.length === 1}
      >
        {param.options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}





    // Par défaut input texte/number
    return (
      <input
        {...commonProps}
        type={param.type}
        defaultValue={String(value)}
        onChange={(e) => {
          if (param.type === "number") {
            const numVal = e.target.value === "" ? "" : Number(e.target.value);
            handleInputChange(param.key, numVal);
          } else {
            handleInputChange(param.key, e.target.value);
          }
        }}
      />
    );
  };

  if (!step) return null;

  return (
    <div className="space-y-4 p-4 border rounded bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Configurer : {step.name}</h3>
        {lastSaved && (
          <span className="text-sm text-gray-500">
            Auto-saved à {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="configure">Configurer</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

        <TabsContent value="configure">
          {localConfig.length === 0 && (
            <p className="text-gray-500">Nothing to parametre.</p>
          )}

          {localConfig.map((param) => (
            <div key={param.key} className="space-y-1 mb-4">
              <label htmlFor={`param-${param.key}`} className="block font-medium">
                {param.name} {param.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(param)}
              {param.description && (
                <p className="text-sm text-gray-500">{param.description}</p>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="test" className="flex flex-col items-start gap-4">
          <p className="text-gray-600">
            Here you can test your action.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={async () => {
                  if (step) {
                    const result = await testWorkflowAction(step);
                    const newStatus: WorkflowActionStatus = result === "success" ? "tested" : "error";
                    const updatedStep = { ...step, status: newStatus };
                    onChange(updatedStep);
                  }
                }}
          >
            Test
          </button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StepConfigurator;
