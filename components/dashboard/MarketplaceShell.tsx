'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, Grid, List } from 'lucide-react';
import Sidebar from './Sidebar';
import DatasetCard from './DatasetCard';
import Link from 'next/link';

interface MarketplaceShellProps {
  initialDatasets: any[];
}

export default function MarketplaceShell({ initialDatasets }: MarketplaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('all');

  const categories = ['All', 'Finance', 'Tech', 'Real Estate', 'Healthcare', 'E-commerce'];

  const filteredDatasets = useMemo(() => {
    return initialDatasets.filter(d => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.description || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || d.category === selectedCategory;

      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === 'free' && d.price === 0) ||
        (priceRange === 'paid' && d.price > 0);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [initialDatasets, searchTerm, selectedCategory, priceRange]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block p-6">
        <Sidebar
          isOpen={true}
          onClose={() => {}}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          filteredCount={filteredDatasets.length}
          categories={categories}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        filteredCount={filteredDatasets.length}
        categories={categories}
      />

      {/* Main */}
      <main className="flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="flex items-center gap-4 px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search datasets…"
                className="
                  w-full pl-9 pr-3 py-2 text-sm
                  bg-white border border-slate-300
                  rounded-md focus:outline-none
                  focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                "
              />
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md border transition ${
                  viewMode === 'grid'
                    ? 'bg-sky-100 border-sky-400 text-sky-700'
                    : 'border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md border transition ${
                  viewMode === 'list'
                    ? 'bg-sky-100 border-sky-400 text-sky-700'
                    : 'border-slate-300 hover:bg-slate-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Funding Data</h1>

          <AnimatePresence mode="wait">
            {filteredDatasets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 text-slate-500"
              >
                No datasets match your filters.
              </motion.div>
            ) : viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredDatasets.map(d => (
                  <DatasetCard key={d._id} data={d} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {filteredDatasets.map(d => (
                  <Link key={d._id} href={`/dataset/${d._id}`}>
                    <div className="p-5 bg-white rounded-lg border border-slate-200 hover:border-sky-400 transition">
                      <h3 className="font-semibold">{d.name}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {d.description || 'Verified dataset'}
                      </p>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
