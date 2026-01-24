import { connectToDatabase } from '@/lib/db';
import { Dataset } from '@/lib/models/Dataset';
import { DataRow } from '@/lib/models/DataRow';
import { ArrowLeft, CheckCircle2, Download, Database } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import LockOverlay from '@/components/LockOverlay';
import EmailDelivery from '@/components/EmailDelivery';

export default async function DatasetPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  await connectToDatabase();

  const { id } = await params;
  const { paid } = await searchParams;

  const datasetId = new mongoose.Types.ObjectId(id);
  const isPaid = paid === 'true';

  const dataset = await Dataset.findById(datasetId);
  const items = await DataRow.find({ datasetId });

  if (!dataset) return notFound();

  const totalRows = items.length;

  const displayRows = isPaid ? items : items.slice(0, 3);
  const lockedCount = Math.max(totalRows - 3, 0);

  const headers =
    displayRows.length > 0
      ? Object.keys(displayRows[0].content as object)
      : [];

  const dummyRowCount = !isPaid ? 5 : 0;

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

            {isPaid && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-700 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Full access unlocked
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {isPaid && (
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
        )}

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
                {displayRows.map((row) => (
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

                {!isPaid &&
                  Array.from({ length: dummyRowCount }).map((_, i) => (
                    <tr
                      key={`dummy-${i}`}
                      className="bg-slate-50 text-slate-400 blur-sm select-none"
                    >
                      {headers.map((h) => (
                        <td key={h} className="px-6 py-4">
                          ●●●●●●●●●
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {!isPaid && (
            <LockOverlay
              lockedCount={lockedCount}
              price={dataset.price}
              datasetId={id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
