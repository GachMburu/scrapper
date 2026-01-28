'use client';

import Link from 'next/link';
import { Layers, BookOpen } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-slate-600">Manage all your content in one place</p>
      </div>

      {/* Main Link */}
      <Link href="/admin/content">
        <div className="p-8 bg-white border-2 border-sky-200 rounded-xl hover:border-sky-400 hover:shadow-lg transition cursor-pointer">
          <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
            <Layers className="w-6 h-6 text-sky-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Content Manager</h2>
          <p className="text-slate-600">Create, edit, and manage datasets and posts</p>
          <div className="mt-4 text-sky-600 font-semibold text-sm">
            Go to Content Manager →
          </div>
        </div>
      </Link>
    </div>
  );
}
