import React from 'react';

interface UndoRedoBarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export default function UndoRedoBar({ canUndo, canRedo, onUndo, onRedo }: UndoRedoBarProps) {
  return (
    <div className="flex gap-2 mb-2">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Undo
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Redo
      </button>
    </div>
  );
}
