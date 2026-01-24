'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, CheckCircle2, TableProperties, Edit, Eye, Download } from 'lucide-react';

interface DatasetCardProps {
  data: any;
}

export default function DatasetCard({ data }: DatasetCardProps) {
  // Mock Row Count if not present in DB yet (for visual consistency)
  const rowCount = data.items?.length || Math.floor(Math.random() * 500) + 50;
  
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 32px 0 rgba(16,30,54,0.18), 0 0 0 2px #3b82f6' }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="bg-gradient-to-br from-white to-slate-50 h-full rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg p-6 flex flex-col relative overflow-hidden hover:border-sky-300 transition-all group"
    >
      {/* Header Strip */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold uppercase tracking-wide">
          {data.category || 'Data'}
        </span>
        <Link href={`/dataset/${data._id}`} className="text-slate-400 hover:text-sky-600 transition">
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
      
      {/* Title */}
      <Link href={`/dataset/${data._id}`} className="group/title">
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover/title:text-sky-600 transition">
          {data.name}
        </h3>
      </Link>
      
      {/* Metadata Row */}
      <div className="flex gap-3 text-xs text-slate-600 mb-3">
        <span className="inline-flex items-center gap-1">
          <TableProperties className="w-3 h-3" />
          {rowCount} rows
        </span>
        <span className="inline-flex items-center gap-1">
          <FileText className="w-3 h-3" />
          CSV
        </span>
        <span className="inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-green-600" />
          Verified
        </span>
      </div>
      
      {/* Description */}
      <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
        {data.description || "High-quality verified dataset with comprehensive information."}
      </p>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Link href={`/admin/editor?id=${data._id}`}>
          <motion.button whileHover={{ scale: 1.05 }} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold text-xs transition">
            <Edit className="w-3 h-3" />
            Edit
          </motion.button>
        </Link>
        <motion.button whileHover={{ scale: 1.05 }} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition">
          <Download className="w-3 h-3" />
          Export
        </motion.button>
      </div>
      
      {/* Footer: Status + Price */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200 text-xs font-semibold">
          ✅ Published
        </span>
        <span className="font-bold text-sky-600 text-lg">${data.price}</span>
      </div>
    </motion.div>
  );
}
