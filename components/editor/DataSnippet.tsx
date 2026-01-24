import React from 'react';

interface DataSnippetProps {
  headers: string[];
  rows: any[];
  maxRows?: number;
}

export default function DataSnippet({ headers, rows, maxRows = 5 }: DataSnippetProps) {
  return (
    <div className="overflow-x-auto border rounded-lg bg-slate-50">
      <table className="min-w-full text-xs">
        <thead className="bg-slate-100">
          <tr>
            {headers.map(h => (
              <th key={h} className="px-2 py-1 font-semibold text-slate-700 text-left border-b">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, maxRows).map((row, i) => (
            <tr key={i} className="border-b last:border-0">
              {headers.map(h => (
                <td key={h} className="px-2 py-1 text-slate-600">
                  {row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
