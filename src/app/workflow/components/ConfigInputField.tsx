import React from "react";
import { ConfigValue, ConfigSchemaField } from "@/types/workflow";

interface ConfigInputFieldProps {
  name: string;
  field: ConfigSchemaField;
  value: ConfigValue;
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
  field,
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (field.type.toLowerCase()) {
      case "boolean":
        onChange(name, e.target.checked);
        break;
      case "number":
        onChange(name, Number(e.target.value));
        break;
      case "date":
        onChange(name, new Date(e.target.value));
        break;
      default:
        onChange(name, e.target.value);
    }
  };

  const renderInput = () => {
    switch (field.type) {
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={handleChange}
            style={{ transform: "scale(1.2)", marginTop: 6 }}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={typeof value === "number" ? value : ""}
            onChange={handleChange}
            style={inputStyle}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={
              value instanceof Date
                ? value.toISOString().substring(0, 10)
                : typeof value === "string"
                ? new Date(value).toISOString().substring(0, 10)
                : ""
            }
            onChange={handleChange}
            style={inputStyle}
          />
        );

      default:
        return (
          <input
            type="text"
            value={typeof value === "string" ? value : value?.toString() ?? ""}
            onChange={handleChange}
            style={inputStyle}
          />
        );
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>
        {name}
        {field.description && (
          <span style={{ fontWeight: "normal", color: "#777" }}>
            {" "}({field.description})
          </span>
        )}
      </label>
      {renderInput()}
    </div>
  );
};

export default ConfigInputField;
