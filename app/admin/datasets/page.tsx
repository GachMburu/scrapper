'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Edit, PlusCircle, Layers, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DatasetsAdmin() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/datasets');
      const data = await res.json();
      setDatasets(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;
    await fetch(`/api/admin/dataset/${id}`, { method: 'DELETE' });
    fetchDatasets();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Datasets</h1>
          <p className="text-slate-600 mt-1">Manage and create datasets</p>
        </div>

        <Link
          href="/admin/editor"
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm transition"
        >
          <PlusCircle className="w-5 h-5" />
          Create Dataset
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white rounded-xl border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : datasets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Database className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-lg font-semibold text-slate-700">No datasets yet</p>
          <p className="text-slate-500 mb-6">Create your first dataset to get started</p>
          <Link
            href="/admin/editor"
            className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Create Dataset
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((d: any) => (
            <div
              key={d._id}
              className="bg-white rounded-xl border border-slate-200 hover:border-sky-400 transition flex flex-col"
            >
              <div className="p-6 flex-1">
                <h3 className="font-semibold text-lg text-slate-900 mb-1">{d.name}</h3>
                <p className="text-sm text-slate-500">
                  Created on {new Date(d.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="px-4 pb-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={`/admin/editor?id=${d._id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>

                <Link
                  href={`/admin/editor?id=${d._id}&mode=append`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-sm font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-md transition"
                >
                  <Layers className="w-4 h-4" />
                  Append
                </Link>

                <button
                  onClick={() => handleDelete(d._id)}
                  className="p-2 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 transition"
                  aria-label="Delete dataset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
