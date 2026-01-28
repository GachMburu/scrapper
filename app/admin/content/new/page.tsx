'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2, Save, ArrowLeft, Zap, X } from 'lucide-react';
import BlogEditor from '@/components/BlogEditor';
import ScrapedDataModal from '@/components/ScrapedDataModal';

type ContentType = 'dataset' | 'blog';
type Step = 'choose' | 'input' | 'editor';

function Editor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentType = (searchParams.get('type') as ContentType) || 'dataset';
  const editId = searchParams.get('id');

  const [step, setStep] = useState<Step>(editId ? 'editor' : contentType === 'blog' ? 'editor' : 'choose');
  const [loading, setLoading] = useState(false);

  // Shared
  const [url, setUrl] = useState('');
  const [scrapedData, setScrapedData] = useState<any[]>([]);
  const [scrapedHeaders, setScrapedHeaders] = useState<string[]>([]);
  const [showScrapModal, setShowScrapModal] = useState(false);

  // Dataset specific
  const [datasetName, setDatasetName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const undoStack = useRef<any[]>([]);
  const redoStack = useRef<any[]>([]);

  // Blog specific
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategories, setBlogCategories] = useState('');
  const [blogTags, setBlogTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  // INIT - Load existing content
  useEffect(() => {
    if (!editId) return;
    setLoading(true);
    const endpoint = contentType === 'dataset' ? `/api/admin/dataset/${editId}` : `/api/admin/blog/${editId}`;
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        if (contentType === 'dataset') {
          setDatasetName(data.dataset.name);
          setUrl(data.dataset.sourceUrl || '');
          const flatRows = data.rows.map((r: any) => r.content);
          setRows(flatRows);
          setHeaders(flatRows[0] ? Object.keys(flatRows[0]) : []);
        } else {
          setBlogTitle(data.title);
          setBlogSlug(data.slug);
          setBlogDescription(data.description);
          setBlogContent(data.content);
          setBlogCategories(data.categories.join(', '));
          setBlogTags(data.tags.join(', '));
          setIsPublished(data.isPublished);
        }
        setStep('editor');
      })
      .finally(() => setLoading(false));
  }, [editId, contentType]);

  // SCRAPE
  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        const components = data.data.components || [];
        if (components.length > 0) {
          setScrapedData(components);
          setScrapedHeaders(components[0].headers || []);
          setShowScrapModal(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScrapedDataSelect = (table: { headers: string[]; rows: any[] }) => {
    if (contentType === 'dataset') {
      setHeaders(table.headers);
      setRows(table.rows);
      setStep('editor');
    } else {
      // For blog, insert as markdown table
      const markdownTable = createMarkdownTable(table.headers, table.rows);
      setBlogContent(prev => prev + '\n\n' + markdownTable);
    }
    setShowScrapModal(false);
    setScrapedData([]);
  };

  const createMarkdownTable = (headers: string[], rows: any[]) => {
    let table = '| ' + headers.join(' | ') + ' |\n';
    table += '|' + headers.map(() => ' --- |').join('') + '\n';
    rows.forEach(row => {
      table += '| ' + headers.map(h => row[h] || '').join(' | ') + ' |\n';
    });
    return table;
  };

  // SCRAPE AND APPEND (for datasets)
  const handleScrapeAppend = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        const components = data.data.components || [];
        if (components.length > 0) {
          setScrapedData(components);
          setScrapedHeaders(components[0].headers || []);
          setShowScrapModal(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScrapedAppend = (table: { headers: string[]; rows: any[] }) => {
    pushUndo();
    setRows(prev => [...prev, ...table.rows]);
    setShowScrapModal(false);
    setScrapedData([]);
  };

  // TABLE OPS
  const pushUndo = () => {
    undoStack.current.push({ headers: [...headers], rows: JSON.parse(JSON.stringify(rows)) });
    redoStack.current = [];
  };

  const handleUndo = () => {
    if (undoStack.current.length === 0) return;
    redoStack.current.push({ headers: [...headers], rows: JSON.parse(JSON.stringify(rows)) });
    const prev = undoStack.current.pop();
    setHeaders(prev.headers);
    setRows(prev.rows);
  };

  const handleRedo = () => {
    if (redoStack.current.length === 0) return;
    undoStack.current.push({ headers: [...headers], rows: JSON.parse(JSON.stringify(rows)) });
    const next = redoStack.current.pop();
    setHeaders(next.headers);
    setRows(next.rows);
  };

  const updateCell = (rowIndex: number, header: string, value: string) => {
    pushUndo();
    setRows(prev => {
      const copy = [...prev];
      copy[rowIndex] = { ...copy[rowIndex], [header]: value };
      return copy;
    });
  };

  const addRow = () => {
    pushUndo();
    const empty: any = {};
    headers.forEach(h => (empty[h] = ''));
    setRows(r => [...r, empty]);
  };

  const addColumn = () => {
    const name = prompt('Column name');
    if (name && !headers.includes(name)) {
      pushUndo();
      setHeaders(h => [...h, name]);
    }
  };

  const deleteRow = (i: number) => {
    pushUndo();
    setRows(r => r.filter((_, idx) => idx !== i));
  };

  // SAVE
  const handleSave = async () => {
    setLoading(true);
    try {
      if (contentType === 'dataset') {
        if (!datasetName) return alert('Dataset name required');
        const endpoint = editId ? `/api/admin/dataset/${editId}` : '/api/admin/save';
        await fetch(endpoint, {
          method: editId ? 'PUT' : 'POST',
          body: JSON.stringify({
            name: datasetName,
            sourceUrl: url,
            dataRows: rows,
          }),
        });
      } else {
        if (!blogTitle || !blogSlug) return alert('Title and slug required');
        const endpoint = editId ? `/api/admin/blog/${editId}` : '/api/admin/blog';
        await fetch(endpoint, {
          method: editId ? 'PUT' : 'POST',
          body: JSON.stringify({
            title: blogTitle,
            slug: blogSlug,
            description: blogDescription,
            content: blogContent,
            categories: blogCategories.split(',').map(c => c.trim()).filter(Boolean),
            tags: blogTags.split(',').map(t => t.trim()).filter(Boolean),
            isPublished,
          }),
        });
      }
      router.push('/admin/content');
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 'editor' && !editId) {
    return (
      <div className="py-32 text-center text-slate-500">
        <Loader2 className="animate-spin inline mr-2" />
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/content')}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {editId ? `Edit ${contentType === 'blog' ? 'Blog Post' : 'Dataset'}` : `Create ${contentType === 'blog' ? 'Post' : 'Dataset'}`}
            </h1>
            <p className="text-sm text-slate-500">
              {step === 'choose' ? 'Choose how to start' : 'Edit your content'}
            </p>
          </div>
        </div>
        {step === 'editor' && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>

      {/* CHOOSE STEP */}
      {step === 'choose' && contentType === 'dataset' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <button
            onClick={() => setStep('input')}
            className="p-8 border-2 border-slate-200 rounded-xl hover:border-sky-400 hover:bg-sky-50 transition text-left"
          >
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Scrape from URL</h3>
            <p className="text-sm text-slate-600">Extract data from a website</p>
          </button>

          <button
            onClick={() => setStep('editor')}
            className="p-8 border-2 border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition text-left"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Start Empty</h3>
            <p className="text-sm text-slate-600">Create a table manually</p>
          </button>
        </div>
      )}

      {/* INPUT STEP */}
      {step === 'input' && (
        <div className="max-w-xl">
          <div className="bg-white p-8 rounded-xl border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Paste URL to scrape
            </label>
            <div className="flex gap-2">
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="https://example.com"
              />
              <button
                onClick={handleScrape}
                disabled={!url || loading}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Scrape'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDITOR STEP - DATASET */}
      {step === 'editor' && contentType === 'dataset' && (
        <div className="space-y-6">
          {/* Dataset Info */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Dataset Name *
                </label>
                <input
                  value={datasetName}
                  onChange={e => setDatasetName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="e.g. Q1 2024 Funding Data"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Source URL
                </label>
                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                disabled={undoStack.current.length === 0}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium disabled:opacity-50 transition"
              >
                ↶ Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.current.length === 0}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium disabled:opacity-50 transition"
              >
                ↷ Redo
              </button>
            </div>
            {editId && (
              <button
                onClick={handleScrapeAppend}
                disabled={!url || loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-sm font-medium disabled:opacity-50 transition"
              >
                <Zap className="w-4 h-4" />
                {loading ? 'Scraping...' : 'Scrape & Append'}
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    {headers.map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-50">
                      {headers.map(header => (
                        <td key={header} className="px-4 py-2">
                          <input
                            value={row[header] || ''}
                            onChange={e => updateCell(rowIndex, header, e.target.value)}
                            className="w-full bg-transparent p-1 border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => deleteRow(rowIndex)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button
                onClick={addRow}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>
              <button
                onClick={addColumn}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Add Column
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDITOR STEP - BLOG */}
      {step === 'editor' && contentType === 'blog' && (
        <div className="space-y-6">
          {/* Blog Metadata */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  value={blogTitle}
                  onChange={e => {
                    setBlogTitle(e.target.value);
                    if (!editId) setBlogSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Slug *</label>
                <input
                  value={blogSlug}
                  onChange={e => setBlogSlug(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="blog-post-slug"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <input
                value={blogDescription}
                onChange={e => setBlogDescription(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Short description for preview"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Categories</label>
                <input
                  value={blogCategories}
                  onChange={e => setBlogCategories(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Category 1, Category 2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tags</label>
                <input
                  value={blogTags}
                  onChange={e => setBlogTags(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Tag 1, Tag 2"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm font-medium text-slate-700">
                Publish this post
              </label>
            </div>
          </div>

          {/* Blog Editor */}
          <BlogEditor
            content={blogContent}
            onContentChange={setBlogContent}
          />
        </div>
      )}

      {/* Scraped Data Modal */}
      {showScrapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Select a table</h2>
              <button
                onClick={() => {
                  setShowScrapModal(false);
                  setScrapedData([]);
                }}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6">
              <ScrapedDataModal
                data={scrapedData}
                onSelect={contentType === 'dataset' && editId ? handleScrapedAppend : handleScrapedDataSelect}
                onBack={() => setShowScrapModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
      <Editor />
    </Suspense>
  );
}
