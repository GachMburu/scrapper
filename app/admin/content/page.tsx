'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit, BookOpen, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ContentType = 'all' | 'datasets' | 'blogs';

interface Content {
  _id: string;
  type: 'dataset' | 'blog';
  name?: string;
  title?: string;
  createdAt: string;
}

export default function ContentManager() {
  const [filter, setFilter] = useState<ContentType>('all');
  const [datasets, setDatasets] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const [datasetsRes, blogsRes] = await Promise.all([
        fetch('/api/admin/datasets'),
        fetch('/api/admin/blog'),
      ]);
      const datasetsData = await datasetsRes.json();
      const blogsData = await blogsRes.json();
      setDatasets(datasetsData);
      setBlogs(blogsData);
    } finally {
      setLoading(false);
    }
  };

  const deleteDataset = async (id: string) => {
    if (!confirm('Delete this dataset?')) return;
    await fetch(`/api/admin/dataset/${id}`, { method: 'DELETE' });
    fetchContent();
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    fetchContent();
  };

  const displayedDatasets = datasets;
  const displayedBlogs = blogs;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Content Manager</h1>
          <p className="text-slate-600 mt-1">Create and manage all your content</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/content/new?type=dataset')}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Dataset
          </button>
          <button
            onClick={() => router.push('/admin/content/new?type=blog')}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Post
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-8 border-b border-slate-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-3 font-medium transition ${
            filter === 'all'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Content
        </button>
        <button
          onClick={() => setFilter('datasets')}
          className={`px-4 py-3 font-medium transition ${
            filter === 'datasets'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4 inline mr-2" />
          Datasets
        </button>
        <button
          onClick={() => setFilter('blogs')}
          className={`px-4 py-3 font-medium transition ${
            filter === 'blogs'
              ? 'text-emerald-600 border-b-2 border-emerald-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Posts
        </button>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white rounded-xl border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : (displayedDatasets.length === 0 && displayedBlogs.length === 0) || (filter === 'datasets' && displayedDatasets.length === 0) || (filter === 'blogs' && displayedBlogs.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            {filter === 'blogs' ? (
              <BookOpen className="w-6 h-6 text-slate-400" />
            ) : (
              <Database className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <p className="text-lg font-semibold text-slate-700">No content yet</p>
          <p className="text-slate-500 mb-6">Create your first {filter === 'blogs' ? 'blog post' : 'dataset'}</p>
          <button
            onClick={() => router.push(`/admin/content/new?type=${filter === 'blogs' ? 'blog' : 'dataset'}`)}
            className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Create Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Datasets Section */}
          {(filter === 'all' || filter === 'datasets') && displayedDatasets.length > 0 && (
            <div>
              {filter === 'all' && <h2 className="text-xl font-bold text-slate-900 mb-4">Datasets</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedDatasets.map((d: any) => (
                  <div key={d._id} className="bg-white rounded-xl border border-slate-200 hover:border-sky-400 transition flex flex-col overflow-hidden">
                    <div className="p-6 flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-3">
                        <Database className="w-3 h-3" />
                        Dataset
                      </div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-1">{d.name}</h3>
                      <p className="text-sm text-slate-500">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="px-4 pb-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href={`/admin/content/edit?type=dataset&id=${d._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteDataset(d._id)}
                        className="p-2 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Section */}
          {(filter === 'all' || filter === 'blogs') && displayedBlogs.length > 0 && (
            <div>
              {filter === 'all' && <h2 className="text-xl font-bold text-slate-900 mb-4 mt-8">Posts</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedBlogs.map((b: any) => (
                  <div key={b._id} className="bg-white rounded-xl border border-slate-200 hover:border-emerald-400 transition flex flex-col overflow-hidden">
                    <div className="p-6 flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
                        <BookOpen className="w-3 h-3" />
                        {b.isPublished ? 'Published' : 'Draft'}
                      </div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-1">{b.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-2">{b.description}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="px-4 pb-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href={`/admin/content/edit?type=blog&id=${b._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteBlog(b._id)}
                        className="p-2 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
