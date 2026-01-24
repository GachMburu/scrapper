import React from 'react';
import { Table } from 'lucide-react';
import DataSnippet from './DataSnippet';

interface ReviewSnippetProps {
  component: any;
  onImport: (component: any) => void;
}

export default function ReviewSnippet({ component, onImport }: ReviewSnippetProps) {
  const { type, title, count, headers, rows } = component;
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-sky-50 text-sky-600 rounded">
          <Table className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold">{title || type}</p>
          <p className="text-xs text-slate-500">{count} items</p>
        </div>
      </div>
      {headers && rows && rows.length > 0 && (
        <DataSnippet headers={headers} rows={rows} maxRows={3} />
      )}
      <button
        onClick={() => onImport(component)}
        className="w-full bg-sky-600 text-white py-2 rounded font-semibold mt-2"
      >
        Import
      </button>
    </div>
  );
}
