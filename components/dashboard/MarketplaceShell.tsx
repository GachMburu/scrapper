'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, Grid, List as ListIcon, Bell, Settings, User, CheckCircle2, Eye, DollarSign, Star } from 'lucide-react';
import DatasetCard from './DatasetCard';
import Link from 'next/link';

interface MarketplaceShellProps {
  initialDatasets: any[];
}

export default function MarketplaceShell({ initialDatasets }: MarketplaceShellProps) {
  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // --- FILTERING LOGIC ---
  const filteredDatasets = useMemo(() => {
    return initialDatasets.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || (d.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm, initialDatasets]);

  // --- Animated Stats (mock data for now) ---
  const stats = [
    { icon: <Grid className="w-5 h-5 text-primary-light" />, label: 'Total Datasets', value: 47 },
    { icon: <CheckCircle2 className="w-5 h-5 text-success" />, label: 'Published', value: 32 },
    { icon: <ListIcon className="w-5 h-5 text-warning" />, label: 'Drafts', value: 15 },
    { icon: <Eye className="w-5 h-5 text-info" />, label: 'Total Views', value: '12.4k' },
    { icon: <DollarSign className="w-5 h-5 text-primary" />, label: 'Revenue', value: '$2.3k' },
    { icon: <Star className="w-5 h-5 text-warning" />, label: 'Avg', value: '4.2' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-base text-text-primary">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-30 bg-surface border-b border-border shadow-glass h-16 flex items-center px-8 justify-between">
        <div className="font-bold text-lg tracking-wide">Dashboard</div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input 
              type="text"
              placeholder="Search datasets..."
              className="w-full pl-12 pr-4 py-2 bg-surface-elevated/80 border border-border rounded-xl shadow-widget text-base outline-none transition-all placeholder:text-text-muted"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ scale: 1.1 }} className="relative">
            <Bell className="w-5 h-5 text-text-secondary" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full animate-pulse" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }}><Settings className="w-5 h-5 text-text-secondary" /></motion.button>
          <motion.button whileHover={{ scale: 1.1 }}><User className="w-6 h-6 text-primary" /></motion.button>
        </div>
      </header>
      {/* Statistics Bar */}
      <section className="pt-16 bg-base border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center justify-center bg-gradient-surface border border-border rounded-xl p-4 shadow-widget hover:shadow-glass hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="mb-1">{stat.icon}</div>
              <div className="text-xs text-text-secondary group-hover:text-primary font-medium">{stat.label}</div>
              <motion.div
                className="text-xl font-bold mt-1 group-hover:text-primary"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                {stat.value}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Action Bar */}
      <section className="bg-base sticky top-[112px] z-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2 items-center flex-wrap">
            <select className="bg-surface-elevated border border-border text-text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>All</option>
              <option>Finance</option>
              <option>Tech</option>
              <option>Real Estate</option>
            </select>
            <select className="bg-surface-elevated border border-border text-text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Status: All</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
            <select className="bg-surface-elevated border border-border text-text-secondary rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Sort: Latest</option>
              <option>Oldest</option>
              <option>Price: High-Low</option>
              <option>Price: Low-High</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <motion.button whileHover={{ scale: 1.05 }} className="bg-gradient-primary text-white font-bold px-5 py-2 rounded-xl shadow-glass text-sm">
              + New Dataset
            </motion.button>
            <button
              className={`px-3 py-2 rounded-lg border border-border text-text-secondary ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'bg-surface-elevated'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              className={`px-3 py-2 rounded-lg border border-border text-text-secondary ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'bg-surface-elevated'}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-8">
        <div className="mb-6 flex items-baseline gap-3">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Verified Data</h1>
          <span className="text-sm text-text-secondary font-medium">{filteredDatasets.length} Results</span>
        </div>

        {/* Grid/List Toggle */}
        <AnimatePresence mode="wait">
          {filteredDatasets.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center justify-center h-64 text-text-muted"
            >
              <p>No results found matching "{searchTerm}"</p>
              <button onClick={() => {setSearchTerm('');}} className="mt-2 text-primary hover:underline">Clear Filters</button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20"
            >
              {filteredDatasets.map((dataset: any) => (
                <DatasetCard key={dataset._id} data={dataset} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4 pb-20"
            >
              {filteredDatasets.map((dataset: any) => (
                <div key={dataset._id} className="bg-surface-elevated border border-border rounded-xl p-6 flex items-center justify-between shadow-widget hover:shadow-glass transition-all">
                  <div>
                    <div className="font-bold text-lg text-text-primary mb-1">{dataset.name}</div>
                    <div className="text-sm text-text-secondary mb-1">{dataset.description}</div>
                    <div className="flex gap-3 text-xs text-text-muted">
                      <span>Rows: {dataset.items?.length || Math.floor(Math.random() * 500) + 50}</span>
                      <span>Status: <span className="text-success font-bold">Published</span></span>
                      <span>Price: <span className="text-primary font-bold">${dataset.price}</span></span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.1 }} className="px-3 py-2 bg-gradient-primary text-white rounded-lg font-semibold">Edit</motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} className="px-3 py-2 bg-surface border border-border text-text-secondary rounded-lg font-semibold">Preview</motion.button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-brand-800 h-full border-r border-brand-700/60 shadow-lg transition-all duration-300 flex flex-col relative shrink-0 z-20`}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 bg-primary-600 text-white p-1 rounded-full shadow-md hover:bg-primary-700 z-50 border-4 border-brand-100"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Sidebar Content */}
        <div className="p-6 flex flex-col h-full">
          {/* Categories */}
          <div className="mb-8">
            <h3 className={`text-xs font-bold text-brand-200 uppercase tracking-widest mb-4 ${!sidebarOpen && 'hidden'}`}> 
              Categories
            </h3>
            <div className="space-y-2">
              {['All', 'Finance', 'Tech', 'Real Estate'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-colors ${
                    activeCategory === cat ? 'bg-primary-100 text-primary-700' : 'text-brand-100 hover:bg-brand-700/40 hover:text-white'
                  }`}
                >
                  {/* Show Icon only if closed, Text if open */}
                  {sidebarOpen ? cat : cat.slice(0, 2)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-8">
            <h3 className={`text-xs font-bold text-brand-200 uppercase tracking-widest mb-4 ${!sidebarOpen && 'hidden'}`}> 
              Price
            </h3>
            <div className={`space-y-2 ${!sidebarOpen && 'hidden'}`}> 
              <label className="flex items-center gap-2 text-sm text-brand-100 cursor-pointer">
                <input type="radio" name="price" checked={priceFilter === 'all'} onChange={() => setPriceFilter('all')} className="accent-primary-600"/>
                Any Price
              </label>
              <label className="flex items-center gap-2 text-sm text-brand-100 cursor-pointer">
                <input type="radio" name="price" checked={priceFilter === 'paid'} onChange={() => setPriceFilter('paid')} className="accent-primary-600"/>
                Paid Only
              </label>
            </div>
          </div>

          {/* Admin Link (Subtle) */}
          <div className="mt-auto pt-8">
             <Link href="/admin" className={`flex items-center gap-2 text-xs text-brand-400 hover:text-primary-500 transition-colors ${!sidebarOpen && 'justify-center'}`}> 
               <SlidersHorizontal className="w-4 h-4" />
               {sidebarOpen && <span className="tracking-widest uppercase font-semibold">Admin Login</span>}
             </Link>
             <div className="mt-8 text-[10px] text-brand-700/60 text-center select-none ${!sidebarOpen && 'hidden'}">
               &copy; {new Date().getFullYear()} Data Marketplace
             </div>
          </div>
        </div>
      </aside>


      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* HEADER: Glassmorphism Search Bar */}
        <div className="backdrop-blur-md bg-white/70 border-b border-brand-100 p-6 pb-2 shrink-0 shadow-glass">
          <div className="relative max-w-4xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search datasets by name, industry, or description..."
              className="w-full pl-12 pr-4 py-4 bg-white/80 border border-brand-100 focus:border-primary-500 rounded-2xl shadow-widget text-lg outline-none transition-all placeholder:text-brand-400 font-jakarta"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="flex-1 overflow-y-auto p-6 pt-2">
          
          {/* Minimal Title */}
          <div className="mb-6 flex items-baseline gap-3">
            <h1 className="text-2xl font-jakarta font-bold text-brand-800 tracking-tight">Verified Data</h1>
            <span className="text-sm text-brand-500 font-medium">{filteredDatasets.length} Results</span>
          </div>

          {/* The Grid */}
          {filteredDatasets.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-slate-400">
               <p>No results found matching "{searchTerm}"</p>
               <button onClick={() => {setSearchTerm(''); setActiveCategory('All');}} className="mt-2 text-sky-600 hover:underline">Clear Filters</button>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {filteredDatasets.map((dataset: any) => (
                <DatasetCard key={dataset._id} data={dataset} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
