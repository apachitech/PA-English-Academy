"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="py-3 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
    >
      <Printer className="w-4 h-4 text-slate-500" />
      <span>Imprimer / PDF</span>
    </button>
  );
}
