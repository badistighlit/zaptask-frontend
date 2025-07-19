"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import SpreadsheetEditor from "./SpreadsheetEditor";
import { CellBase, Matrix } from "react-spreadsheet";

interface SpreadsheetDialogProps {
  open: boolean;
  onClose: () => void;
  data: string[][];
  onSave: (updatedData: string[][]) => void;
}

const SpreadsheetDialog: React.FC<SpreadsheetDialogProps> = ({
  open,
  onClose,
  data,
  onSave,
}) => {
  const [localData, setLocalData] = useState<Matrix<CellBase<string>>>([]);

  useEffect(() => {
    if (data?.length) {
      const formatted = data.map((row) =>
        row.map((cell) => ({ value: cell ?? "" }))
      );
      setLocalData(formatted);
    } else {
      setLocalData([[{ value: "" }]]);
    }
  }, [data]);

  return (
<Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
    <Dialog.Content className="fixed inset-16 bg-white z-50 rounded-lg shadow-lg flex flex-col overflow-hidden">
      
      <Dialog.Title className="flex items-center justify-between p-4 border-b text-xl font-semibold">
        Spreadsheet Editor
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </Dialog.Title>

      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto">
        <SpreadsheetEditor value={localData} onChange={setLocalData} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            const cleanData = localData.map(row => row.map(cell => cell?.value ?? ""));
            onSave(cleanData);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
  );
};

export default SpreadsheetDialog;
