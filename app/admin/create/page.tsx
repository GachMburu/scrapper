'use client';
import { useState } from 'react';
import { Trash2, Plus, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Default structure for Startup Funding
const DEFAULT_HEADERS = ['Company', 'Industry', 'Amount', 'Round', 'Investor', 'Website'];

export default function CreateDatasetPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [datasetName, setDatasetName] = useState('');
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  // 1. Run the Scraper
  const handleScrape = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      
      // Transform the generic scraper result into our Funding Table format
      // NOTE: This is a placeholder. In a real scenario, the scraper would return these specific keys.
      // For now, we populate 'Company' with the page title and leave others blank for editing.
      const newRow = {
        Company: data.data.title || "New Company",
        Industry: "Tech",
        Amount: "$0",
        Round: "Seed",
        Investor: "Unknown",
        Website: url
      };
      
      setRows((prev) => [...prev, newRow]);
    } catch (err) {
      alert('Scrape failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. Manual Add Row
  const addEmptyRow = () => {
    setRows([...rows, { Company: "", Industry: "", Amount: "", Round: "", Investor: "", Website: "" }]);
  };

  // 3. Edit Cell
  const handleCellChange = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  // 4. Delete Row
  const deleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // 5. Save to Database
  const handleSave = async () => {
    if(!datasetName) return alert("Please name this dataset");
    
    setLoading(true);
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      body: JSON.stringify({ 
        name: datasetName, 
        sourceUrl: url, 
        dataRows: rows 
      })
    });
    
    if(res.ok) {
      alert("Saved to Marketplace!");
      setRows([]);
      setDatasetName("");
      setUrl("");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Create New Dataset</h1>

      {/* Scraper Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Dataset Name</label>
          <input 
            className="w-full p-2 border border-slate-300 rounded" 
            placeholder="e.g. Q1 2024 Fintech Funding"
            value={datasetName}
            onChange={e => setDatasetName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Source URL</label>
          <div className="flex gap-2">
            <input 
              className="w-full p-2 border border-slate-300 rounded" 
              placeholder="https://..."
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <button 
              onClick={handleScrape}
              disabled={loading}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              {loading ? 'Processing...' : 'Run Scraper'}
            </button>
          </div>
        </div>
      </div>

      {/* The Editor Table */}
      {rows.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  {DEFAULT_HEADERS.map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b hover:bg-slate-50">
                    {DEFAULT_HEADERS.map((header) => (
                      <td key={header} className="px-2 py-2">
                        <input 
                          value={row[header] || ''}
                          onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                          className="w-full bg-transparent p-1 border-b border-transparent focus:border-sky-500 focus:outline-none"
                        />
                      </td>
                    ))}
                    <td className="px-6 py-2 text-center">
                      <button onClick={() => deleteRow(rowIndex)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-50 flex justify-between items-center border-t">
            <button onClick={addEmptyRow} className="flex items-center gap-2 text-sky-600 font-medium hover:underline">
              <Plus className="w-4 h-4" /> Add Row Manually
            </button>
            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
              <Save className="w-4 h-4" /> Save to Marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
