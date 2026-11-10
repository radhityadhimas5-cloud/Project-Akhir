import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Memuat data sistem...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 className="w-9 h-9 text-emerald-600 animate-spin mb-3" />
      <span className="text-sm font-medium text-slate-600">{message}</span>
    </div>
  );
}

