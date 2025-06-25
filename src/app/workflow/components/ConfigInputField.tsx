import React from "react";
import { ConfigValue, parametreType } from "@/types/workflow";

interface ConfigInputFieldProps {
  name: string;
  type: parametreType;
  value: ConfigValue;
  options?: string[];
  onChange: (key: string, value: ConfigValue) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: 14,
  backgroundColor: "#f8f9fc",
};

const ConfigInputField: React.FC<ConfigInputFieldProps> = ({
  name,
  type,
  value,
  options,
  onChange,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (type === "checkbox") {
      onChange(name, (e as React.ChangeEvent<HTMLInputElement>).target.checked);
    } else if (type === "number" || type === "range") {
      onChange(name, Number(e.target.value));
    } else if (type === "date" || type === "datetime-local") {
      onChange(name, new Date(e.target.value));
    } else {
      onChange(name, e.target.value);
    }
  };

  const renderInput = () => {
    // Si options sont présentes → <select>
    if (options && options.length > 0) {
      return (
        <select value={String(value)} onChange={handleChange} style={inputStyle}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    // Sinon → input standard avec le type HTML donné
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={handleChange}
          style={{ transform: "scale(1.2)", marginTop: 6 }}
        />
      );
    }

    let inputValue: string = "";

    if (value instanceof Date) {
      inputValue = value.toISOString().substring(0, 16);
    } else if (typeof value === "string" || typeof value === "number") {
      inputValue = String(value);
    }

    return (
      <input
        type={type}
        value={inputValue}
        onChange={handleChange}
        style={inputStyle}
      />
    );
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>
        {name}
      </label>
      {renderInput()}
    </div>
  );
};

export default ConfigInputField;
