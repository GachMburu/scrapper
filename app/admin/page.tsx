
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Edit, PlusCircle, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
     const res = await fetch('/api/admin/datasets');
     const data = await res.json();
     setDatasets(data);
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure? This cannot be undone.")) return;
    await fetch(`/api/admin/dataset/${id}`, { method: 'DELETE' });
    fetchDatasets();
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <Link 
          href="/admin/editor" 
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Create New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((d: any) => (
          <div key={d._id} className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm hover:border-sky-400 transition-all">
            <h3 className="font-bold text-lg text-slate-900 mb-2">{d.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{new Date(d.createdAt).toLocaleDateString()}</p>
            
            <div className="flex gap-2 border-t border-slate-100 pt-4 mt-auto">
              {/* EDIT BUTTON (Deep Edit) */}
              <Link 
                href={`/admin/editor?id=${d._id}`}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-center text-sm font-bold flex items-center justify-center gap-1"
              >
                <Edit className="w-4 h-4" /> Edit
              </Link>

              {/* APPEND BUTTON */}
              <Link 
                href={`/admin/editor?id=${d._id}&mode=append`}
                className="flex-1 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded text-center text-sm font-bold flex items-center justify-center gap-1"
              >
                <Layers className="w-4 h-4" /> Append
              </Link>
              
              {/* DELETE BUTTON */}
              <button 
                onClick={() => handleDelete(d._id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
