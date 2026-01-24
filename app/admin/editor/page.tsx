'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import EditorHeader from '@/components/editor/EditorHeader';
import DataSnippet from '@/components/editor/DataSnippet';
import ReviewSnippet from '@/components/editor/ReviewSnippet';
import TableEditor from '@/components/editor/TableEditor';
import UndoRedoBar from '@/components/editor/UndoRedoBar';

type Step = 'input' | 'review' | 'editor' | 'loading';


function Editor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const mode = searchParams.get('mode');

  const [step, setStep] = useState<Step>('input');
  const [datasetName, setDatasetName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrapedResult, setScrapedResult] = useState<any>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  // Undo/redo stacks
  const undoStack = useRef<any[]>([]);
  const redoStack = useRef<any[]>([]);

  // INIT
  useEffect(() => {
    if (!editId) return;
    setStep('loading');
    fetch(`/api/admin/dataset/${editId}`)
      .then(res => res.json())
      .then(data => {
        setDatasetName(data.dataset.name);
        const flatRows = data.rows.map((r: any) => r.content);
        setRows(flatRows);
        setHeaders(flatRows[0] ? Object.keys(flatRows[0]) : []);
        setStep(mode === 'append' ? 'input' : 'editor');
      });
  }, [editId, mode]);

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
        setScrapedResult(data.data);
        setStep('review');
      }
    } finally {
      setLoading(false);
    }
  };

  // IMPORT
  const importComponent = (component: any) => {
    const newHeaders = Array.from(new Set([...headers, ...(component.headers || [])]));
    pushUndo();
    setHeaders(newHeaders);
    setRows(prev => (prev.length ? [...prev, ...component.rows] : component.rows));
    setStep('editor');
  };

  // Undo/Redo logic
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

  // TABLE OPS
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
    if (!datasetName) return alert('Dataset name required');
    setLoading(true);
    const endpoint = editId ? `/api/admin/dataset/${editId}` : '/api/admin/save';
    await fetch(endpoint, {
      method: editId ? 'PUT' : 'POST',
      body: JSON.stringify({
        name: datasetName,
        sourceUrl: url,
        dataRows: rows,
      }),
    });
    router.push('/admin');
  };

  // RENDER
  if (step === 'loading') {
    return (
      <div className="py-32 text-center text-slate-500">
        <Loader2 className="animate-spin inline mr-2" />
        Loading dataset…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <EditorHeader
        title={editId ? (mode === 'append' ? `Append to ${datasetName}` : `Editing ${datasetName}`) : 'New Dataset'}
        loading={loading}
        onBack={() => router.push('/admin')}
        onSave={handleSave}
        showSave={step === 'editor'}
      />

      {/* INPUT */}
      {step === 'input' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl border border-slate-200">
          <label className="text-sm font-medium text-slate-600 mb-2 block">Source URL</label>
          <div className="flex gap-2">
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="flex-1 p-3 border border-slate-300 rounded"
              placeholder="https://example.com"
            />
            <button
              onClick={handleScrape}
              className="bg-sky-600 text-white px-5 rounded font-semibold"
            >
              Fetch
            </button>
          </div>
          <div className="text-center my-6 text-slate-400 text-sm">or</div>
          <button
            onClick={() => setStep('editor')}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 rounded font-semibold"
          >
            Start with empty table
          </button>
        </div>
      )}

      {/* REVIEW */}
      {step === 'review' && scrapedResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scrapedResult.components.map((c: any, i: number) => (
            <ReviewSnippet key={i} component={c} onImport={importComponent} />
          ))}
        </div>
      )}

      {/* EDITOR */}
      {step === 'editor' && (
        <>
          <UndoRedoBar
            canUndo={undoStack.current.length > 0}
            canRedo={redoStack.current.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
          <div className="mb-4">
            <input
              value={datasetName}
              onChange={e => setDatasetName(e.target.value)}
              className="font-semibold text-lg border-b border-slate-300 focus:outline-none mb-2"
              placeholder="Dataset name"
            />
          </div>
          <TableEditor
            headers={headers}
            rows={rows}
            onUpdateCell={updateCell}
            onAddRow={addRow}
            onAddColumn={addColumn}
            onDeleteRow={deleteRow}
          />
        </>
      )}
    </div>
  );
}

/* Suspense wrapper */
export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
      <Editor />
    </Suspense>
  );
}
