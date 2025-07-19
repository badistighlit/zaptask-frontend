"use client";

import React, { useEffect, useState } from "react";
import {
  ParameterField,
  WorkflowStepInput,
  ConfigValue,
  ParameterType,
  
  WorkflowStatus,
} from "@/types/workflow";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDebounce } from "../hooks/useDebounce";
import { useTestWorkflowAction } from "@/services/workflow";
import { CheckCircle, AlertTriangle, Settings, Table } from "lucide-react";
import TagsInput from "@/components/TagsInput";
import SpreadsheetDialog from "./SpreedsheetDialog";
import { isTableConfigured, TableData } from "../utils/WorkflowUtils";



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


  const [showSpreadsheet, setShowSpreadsheet] = useState(false);


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



  const getInputValue = (value: ConfigValue, type: ParameterType): string | number | string[]  | string[][] => {
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


if (param.type === "array") {
  const tags = Array.isArray(param.value) && param.value.every(item => typeof item === "string")
    ? param.value as string[]
    : [];

  return (
    <TagsInput
      value={tags}
      onChange={(newTags) => handleInputChange(param.key, newTags)}
    />
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
          defaultValue={value ? new Date(String(value)).toISOString().slice(0, 16) : String(value)}
          onChange={(e) => handleInputChange(param.key, e.target.value)}
        />
      );
    }


// gestion feuille de calcul

function isStringMatrix(value: unknown): value is string[][] {
  return (
    Array.isArray(value) &&
    value.every(
      (row) =>
        Array.isArray(row) &&
        row.every((cell) => typeof cell === "string")
    )
  );
}



const isConfigured = isStringMatrix(param.value) && isTableConfigured(param.value);
const buttonColor = isConfigured ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-500 hover:bg-orange-600";




if (param.type === "table") {
return (
  <>
    <button
      className={`inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-md transition-colors ${buttonColor}`}
      onClick={() => setShowSpreadsheet(true)}
    >
      <Table className="w-4 h-4" />
      {isConfigured ? "Edit Spreadsheet" : "Configure Spreadsheet"}
    </button>

    <SpreadsheetDialog
      open={showSpreadsheet}
      onClose={() => setShowSpreadsheet(false)}
      data={isStringMatrix(param.value) ? param.value : [[""]]}
      onSave={(rawTableData: TableData) => {
        const cleanData = rawTableData.map((row) =>
          row.map((cell) =>
            typeof cell === "object" && cell !== null && "value" in cell
              ? cell.value
              : String(cell)
          )
        );
        handleInputChange(param.key, cleanData);
        setShowSpreadsheet(false);
      }}
    />
  </>
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

  <TabsList style={{ backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex" }}>

<TabsTrigger
  value="configure"
  style={{
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderBottom: activeTab === "configure" ? "3px solid #2563EB" : "3px solid transparent",
    fontWeight: activeTab === "configure" ? "700" : "500",
    color: activeTab === "configure" ? "#2563EB" : "#374151",
    backgroundColor: activeTab === "configure" ? "rgba(37, 99, 235, 0.1)" : "transparent",
    cursor: "pointer",
  }}
>
  <Settings size={18} />
  Configure
</TabsTrigger>

<TabsTrigger
  value="test"
  style={{
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderBottom: activeTab === "test" ? "3px solid #2563EB" : "3px solid transparent",
    fontWeight: activeTab === "test" ? "700" : "500",
    color: step?.status === "tested" ? "#22c55e" : "#ea580c", 
    backgroundColor: activeTab === "test" ? "rgba(37, 99, 235, 0.1)" : "transparent", 
  }}
>
  {step?.status === "tested" ? (
    <CheckCircle size={18} color="#22c55e" />
  ) : (
    <AlertTriangle size={18} color="#ea580c" />
  )}
  Test
</TabsTrigger>


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
