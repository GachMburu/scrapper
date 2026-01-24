'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Trash2, Plus, Save, Loader2, Table as TableIcon, List, Link as LinkIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

function Editor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const mode = searchParams.get('mode'); // 'append' or null

  // STATES
  const [step, setStep] = useState<'loading' | 'input' | 'review' | 'editor'>('input');
  const [url, setUrl] = useState('');
  const [datasetName, setDatasetName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [scrapedResult, setScrapedResult] = useState<any>(null);
  const [activeHeaders, setActiveHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);

  // 1. INITIALIZE (Check if Editing or Appending)
  useEffect(() => {
    if (editId) {
      setStep('loading');
      fetch(`/api/admin/dataset/${editId}`)
        .then(res => res.json())
        .then(data => {
          setDatasetName(data.dataset.name);
          // Convert DB rows back to Flat Objects
          const flatRows = data.rows.map((r: any) => r.content);
          setRows(flatRows);
          
          // extract headers from first row
          if (flatRows.length > 0) {
            setActiveHeaders(Object.keys(flatRows[0]));
          } else {
            setActiveHeaders(['Column 1']);
          }

          // IF APPEND MODE: Go to Input step. IF EDIT MODE: Go to Editor step.
          if (mode === 'append') {
            setStep('input');
          } else {
            setStep('editor');
          }
        });
    }
  }, [editId, mode]);

  // 2. SCRAPE LOGIC (Vacuum)
  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success) {
        setScrapedResult(data.data);
        setStep('review');
      }
    } catch (err) { alert('Scrape failed'); } 
    finally { setLoading(false); }
  };

  // 3. IMPORT LOGIC (Selection)
  const importComponent = (component: any) => {
    // If appending, we merge headers? No, stick to existing headers or add new ones?
    // For simplicity: We conform new data to existing headers if possible, or extend headers.
    
    if (mode === 'append' || rows.length > 0) {
      // Append logic: Add new rows to existing
      // Warning: If headers don't match, this creates messy JSON. 
      // We will blindly add them for now, user can edit.
      const newRows = [...rows, ...component.rows];
      
      // Update headers if new data has new keys
      const newHeaders = [...new Set([...activeHeaders, ...(component.headers || [])])];
      setActiveHeaders(newHeaders);
      setRows(newRows);
    } else {
      // Fresh Import
      setActiveHeaders(component.headers);
      setRows(component.rows);
    }
    setStep('editor');
  };

  // 4. EDITOR ACTIONS
  const handleCellChange = (index: number, header: string, value: string) => {
    const newRows = [...rows];
    if (!newRows[index]) newRows[index] = {}; // safety
    newRows[index][header] = value;
    setRows(newRows);
  };

  const addRow = () => {
    const emptyRow: any = {};
    activeHeaders.forEach(h => emptyRow[h] = "");
    setRows([...rows, emptyRow]);
  };
  
  const addColumn = () => {
    const newHeader = prompt("New Column Name:");
    if (newHeader && !activeHeaders.includes(newHeader)) {
      setActiveHeaders([...activeHeaders, newHeader]);
    }
  };

  const deleteRow = (index: number) => setRows(rows.filter((_, i) => i !== index));

  // 5. SAVE LOGIC
  const handleSave = async () => {
    if(!datasetName) return alert("Name required");
    setLoading(true);

    const endpoint = editId ? `/api/admin/dataset/${editId}` : '/api/admin/save';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      body: JSON.stringify({ 
        name: datasetName, 
        sourceUrl: url, 
        dataRows: rows 
      })
    });
    
    if (res.ok) {
      alert(editId ? "Updated Successfully" : "Created Successfully");
      router.push('/admin');
    }
    setLoading(false);
  };

  // --- RENDER ---
  if (step === 'loading') return <div className="p-10 text-center"><Loader2 className="animate-spin inline"/> Loading Data...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Sticky Header with Stepper */}
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-30 bg-surface border-b border-border shadow-glass rounded-b-xl px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center md:gap-6 mb-8">
        <button onClick={() => router.push('/admin')} className="text-text-secondary hover:text-primary flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex-1 flex flex-col md:flex-row md:items-center md:gap-4">
          <h1 className="text-2xl font-bold text-text-primary">
            {editId ? (mode === 'append' ? `Append to: ${datasetName}` : `Editing: ${datasetName}`) : 'New Dataset'}
          </h1>
          {/* Stepper */}
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <div className={`w-3 h-3 rounded-full ${step === 'input' ? 'bg-primary' : 'bg-border'}`}></div>
            <div className={`h-1 w-8 bg-gradient-to-r from-primary to-surface-elevated rounded-full`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 'review' ? 'bg-primary' : 'bg-border'}`}></div>
            <div className={`h-1 w-8 bg-gradient-to-r from-primary to-surface-elevated rounded-full`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 'editor' ? 'bg-primary' : 'bg-border'}`}></div>
          </div>
        </div>
        {step === 'editor' && scrapedResult && (
          <button
            onClick={() => setStep('review')}
            className="ml-auto px-4 py-2 bg-primary/10 text-primary rounded font-semibold border border-primary/30 hover:bg-primary/20 transition"
          >
            ← Back to Scraped Data
          </button>
        )}
        <motion.button whileHover={{ scale: 1.05 }} className="ml-4 px-6 py-2 bg-gradient-primary text-white rounded-xl font-bold shadow-glass flex items-center gap-2">
          <Save className="w-4 h-4" /> Save
        </motion.button>
      </motion.div>

      {/* INPUT STEP (Visible if New or Append) */}
      {step === 'input' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-300 max-w-2xl mx-auto">
          <label className="block text-sm font-medium text-slate-600 mb-2">Fetch Data from URL</label>
          <div className="flex gap-2 mb-6">
            <input 
              className="flex-1 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none" 
              placeholder="https://..."
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <button onClick={handleScrape} disabled={loading} className="bg-sky-600 text-white px-6 rounded font-bold flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : 'Fetch'}
            </button>
          </div>
          
          <div className="text-center text-sm text-slate-400 mb-4">- OR -</div>
          
          <button 
            onClick={() => setStep('editor')}
            className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded border border-slate-300 hover:bg-slate-200"
          >
            {rows.length > 0 ? "Skip to Editor (Keep Existing Data)" : "Start with Empty Table"}
          </button>
        </div>
      )}

      {/* REVIEW STEP */}
      {step === 'review' && scrapedResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
           {scrapedResult.components.map((comp: any, i: number) => (
             <div key={i} className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-sky-50 text-sky-600 rounded">
                    {comp.type === 'table' ? <TableIcon/> : comp.type === 'links' ? <LinkIcon/> : <List/>}
                 </div>
                 <div>
                   <h3 className="font-bold">{comp.title || comp.type}</h3>
                   <p className="text-xs text-slate-500">{comp.count} items</p>
                 </div>
               </div>
               <button onClick={() => importComponent(comp)} className="w-full py-2 bg-sky-600 text-white rounded font-bold flex items-center justify-center gap-2">
                 Import <ArrowRight className="w-4 h-4"/>
               </button>
             </div>
           ))}
        </div>
      )}

      {/* EDITOR STEP */}
      {step === 'editor' && (
        <>
        {/* Show a summary of scraped tables/links if available */}
        {scrapedResult && scrapedResult.components && (
          <div className="mb-6">
            <div className="text-xs text-text-secondary mb-2 font-semibold">Scraped Data Preview:</div>
            <div className="flex flex-wrap gap-3">
              {scrapedResult.components.map((comp: any, i: number) => (
                <div key={i} className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-xs flex flex-col min-w-[120px]">
                  <span className="font-bold mb-1 flex items-center gap-1 text-text-primary">
                    {comp.type === 'table' ? <TableIcon className="inline w-3 h-3"/> : comp.type === 'links' ? <LinkIcon className="inline w-3 h-3"/> : <List className="inline w-3 h-3"/>}
                    {comp.title || comp.type}
                  </span>
                  <span className="text-text-secondary">{comp.count} items</span>
                  {comp.headers && comp.headers.length > 0 && (
                    <span className="text-text-muted mt-1">Cols: {comp.headers.join(', ')}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-elevated rounded-2xl shadow-glass border border-border overflow-hidden backdrop-blur-md">
          <div className="p-4 bg-surface border-b border-border flex justify-between items-center">
            <input 
              className="p-2 border border-border rounded-lg w-1/3 font-semibold text-text-primary bg-surface-elevated" 
              placeholder="Dataset Name"
              value={datasetName}
              onChange={e => setDatasetName(e.target.value)}
            />
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.08 }} onClick={addColumn} className="px-4 py-2 bg-surface-elevated border border-border hover:bg-surface text-text-secondary rounded-lg text-sm font-semibold">+ Column</motion.button>
              <motion.button whileHover={{ scale: 1.08 }} onClick={handleSave} className="bg-gradient-primary text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-glass">
                 {loading ? <Loader2 className="animate-spin"/> : <><Save className="w-4 h-4"/> Save Changes</>}
              </motion.button>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-sm text-left text-text-primary">
              <thead className="bg-surface border-b border-border sticky top-0 z-10">
                <tr>
                  {activeHeaders.map((h, i) => <th key={i} className="px-4 py-3 font-bold text-text-primary whitespace-nowrap">{h}</th>)}
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <motion.tr key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={i % 2 === 0 ? "bg-surface-elevated border-b border-border hover:bg-primary/5" : "bg-surface border-b border-border hover:bg-primary/5"}>
                    {activeHeaders.map(h => (
                      <td key={h} className="px-2 py-1 border-r border-border">
                        <input value={row[h] || ''} onChange={e => handleCellChange(i, h, e.target.value)} className="w-full bg-transparent p-1 focus:bg-surface-elevated focus:outline-none rounded text-text-primary"/>
                      </td>
                    ))}
                    <td className="px-2 text-center"><motion.button whileHover={{ scale: 1.2 }} onClick={() => deleteRow(i)}><Trash2 className="w-4 h-4 text-danger hover:text-danger"/></motion.button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-surface border-t border-border">
            <motion.button whileHover={{ scale: 1.08 }} onClick={addRow} className="text-primary font-bold flex items-center gap-2 hover:underline"><Plus className="w-4 h-4"/> Add Row</motion.button>
          </div>
        </motion.div>
        </>
      )}
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><Editor /></Suspense>;
}
