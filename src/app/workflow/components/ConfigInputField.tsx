import React from "react";
import { ParameterField, ConfigValue } from "@/types/workflow";

interface ConfigInputFieldProps {
  keyProp: string;
  name: string;
  type: ParameterField["type"];
  value: string;
  options?: string[];
  onChange: (key: string, value: ConfigValue) => void;
}

const ConfigInputField: React.FC<ConfigInputFieldProps> = ({
  keyProp,
  name,
  type,
  value,
  options,
  onChange,
}) => {
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  let val: ConfigValue;

  if (type === "checkbox") {
    const target = e.target as HTMLInputElement;  // cast ici
    val = target.checked ? "true" : "false";
  } else if (type === "number" || type === "range") {
    val = e.target.value === "" ? "" : Number(e.target.value);
  } else {
    val = e.target.value;
  }

  onChange(keyProp, val);
};




  // Gestion des types qui utilisent select (options)
  if (options && options.length > 0) {
    return (
      <div style={{ marginBottom: 12 }}>
        <label htmlFor={keyProp} style={{ display: "block", marginBottom: 4 }}>
          {name}
        </label>
        <select id={keyProp} value={value} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 4 }}>
          <option value="" disabled>
            -- Sélectionner --
          </option>
          {options.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  switch (type) {
    case "checkbox":
      return (
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              id={keyProp}
              checked={value === "true"}
              onChange={handleChange}
              style={{ marginRight: 8 }}
            />
            {name}
          </label>
        </div>
      );

    case "number":
    case "range":
      return (
        <div style={{ marginBottom: 12 }}>
          <label htmlFor={keyProp} style={{ display: "block", marginBottom: 4 }}>
            {name}
          </label>
          <input
            type={type}
            id={keyProp}
            value={value}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, borderRadius: 4 }}
          />
        </div>
      );

    case "date":
    case "datetime-local":
    case "email":
    case "color":
    case "password":
    case "tel":
    case "text":
    case "url":
    case "search":
    case "time":
    case "month":
    case "week":
      return (
        <div style={{ marginBottom: 12 }}>
          <label htmlFor={keyProp} style={{ display: "block", marginBottom: 4 }}>
            {name}
          </label>
          <input
            type={type}
            id={keyProp}
            value={value}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, borderRadius: 4 }}
          />
        </div>
      );

    case "textarea":
      return (
        <div style={{ marginBottom: 12 }}>
          <label htmlFor={keyProp} style={{ display: "block", marginBottom: 4 }}>
            {name}
          </label>
          <textarea
            id={keyProp}
            value={value}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, borderRadius: 4, minHeight: 80 }}
          />
        </div>
      );

    default:
      // Pour types non gérés, on affiche un input text par défaut
      return (
        <div style={{ marginBottom: 12 }}>
          <label htmlFor={keyProp} style={{ display: "block", marginBottom: 4 }}>
            {name} (type {type} non géré)
          </label>
          <input
            type="text"
            id={keyProp}
            value={value}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, borderRadius: 4 }}
          />
        </div>
      );
  }
};

export default ConfigInputField;
