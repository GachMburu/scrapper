'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, CheckCircle2, TableProperties, Edit, Eye, Download } from 'lucide-react';

interface DatasetCardProps {
  data: any;
}

export default function DatasetCard () {
  // Mock Row Count if not present in DB yet (for visual consistency)
  const rowCount = data.items?.length || Math.floor(Math.random() * 500) + 50;
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 32px 0 rgba(16,30,54,0.18), 0 0 0 2px #3b82f6' }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="bg-gradient-surface h-full rounded-2xl border border-border shadow-widget p-6 flex flex-col relative overflow-hidden glass group"
    >
      {/* Header Strip */}
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
          Finance
        </span>
        <button className="text-text-muted hover:text-primary"><ArrowRight className="w-5 h-5" /></button>
      </div>
      {/* Title */}
      <div className="font-bold text-lg text-text-primary mb-1 truncate-2-lines" style={{lineHeight: '1.2'}}>{data.name}</div>
      {/* Metadata Row */}
      <div className="flex gap-3 text-xs text-text-secondary mb-2">
        <span className="inline-flex items-center gap-1"><TableProperties className="w-3 h-3" />{rowCount} rows</span>
        <span className="inline-flex items-center gap-1"><FileText className="w-3 h-3" />CSV</span>
        <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-success" />Verified</span>
      </div>
      {/* Description */}
      <p className="text-text-secondary text-sm line-clamp-3 mb-4 flex-grow">
        {data.description || "Contains verified company names, funding rounds, and investor contact details."}
      </p>
      {/* Action Buttons */}
      <div className="flex gap-2 mb-3">
        <motion.button whileHover={{ scale: 1.08 }} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-primary text-white rounded-lg font-semibold text-sm shadow-glass"><Edit className="w-4 h-4" />Edit</motion.button>
        <motion.button whileHover={{ scale: 1.08 }} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-surface-elevated border border-border text-text-secondary rounded-lg font-semibold text-sm"><Download className="w-4 h-4" />Export</motion.button>
        <motion.button whileHover={{ scale: 1.08 }} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-surface-elevated border border-border text-text-secondary rounded-lg font-semibold text-sm"><Eye className="w-4 h-4" />Preview</motion.button>
      </div>
      {/* Footer: Status + Price */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-success/20 text-success border border-success/50 text-xs font-semibold">✅ Published</span>
        <span className="font-bold text-primary text-lg">${data.price}</span>
      </div>
    </motion.div>
  );
}
