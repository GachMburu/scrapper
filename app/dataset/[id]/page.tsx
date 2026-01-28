import { connectToDatabase } from '@/lib/db';
import { Dataset } from '@/lib/models/Dataset';
import { DataRow } from '@/lib/models/DataRow';
import { ArrowLeft, Download, Database } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import EmailDelivery from '@/components/EmailDelivery';

export default async function DatasetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectToDatabase();

  const { id } = await params;

  const datasetId = new mongoose.Types.ObjectId(id);

  const dataset = await Dataset.findById(datasetId);
  const items = await DataRow.find({ datasetId });

  if (!dataset) return notFound();

  const totalRows = items.length;

  const headers =
    items.length > 0
      ? Object.keys(items[0].content as object)
      : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to marketplace
        </Link>

        {/* Dataset header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {dataset.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-slate-400" />
                  {totalRows} records
                </span>
                <span className="font-semibold text-slate-700">
                  ${dataset.price}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            className="
              inline-flex items-center gap-2
              px-5 py-2.5 rounded-lg
              bg-white border border-slate-200
              text-slate-700 font-semibold
              hover:border-sky-400 hover:text-sky-600
              transition shadow-sm
            "
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>

          <EmailDelivery datasetId={id} />
        </div>

        {/* Data table */}
        <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left font-semibold text-slate-700 uppercase tracking-wide text-xs"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {items.map((row) => (
                  <tr
                    key={row._id?.toString()}
                    className="hover:bg-sky-50 transition"
                  >
                    {headers.map((h) => (
                      <td
                        key={h}
                        className="px-6 py-4 text-slate-700 font-medium"
                      >
                        {String((row.content as any)[h] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
