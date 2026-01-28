'use client';

import { X, Check, ArrowLeft } from 'lucide-react';

interface ScrapedDataModalProps {
  data: any;
  onSelect: (table: { headers: string[]; rows: any[] }) => void;
  onBack?: () => void;
}

export default function ScrapedDataModal({
  data,
  onSelect,
  onBack,
}: ScrapedDataModalProps) {
  const components = data?.components || [];
  const tables = components.filter((c: any) => c.type === 'table');

  if (tables.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">No tables found on this page</p>
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Try Another URL
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[60vh] overflow-auto">
      {tables.map((table: any, idx: number) => (
        <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">
              {table.title || `Table ${idx + 1}`}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {table.rows.length} rows × {table.headers.length} columns
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  {table.headers.map((h: string) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.slice(0, 3).map((row: any, rowIdx: number) => (
                  <tr key={rowIdx} className="border-b border-slate-100 hover:bg-slate-50">
                    {table.headers.map((h: string) => (
                      <td key={h} className="px-4 py-2 text-slate-600 whitespace-nowrap">
                        {String(row[h] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-600">
              Preview: {Math.min(3, table.rows.length)} of {table.rows.length} rows
            </span>
            <button
              onClick={() =>
                onSelect({
                  headers: table.headers,
                  rows: table.rows,
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold text-sm transition"
            >
              <Check className="w-4 h-4" />
              Use This Table
            </button>
          </div>
        </div>
      ))}

      {onBack && (
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Try Another URL
          </button>
        </div>
      )}
    </div>
  );
}
