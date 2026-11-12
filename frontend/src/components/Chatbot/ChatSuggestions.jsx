import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ChatSuggestions({ suggestions, onSelect, disabled = false }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="py-2 space-y-1.5 animate-fadeIn">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 px-1">
        <Sparkles className="w-3 h-3 text-emerald-500" />
        <span>Pertanyaan yang disarankan:</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(q)}
            className="text-left text-xs bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 font-medium px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

