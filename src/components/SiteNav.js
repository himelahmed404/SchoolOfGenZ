"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { key: "how", label: "কীভাবে চলে", href: "/how" },
  { key: "teachers", label: "শিক্ষক", href: "/teachers" },
  { key: "success", label: "সফলতা", href: "/success" },
  { key: "blog", label: "ব্লগ", href: "/blog" },
];

function linkClass(on) {
  return (
    "text-ink no-underline pb-[2px] border-b-2 whitespace-nowrap " +
    (on ? "border-gold" : "border-transparent")
  );
}

export default function SiteNav({ active = "home" }) {
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const coursesOn = active === "courses" || active === "academic" || active === "skills";

  return (
    <nav className="sticky top-0 z-[100] bg-white/92 backdrop-blur-sm border-b border-cloud font-body">
      <div className="max-w-[1200px] mx-auto h-18 px-6 flex items-center gap-7">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-ink no-underline shrink-0"
        >
          <span className="inline-grid place-items-center w-9.5 h-9.5 bg-purple text-white border-2 border-ink rounded-[11px] shadow-sticker-sm font-display font-extrabold text-[19px]">
            G
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display font-extrabold text-[17px] tracking-[-0.2px]">
              School of GenZ
            </span>
            <span className="text-xs text-ink/55 font-medium">স্কুল অব জেনজি</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-5.5 ml-3.5 font-semibold text-[15.5px] flex-1">
          <Link href="/" className={linkClass(active === "home")}>
            হোম
          </Link>

          <div
            className="relative cursor-default text-ink flex items-center gap-1"
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}
          >
            <span className={linkClass(coursesOn)}>কোর্সসমূহ</span>
            <span className="text-[11px] opacity-60">▾</span>

            {dropOpen && (
              <div className="absolute top-full left-[-16px] pt-3.5 w-[520px]">
                <div className="bg-white border-2 border-ink rounded-2xl shadow-sticker-lg p-3.5 grid grid-cols-2 gap-3">
                  <Link
                    href="/academic"
                    className="block p-3.5 rounded-xl bg-purple/7 border border-purple/20 text-ink no-underline"
                  >
                    <div className="font-display font-bold text-base">
                      📘 একাডেমিক — ডিপ্লোমা
                    </div>
                    <div className="text-[13.5px] text-ink/60 mt-0.5">
                      সেমিস্টার ব্যাচ, সব ডিপার্টমেন্ট
                    </div>
                  </Link>
                  <Link
                    href="/skills"
                    className="block p-3.5 rounded-xl bg-gold/14 border border-gold/50 text-ink no-underline"
                  >
                    <div className="font-display font-bold text-base">🚀 স্কিল কোর্স</div>
                    <div className="text-[13.5px] text-ink/60 mt-0.5">
                      Spoken English · Public Speaking · IELTS
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {NAV_LINKS.map((l) => (
            <Link key={l.key} href={l.href} className={linkClass(active === l.key)}>
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="hidden lg:inline-block font-display font-bold text-[15.5px] px-5.5 py-2.75 bg-purple text-white border-2 border-ink rounded-full shadow-sticker no-underline shrink-0 transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-sticker-sm"
        >
          যোগাযোগ
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="মেনু"
          aria-expanded={mobileOpen}
          className="lg:hidden ml-auto w-11 h-11 grid place-items-center border-2 border-ink rounded-[11px] shadow-sticker-sm shrink-0"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-cloud bg-white px-6 py-4 grid gap-1">
          <Link href="/" onClick={() => setMobileOpen(false)} className="min-h-14 flex items-center font-semibold text-base text-ink no-underline">
            হোম
          </Link>
          <Link
            href="/academic"
            onClick={() => setMobileOpen(false)}
            className="min-h-14 flex flex-col justify-center rounded-xl px-3 -mx-3 bg-purple/7 no-underline"
          >
            <span className="font-display font-bold text-ink">📘 একাডেমিক — ডিপ্লোমা</span>
            <span className="text-[13px] text-ink/60">সেমিস্টার ব্যাচ, সব ডিপার্টমেন্ট</span>
          </Link>
          <Link
            href="/skills"
            onClick={() => setMobileOpen(false)}
            className="min-h-14 flex flex-col justify-center rounded-xl px-3 -mx-3 bg-gold/14 no-underline"
          >
            <span className="font-display font-bold text-ink">🚀 স্কিল কোর্স</span>
            <span className="text-[13px] text-ink/60">Spoken English · Public Speaking · IELTS</span>
          </Link>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="min-h-14 flex items-center font-semibold text-base text-ink no-underline"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="mt-2 text-center font-display font-bold text-base px-5 py-3.5 bg-purple text-white border-2 border-ink rounded-full shadow-sticker no-underline"
          >
            যোগাযোগ
          </Link>
        </div>
      )}
    </nav>
  );
}
