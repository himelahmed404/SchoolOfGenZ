"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function StickyPurchaseBar({
  price,
  old,
  discount,
  ctaHref,
  ctaLabel = "কোর্সটি নাও",
  benefits = [],
  note,
  itemLabel,
  children,
}) {
  const cardRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const card = cardRef.current;
      const bar = barRef.current;
      if (!card || !bar) return;
      const past = card.getBoundingClientRect().bottom < 60;
      bar.style.transform = past ? "translateY(0)" : "translateY(110%)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        className="lg:sticky lg:top-22 bg-white border-2 border-ink rounded-[20px] shadow-sticker-lg overflow-hidden"
      >
        {children}
        <div className="px-4.5 pt-4.5 pb-5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-display font-extrabold text-[30px]">{price}</span>
            {old && <span className="line-through text-ink/40 font-semibold">{old}</span>}
            {discount && (
              <span className="bg-gold text-ink font-bold text-xs px-2.25 py-0.75 rounded-full border-[1.5px] border-ink">
                {discount}
              </span>
            )}
          </div>
          <Link
            href={ctaHref}
            className="block text-center mt-3.5 font-display font-bold text-lg py-3.5 bg-ink text-white border-2 border-ink rounded-full shadow-sticker no-underline transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-sticker-sm"
          >
            {ctaLabel}
          </Link>
          {benefits.length > 0 && (
            <div className="grid gap-1.75 mt-3.5 text-sm font-semibold text-success">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-2">
                  {b}
                </div>
              ))}
            </div>
          )}
          {note && (
            <div className="flex items-center justify-center gap-2 mt-3.5 text-[12.5px] text-ink/55 border-t border-cloud pt-3">
              {note}
            </div>
          )}
        </div>
      </div>

      <div
        ref={barRef}
        className="fixed left-0 right-0 bottom-0 z-[115] bg-white border-t-2 border-ink shadow-[0_-4px_16px_rgba(34,27,94,0.12)] translate-y-[110%] transition-transform duration-300"
      >
        <div className="max-w-[1160px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2.5 min-w-0">
            <span className="font-display font-extrabold text-[22px]">{price}</span>
            {old && <span className="line-through text-ink/40 text-sm">{old}</span>}
            <span className="text-sm text-ink/60 whitespace-nowrap overflow-hidden text-ellipsis">
              {itemLabel}
            </span>
          </div>
          <Link
            href={ctaHref}
            className="font-display font-bold text-base px-6.5 py-2.75 bg-ink text-white border-2 border-ink rounded-full shadow-sticker-sm no-underline whitespace-nowrap"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </>
  );
}
