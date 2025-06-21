"use client";

import React, { useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";

type CustomData = {
  label: string;
  message?: string;
  color?: string;
  description?: string;
};

type CustomAlertNodeProps = {
  id: string;
  data: CustomData;
};

const CustomAlertNode: React.FC<CustomAlertNodeProps> = ({ id, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: data.label || "",
    message: data.message || "",
    color: data.color || "#fdf0d5",
    description: data.description || "",
  });
  
  const { setNodes } = useReactFlow();

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(formData)
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...formData,
              },
            }
          : node
      )
    );
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      label: data.label || "",
      message: data.message || "",
      color: data.color || "#fdf0d5",
      description: data.description || "",
    });
    setIsModalOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <div
        onClick={handleNodeClick}
        style={{
          padding: 12,
          border: "2px solid #333",
          borderRadius: 8,
          background: data.color || "#fdf0d5",
          cursor: "pointer",
          textAlign: "center",
          minWidth: 150,
          maxWidth: 200,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 4 }}>
          {data.label || "Click me!"}
        </div>
        {data.description && (
          <div style={{ fontSize: "12px", color: "#666", fontStyle: "italic" }}>
            {data.description}
          </div>
        )}
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleCancel}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 24,
              borderRadius: 12,
              minWidth: 400,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: 20, color: "#333" }}>
              Modifier le nœud
            </h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>
                Label :
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => handleInputChange("label", e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: 14,
                }}
                placeholder="Entrez le label"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>
                Message :
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: 14,
                  minHeight: 60,
                  resize: "vertical",
                }}
                placeholder="Entrez le message"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>
                Description :
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: 14,
                }}
                placeholder="Description courte (optionnel)"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>
                Couleur de fond :
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                style={{
                  width: 50,
                  height: 30,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 4,
                  backgroundColor: "#007bff",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomAlertNode;