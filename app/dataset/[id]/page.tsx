import { connectToDatabase } from '@/lib/db';
import { Dataset } from '@/lib/models/Dataset';
import { DataRow } from '@/lib/models/DataRow';
import { Lock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';

export default async function DatasetPage({ params }: { params: { id: string } }) {
  await connectToDatabase();

  const datasetId = new mongoose.Types.ObjectId(params.id);
  
  const dataset = await Dataset.findById(datasetId);
  const items = await DataRow.find({ datasetId: datasetId });

  if (!dataset) return notFound();

  // Freemium Logic: Top 3 are free
  const freeRows = items.slice(0, 3);
  const totalRows = items.length;
  const lockedCount = totalRows - 3;
  
  // Extract headers from the first item (assuming consistency)
  const headers = freeRows.length > 0 ? Object.keys(freeRows[0].content as object) : [];

  return (
    <div className="min-h-screen bg-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-300 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <Link href="/" className="text-sky-600 hover:underline mb-4 inline-block">&larr; Back to Marketplace</Link>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{dataset.name}</h1>
          <p className="text-slate-500 text-lg">{totalRows} Records Available</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Data Table Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 relative">
          
          {/* Table */}
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs tracking-wider">
              <tr>
                {headers.map(h => <th key={h} className="px-6 py-4">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Render Free Rows */}
              {freeRows.map((row) => (
                <tr key={row._id?.toString()} className="hover:bg-primary-50 transition-colors">
                  {headers.map((h) => (
                    <td key={h} className="px-6 py-4 text-slate-700 font-medium">
                      {String((row.content as any)[h] || '')}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Render Blurred Dummy Rows (Visual Trick) */}
              {[...Array(5)].map((_, i) => (
                <tr key={`dummy-${i}`} className="filter blur-sm select-none bg-slate-50 opacity-50">
                   {headers.map((h) => (
                    <td key={h} className="px-6 py-4">LOCKED DATA content</td>
                   ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* The Paywall Overlay */}
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-center pt-20">
            <Lock className="w-12 h-12 text-sky-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Unlock {lockedCount} More Records</h3>
            <p className="text-slate-600 mb-6 text-center max-w-md">
              Get full access to the complete dataset including all data points and details.
            </p>
            <button className="bg-sky-600 hover:bg-sky-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg shadow-sky-500/30 transition transform hover:scale-105 active:scale-95">
              Buy Full Access for ${dataset.price}
            </button>
            <p className="mt-4 text-sm text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Instant Email Delivery
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
