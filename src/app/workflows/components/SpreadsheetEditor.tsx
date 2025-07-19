"use client";
import { useEffect, useState } from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import { Plus } from "lucide-react";

interface SpreadsheetEditorProps {
  value: Matrix<CellBase<string>>;
  onChange: (value: Matrix<CellBase<string>>) => void;
}

export default function SpreadsheetEditor({
  value,
  onChange,
}: SpreadsheetEditorProps) {
  const emptyRow = Array(8).fill({ value: "" });
  const emptyMatrix = Array(8)
    .fill(null)
    .map(() => [...emptyRow]);

  const [data, setData] = useState<Matrix<CellBase<string>>>(
    value?.length ? value : emptyMatrix
  );

  useEffect(() => {
    onChange(data);
  }, [data, onChange]);

  const addRow = () => {
    setData((prevData) => [
      ...prevData,
      prevData[0].map(() => ({ value: "" })),
    ]);
  };

  const addColumn = () => {
    setData((prevData) => prevData.map((row) => [...row, { value: "" }]));
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm overflow-auto max-w-full text-black">
      <div className="mb-3 flex gap-3">
        <button
          onClick={addRow}
          className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          aria-label="Add Row"
        >
          <Plus size={16} />
          Add Row
        </button>
        <button
          onClick={addColumn}
          className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          aria-label="Add Column"
        >
          <Plus size={16} />
          Add Column
        </button>
      </div>

      {/* Ajout des bordures plus visibles via style inline */}
      <div
        style={{
          "--cell-border": "1px solid #9ca3af", 
        } as React.CSSProperties}
        className="react-spreadsheet"
      >
        <Spreadsheet data={data} onChange={setData} />
      </div>
      <style jsx>{`
        .react-spreadsheet .cell {
          border: var(--cell-border) !important;
        }
      `}</style>
    </div>
  );
}
