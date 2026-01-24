'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: string;
  onPriceChange: (price: string) => void;
  filteredCount: number;
  categories: string[];
}

export default function Sidebar({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  filteredCount,
  categories,
}: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="
              fixed left-0 top-0 z-50 h-full w-80
              bg-white text-slate-900
              border-r border-slate-200
              lg:static lg:h-auto lg:w-72
              lg:rounded-xl lg:border
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Filters
                </p>
                <p className="text-sm font-semibold">
                  Refine results
                </p>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-md hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-8 overflow-y-auto">
              {/* Categories */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Categories
                </h4>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => onCategoryChange(cat)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition
                        ${
                          selectedCategory === cat
                            ? 'bg-sky-600 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>

              {/* Pricing */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Pricing
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'free', label: 'Free only' },
                    { id: 'paid', label: 'Paid only' },
                  ].map(option => (
                    <label
                      key={option.id}
                      className="
                        flex items-center gap-3 px-3 py-2 rounded-lg
                        hover:bg-slate-100 cursor-pointer
                      "
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === option.id}
                        onChange={() => onPriceChange(option.id)}
                        className="accent-sky-600"
                      />
                      <span className="text-sm text-slate-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Result Count */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">Results</p>
                <p className="text-2xl font-bold text-sky-600">
                  {filteredCount}
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
