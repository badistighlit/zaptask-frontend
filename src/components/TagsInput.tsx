"use client";
import { useState, useEffect } from "react";

interface TagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function TagsInput({ value, onChange }: TagsInputProps) {
  const [tags, setTags] = useState<string[]>(value || []);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setTags(value || []);
  }, [value]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed) && !trimmed.includes(" ")) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      onChange(newTags);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange(newTags);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              backgroundColor: "#e2e8f0",
              padding: "0.25rem 0.5rem",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              color: "#000"
            }}
          >
            {tag}
            <span
              onClick={() => removeTag(index)}
              style={{
                cursor: "pointer",
                paddingLeft: "0.25rem",
                fontSize: "0.75rem",
                color: "#4a5568"
              }}
            >
              ✕
            </span>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type and then press <Enter/Return> or <Space>"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          padding: "0.5rem",
          border: "1px solid #cbd5e0",
          borderRadius: "0.375rem"
        }}
      />
    </div>
  );
}
