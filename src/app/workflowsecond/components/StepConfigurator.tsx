"use client";

import React, { useEffect, useState } from "react";
import {
  ParameterField,
  WorkflowStepInput,
  ConfigValue,
  ParameterType,
} from "@/types/workflow";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface StepConfiguratorProps {
  step: WorkflowStepInput | null;
  onTest?: () => void;
  onChange: (updatedStep: WorkflowStepInput) => void;
}

const StepConfigurator: React.FC<StepConfiguratorProps> = ({
  step,
  onChange,
  onTest,
}) => {
  const [localConfig, setLocalConfig] = useState<ParameterField[]>([]);
  const [activeTab, setActiveTab] = useState("configure");

  useEffect(() => {
    if (step?.config) {
      setLocalConfig(step.config);
    } else {
      setLocalConfig([]);
    }
  }, [step]);

  const handleInputChange = (key: string, newValue: ConfigValue) => {
    const updatedConfig = localConfig.map((param) =>
      param.key === key ? { ...param, value: newValue } : param
    );
    setLocalConfig(updatedConfig);
  };

  const handleSave = () => {
    if (step) {
      onChange({ ...step, config: localConfig });
      alert("Configuration sauvegardée !");
    }
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
    };

    if (param.type === "textarea" || param.type === "multiline") {
      return (
        <textarea
          {...commonProps}
          value={String(value)}
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
            onChange={(e) => handleInputChange(param.key, e.target.value)}
          />{" "}
          {opt}
        </label>
      ));
    }

    return (
      <input
        {...commonProps}
        type={param.type}
        value={String(value)}
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
      <h3 className="text-lg font-semibold mb-2">Configurer : {step.name}</h3>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="configure">Configurer</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

        <TabsContent value="configure">
          {localConfig.length === 0 && (
            <p className="text-gray-500">Aucun paramètre.</p>
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

          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={handleSave}
          >
            Save
          </button>
        </TabsContent>

        <TabsContent value="test" className="flex flex-col items-start gap-4">
          <p className="text-gray-600">
            Ici vous pourrez tester la configuration du step.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => {
              alert("Fonction Test à implémenter");
              if (onTest) onTest();
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
