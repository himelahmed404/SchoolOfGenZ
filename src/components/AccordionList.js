"use client";

import { useState } from "react";
import { toBn } from "@/lib/bn";

export default function AccordionList({ items, defaultOpen = 0, onOpenChange }) {
  const [open, setOpen] = useState(() => new Set(defaultOpen != null ? [defaultOpen] : []));

  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      onOpenChange?.(next);
      return next;
    });
  };

  return (
    <div className="grid gap-3">
      {items.map((m, i) => (
        <div
          key={i}
          className="bg-white border-2 border-ink rounded-[14px] shadow-[3px_3px_0_0_var(--color-ink)] overflow-hidden"
        >
          <button
            type="button"
            onClick={() => toggle(i)}
            className="w-full flex items-center gap-3.5 px-4.5 py-4 bg-transparent border-none cursor-pointer text-left"
          >
            <span className="shrink-0 w-7.5 h-7.5 rounded-lg bg-gold/25 border-[1.5px] border-ink grid place-items-center font-display font-extrabold text-sm">
              {toBn(i + 1)}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-display font-bold text-[17.5px]">{m.title}</span>
              <span className="block text-[13px] text-ink/55">
                {m.code ? `${m.code} · ${m.meta}` : m.meta}
              </span>
            </span>
            <span
              className={
                "shrink-0 text-xl text-purple transition-transform duration-200 " +
                (open.has(i) ? "rotate-180" : "")
              }
            >
              ⌄
            </span>
          </button>
          {open.has(i) && (
            <div className="px-4.5 pb-4 pl-15.5 grid gap-2">
              {m.rows.map((r, j) => (
                <div key={j} className="flex items-center gap-2.5 px-3 py-2.25 rounded-[10px] bg-cloud">
                  <span className="text-sm">{r.icon || "▶"}</span>
                  <span className="flex-1 text-[15px]">{r.text}</span>
                  {r.badge && (
                    <span className="bg-gold text-ink font-bold text-[11px] px-2.25 py-0.5 rounded-full border-[1.5px] border-ink cursor-pointer whitespace-nowrap">
                      {r.badge}
                    </span>
                  )}
                  {r.meta && <span className="text-[12.5px] text-ink/50 whitespace-nowrap">{r.meta}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
