import React from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface EditorHeaderProps {
  title: string;
  loading: boolean;
  onBack: () => void;
  onSave?: () => void;
  showSave?: boolean;
}

export default function EditorHeader({ title, loading, onBack, onSave, showSave }: EditorHeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-200 mb-8">
      <div className="flex items-center gap-4 py-4 px-2">
        <button
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        {showSave && (
          <button
            onClick={onSave}
            className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        )}
      </div>
    </div>
  );
}
