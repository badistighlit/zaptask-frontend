"use client";

import React, { useEffect, useState } from "react";
import {
  ParameterField,
  WorkflowStepInput,
  ConfigValue,
  ParameterType,
  WorkflowActionStatus,
  WorkflowStatus,
} from "@/types/workflow";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDebounce } from "../hooks/useDebounce";
import { useTestWorkflowAction } from "@/services/workflow";

interface StepConfiguratorProps {
  step: WorkflowStepInput | null;
  onChange: (updatedStep: WorkflowStepInput) => void;
  onWorkflowStatusChange : (workflowStatus : WorkflowStatus) => void;
 
}

const StepConfigurator: React.FC<StepConfiguratorProps> = ({ step, onChange, onWorkflowStatusChange }) => {
  const [localConfig, setLocalConfig] = useState<ParameterField[]>([]);
  const [activeTab, setActiveTab] = useState("configure");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { testWorkflowAction } = useTestWorkflowAction();

  const debouncedConfig = useDebounce(localConfig, 600);

useEffect(() => {
  if (!step) return;

  if (!Array.isArray(step.config)) return;

  if (step.config.length === 0) {
    return;
  }

  setLocalConfig(step.config);
}, [step]);




  useEffect(() => {
    if (!step) return;
    onChange({ ...step, config: debouncedConfig });
    setLastSaved(new Date());
  }, [debouncedConfig]);



  useEffect(() => {
    const updated = localConfig.map((param) => {
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

    const changed = updated.some((p, i) => p.value !== localConfig[i].value);
    if (changed) setLocalConfig(updated);
  }, [localConfig]);




const handleInputChange = (key: string, newValue: ConfigValue) => {
  const updated = localConfig.map((param) =>
    param.key === key ? { ...param, value: newValue } : param
  );

  setLocalConfig(updated);

  onChange({
    ...step!,
    config: updated,
    status: "draft",
  });

  setLastSaved(new Date());
};



  const getInputValue = (value: ConfigValue, type: ParameterType): string | number => {
    if (value === undefined || value === null) return "";
    if (type === "checkbox") return "";
    if (typeof value === "boolean") return value ? "true" : "false";
    return value;
  };

  const renderField = (param: ParameterField) => {
    const inputId = `param-${param.key}`;
    const value = getInputValue(param.value, param.type);

    const baseInput =
      "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm";

  if (!step || !Array.isArray(step.config)) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        Loading configuration...
      </div>
    );
  }



    if (param.type === "textarea" || param.type === "multiline") {
      return (
        <textarea
          id={inputId}
          className={baseInput}
          name={param.key}
          required={param.required}
          defaultValue={String(value)}
          onChange={(e) => handleInputChange(param.key, e.target.value)}
        />
      );
    }

    if (param.type === "datetime") {
      return (
        <input
          type="datetime-local"
          className={baseInput}
          id={inputId}
          name={param.key}
          required={param.required}
          defaultValue={String(value)}
          onChange={(e) => handleInputChange(param.key, e.target.value)}
        />
      );
    }

    if (param.type === "checkbox") {
      return (
        <input
          type="checkbox"
          id={inputId}
          className="h-5 w-5 text-blue-600"
          checked={Boolean(param.value)}
          onChange={(e) => handleInputChange(param.key, e.target.checked)}
        />
      );
    }

    if (param.type === "radio" && param.options) {
      return param.options.map((opt) => (
        <label key={opt} className="mr-4 text-sm">
          <input
            type="radio"
            name={param.key}
            value={opt}
            checked={param.value === opt}
            onChange={(e) => handleInputChange(param.key, e.target.value)}
            className="mr-1"
          />
          {opt}
        </label>
      ));
    }

    if (param.type === "select" && param.options?.length) {
      return (
        <select
          name={param.key}
          className={baseInput}
          value={
            typeof param.value === "string" || typeof param.value === "number"
              ? param.value
              : param.options[0]
          }
          onChange={(e) => handleInputChange(param.key, e.target.value)}
          disabled={param.options.length === 1}
        >
          {param.options.map((opt, index) => (
            <option key={index} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={param.type === "number" ? "number" : "text"}
        className={baseInput}
        id={inputId}
        name={param.key}
        required={param.required}
        defaultValue={String(value)}
        onChange={(e) => {
          const val = param.type === "number" ? Number(e.target.value) : e.target.value;
          handleInputChange(param.key, val);
        }}
      />
    );
  };

  if (!step) return null;

  return (
    <div className="space-y-6 p-6 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          Configure: <span className="text-blue-600">{step.name}</span>
        </h3>
        {lastSaved && (
          <span className="text-sm text-gray-500">
            Auto-saved at {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white rounded shadow-sm">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

<TabsContent value="configure">
  {!step?.config ? (
    <p className="text-gray-400 italic mt-2">Loading parameters…</p>
  ) : localConfig.length === 0 ? (
    <p className="text-gray-500 italic mt-2">No parameters to configure.</p>
  ) : (
    localConfig.map((param) => (
      <div key={param.key} className="space-y-1 mb-4">
        <label htmlFor={`param-${param.key}`} className="font-medium block">
          {param.name} {param.required && <span className="text-red-500">*</span>}
        </label>
        {renderField(param)}
        {param.description && (
          <p className="text-sm text-gray-500">{param.description}</p>
        )}
      </div>
    ))
  )}
</TabsContent>


        <TabsContent value="test" className="pt-4">
          <p className="text-gray-600 mb-4">Test this action’s behavior.</p>
          <button
            type="button"
                    onClick={async () => {
                      if (step) {
                        const [workflowStatus, actionStatus] = await testWorkflowAction(step);

                        // maj le step
                        onChange({ ...step, status: actionStatus });

                        // majle  workflow global
                        onWorkflowStatusChange?.(workflowStatus);
                      }
                    }}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Run Test
          </button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StepConfigurator;
