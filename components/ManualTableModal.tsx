'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface ManualTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (table: { headers: string[]; rows: any[] }) => void;
}

export default function ManualTableModal({
  isOpen,
  onClose,
  onInsert,
}: ManualTableModalProps) {
  const [headers, setHeaders] = useState<string[]>(['Column 1', 'Column 2']);
  const [rows, setRows] = useState<any[]>([
    { 'Column 1': '', 'Column 2': '' },
  ]);

  const addColumn = () => {
    const newCol = `Column ${headers.length + 1}`;
    setHeaders([...headers, newCol]);
    setRows(
      rows.map(row => ({
        ...row,
        [newCol]: '',
      }))
    );
  };

  const removeColumn = (index: number) => {
    const colToRemove = headers[index];
    setHeaders(headers.filter((_, i) => i !== index));
    setRows(
      rows.map(row => {
        const newRow = { ...row };
        delete newRow[colToRemove];
        return newRow;
      })
    );
  };

  const addRow = () => {
    const newRow: any = {};
    headers.forEach(h => (newRow[h] = ''));
    setRows([...rows, newRow]);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateCell = (rowIndex: number, header: string, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      [header]: value,
    };
    setRows(newRows);
  };

  const updateHeader = (index: number, value: string) => {
    const oldHeader = headers[index];
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);

    // Update rows with new header name
    setRows(
      rows.map(row => {
        const newRow = { ...row };
        if (oldHeader in newRow) {
          newRow[value] = newRow[oldHeader];
          delete newRow[oldHeader];
        }
        return newRow;
      })
    );
  };

  const handleInsert = () => {
    onInsert({ headers, rows });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Create Table</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Table Editor */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  {headers.map((header, i) => (
                    <th key={i} className="border border-slate-200 p-2">
                      <div className="flex items-center gap-2">
                        <input
                          value={header}
                          onChange={e => updateHeader(i, e.target.value)}
                          className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                        />
                        <button
                          onClick={() => removeColumn(i)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="border border-slate-200 p-2">
                    <button
                      onClick={addColumn}
                      className="px-3 py-1 bg-sky-100 text-sky-700 rounded text-sm font-medium hover:bg-sky-200 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-50">
                    {headers.map(header => (
                      <td key={header} className="border border-slate-200 p-2">
                        <input
                          value={row[header] || ''}
                          onChange={e =>
                            updateCell(rowIndex, header, e.target.value)
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </td>
                    ))}
                    <td className="border border-slate-200 p-2 text-center">
                      <button
                        onClick={() => removeRow(rowIndex)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          <div className="mb-6">
            <button
              onClick={addRow}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition"
            >
              Insert Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
