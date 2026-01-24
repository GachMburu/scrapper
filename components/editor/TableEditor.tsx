import React from 'react';
import { Trash2, Plus } from 'lucide-react';

interface TableEditorProps {
  headers: string[];
  rows: any[];
  onUpdateCell: (rowIndex: number, header: string, value: string) => void;
  onAddRow: () => void;
  onAddColumn: () => void;
  onDeleteRow: (i: number) => void;
}

export default function TableEditor({ headers, rows, onUpdateCell, onAddRow, onAddColumn, onDeleteRow }: TableEditorProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <span className="font-semibold text-lg">Table Editor</span>
        <button
          onClick={onAddColumn}
          className="text-sm font-semibold text-sky-600 hover:underline"
        >
          + Add column
        </button>
      </div>
      <div className="overflow-x-auto max-h-[65vh]">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              {headers.map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold">
                  {h}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t">
                {headers.map(h => (
                  <td key={h} className="px-2 py-1">
                    <input
                      value={row[h] || ''}
                      onChange={e => onUpdateCell(i, h, e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                ))}
                <td className="px-2">
                  <button onClick={() => onDeleteRow(i)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={onAddRow}
          className="text-sky-600 font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add row
        </button>
      </div>
    </div>
  );
}
