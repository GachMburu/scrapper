'use client';

import { useState } from 'react';
import { Plus, Zap, Loader2, X } from 'lucide-react';
import ManualTableModal from '@/components/ManualTableModal';
import ScrapedDataModal from '@/components/ScrapedDataModal';

interface BlogEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onInsertTable?: (table: { headers: string[]; rows: any[] }) => void;
  onInsertManualTable?: (table: { headers: string[]; rows: any[] }) => void;
}

export default function BlogEditor({ 
  content, 
  onContentChange, 
  onInsertTable, 
  onInsertManualTable 
}: BlogEditorProps) {
  const [manualTableOpen, setManualTableOpen] = useState(false);
  const [scrapeTableOpen, setScrapeTableOpen] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    if (!scrapeUrl) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        body: JSON.stringify({ url: scrapeUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setScrapedData(data.data);
      }
    } catch (error) {
      alert('Failed to scrape. Check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const insertTable = (table: { headers: string[]; rows: any[] }) => {
    const markdown = buildTableMarkdown(table.headers, table.rows);
    const newContent = content + '\n\n' + markdown + '\n\n';
    onContentChange(newContent);
  };

  const buildTableMarkdown = (headers: string[], rows: any[]) => {
    let md = '| ' + headers.join(' | ') + ' |\n';
    md += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
    rows.forEach(row => {
      md +=
        '| ' +
        headers.map(h => row[h] || '').join(' | ') +
        ' |\n';
    });
    return md;
  };

  // Formatting controls
  const formatContent = (type: string) => {
    let selectionStart = 0;
    let selectionEnd = 0;
    const textarea = document.getElementById('blog-content-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    selectionStart = textarea.selectionStart;
    selectionEnd = textarea.selectionEnd;
    let before = content.slice(0, selectionStart);
    let selected = content.slice(selectionStart, selectionEnd);
    let after = content.slice(selectionEnd);
    let formatted = '';
    switch (type) {
      case 'bold':
        formatted = `**${selected || 'bold text'}**`;
        break;
      case 'link':
        formatted = `[${selected || 'link text'}](url)`;
        break;
      case 'h1':
        formatted = `# ${selected || 'Heading 1'}`;
        break;
      case 'h2':
        formatted = `## ${selected || 'Heading 2'}`;
        break;
      default:
        formatted = selected;
    }
    onContentChange(before + formatted + after);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = before.length;
      textarea.selectionEnd = before.length + formatted.length;
    }, 0);
  };

  // Live preview using markdown-it
  const [md, setMd] = useState<any>(null);
  useState(() => {
    import('markdown-it').then(mod => setMd(new mod.default()));
  });

  return (
    <div className="space-y-6">
      {/* Content Editor */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Content</h3>
          <div className="flex gap-2">
            {/* Formatting controls */}
            <button
              type="button"
              title="Bold"
              onClick={() => formatContent('bold')}
              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium"
            >
              <b>B</b>
            </button>
            <button
              type="button"
              title="Link"
              onClick={() => formatContent('link')}
              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium"
            >
              🔗
            </button>
            <button
              type="button"
              title="Heading 1"
              onClick={() => formatContent('h1')}
              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium"
            >
              H1
            </button>
            <button
              type="button"
              title="Heading 2"
              onClick={() => formatContent('h2')}
              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium"
            >
              H2
            </button>
            {/* Table controls */}
            <button
              onClick={() => setManualTableOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Manual Table
            </button>
            <button
              onClick={() => setScrapeTableOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg text-sm font-medium transition"
            >
              <Zap className="w-4 h-4" />
              Scrape Table
            </button>
          </div>
        </div>

        <textarea
          id="blog-content-editor"
          value={content}
          onChange={e => onContentChange(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
          placeholder="Write your content here. Use **bold** for bold text and ## for headings. Tables can be inserted using the buttons above."
          rows={12}
        />

        <div className="text-xs text-slate-500">
          💡 Markdown support: **bold**, *italic*, # Heading, - List items
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-2">Preview</h3>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: md ? md.render(content) : '' }} />
      </div>

      {/* Modals */}
      <ManualTableModal
        isOpen={manualTableOpen}
        onClose={() => setManualTableOpen(false)}
        onInsert={insertTable}
      />

      {/* Scrape Table Modal */}
      {scrapeTableOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Scrape Table from URL
              </h2>
              <button
                onClick={() => {
                  setScrapeTableOpen(false);
                  setScrapedData(null);
                  setScrapeUrl('');
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!scrapedData ? (
                <>
                  <input
                    value={scrapeUrl}
                    onChange={e => setScrapeUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="https://example.com"
                  />
                  <button
                    onClick={handleScrape}
                    disabled={!scrapeUrl || loading}
                    className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Scraping...' : 'Scrape'}
                  </button>
                </>
              ) : (
                <ScrapedDataModal
                  data={scrapedData}
                  onSelect={(table: { headers: string[]; rows: any[] }) => {
                    insertTable(table);
                    setScrapeTableOpen(false);
                    setScrapedData(null);
                    setScrapeUrl('');
                  }}
                  onBack={() => setScrapedData(null)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
