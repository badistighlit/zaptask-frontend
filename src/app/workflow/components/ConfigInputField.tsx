import React from "react";
import { ParameterType } from "@/types/workflow";

interface ConfigInputFieldProps {
  name: string;
  type: ParameterType;
  value?: string;  
  options?: string[];
  onChange: (key: string, value: string) => void; 
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
    const target = e.target as HTMLInputElement;
    onChange(name, target.checked ? "true" : "false");
  } else {
    onChange(name, e.target.value);
  }
};

  const renderInput = () => {
    if (options && options.length > 0) {
      return (
        <select value={value || ""} onChange={handleChange} style={inputStyle}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={value === "true"}
          onChange={handleChange}
          style={{ transform: "scale(1.2)", marginTop: 6 }}
        />
      );
    }

    // Pour les dates, datetime-local, on suppose que la value est une string ISO valide
    // Pour number/range, c'est une string numérique

    return (
      <input
        type={type}
        value={value || ""}
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
