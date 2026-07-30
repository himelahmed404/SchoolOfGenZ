"use client";

import { useRef } from "react";
import Link from "next/link";
import { BATCHES } from "@/lib/data/batches";
import { SKILLS } from "@/lib/data/skills";

function BatchRailCard({ b }) {
  const enrolling = b.status === "ভর্তি চলছে";
  return (
    <Link
      href={`/academic/${b.slug}`}
      className="scroll-snap-start shrink-0 w-75 bg-white border-2 border-ink rounded-2xl shadow-sticker overflow-hidden no-underline text-ink transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:-rotate-[0.6deg] hover:shadow-[7px_7px_0_0_var(--color-ink)]"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="h-32.5 relative grid place-items-center bg-batch-thumb">
        <span
          className={
            "absolute top-3 left-3 font-bold text-[11.5px] px-2.5 py-1 rounded-full border-[1.5px] border-ink " +
            (enrolling ? "bg-success text-white" : "bg-cloud text-ink/70")
          }
        >
          {b.status}
        </span>
        <span className="font-mono text-[11px] text-ink/45">COVER · {b.dept}</span>
      </div>
      <div className="px-4.25 pt-4 pb-4.5">
        <div className="font-display font-extrabold text-lg leading-tight">{b.title}</div>
        <div className="text-[13.5px] text-ink/60 mt-1.25">{b.counts}</div>
        <div className="text-[13px] text-ink/55 mt-0.75">শুরু: {b.start}</div>
        <div className="flex items-baseline gap-2.25 mt-3">
          <span className="font-display font-extrabold text-[22px]">{b.price}</span>
          {b.old && <span className="line-through text-ink/40 text-sm">{b.old}</span>}
        </div>
        <span className="block text-center mt-3.25 font-display font-bold text-[15.5px] py-2.75 bg-purple text-white border-2 border-ink rounded-full shadow-sticker-sm">
          {enrolling ? "ভর্তি হও" : "বিস্তারিত দেখো"}
        </span>
      </div>
    </Link>
  );
}

function SkillRailCard({ s }) {
  return (
    <Link
      href={`/skills/${s.slug}`}
      className="scroll-snap-start shrink-0 w-75 bg-white border-2 border-ink rounded-2xl shadow-sticker overflow-hidden no-underline text-ink transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:rotate-[0.6deg] hover:shadow-[7px_7px_0_0_var(--color-ink)]"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="h-32.5 relative grid place-items-center bg-[repeating-linear-gradient(45deg,#FFF3D4,#FFF3D4_10px,#FCE9B5_10px,#FCE9B5_20px)]">
        <span className="absolute top-3 left-3 bg-gold text-ink font-bold text-xs px-2.5 py-1 rounded-full border-[1.5px] border-ink">
          {s.level}
        </span>
        <span className="font-mono text-[11px] text-ink/45">COVER</span>
      </div>
      <div className="px-4.25 pt-4 pb-4.5">
        <div className="font-display font-extrabold text-lg leading-tight">{s.title}</div>
        <div className="text-[13.5px] text-ink/60 mt-1.25">
          {s.lessons} · {s.dur}
        </div>
        <div className="text-[12.5px] text-success font-bold mt-1">♾️ লাইফটাইম · 🎓 সার্টিফিকেট</div>
        <div className="flex items-baseline gap-2.25 mt-3">
          <span className="font-display font-extrabold text-[22px]">{s.price}</span>
          <span className="line-through text-ink/40 text-sm">{s.old}</span>
        </div>
        <span className="block text-center mt-3.25 font-display font-bold text-[15.5px] py-2.75 bg-ink text-white border-2 border-ink rounded-full shadow-sticker-sm">
          কোর্সটি নাও
        </span>
      </div>
    </Link>
  );
}

export default function Rails() {
  const acadRailRef = useRef(null);
  const scrollAcad = (dir) => acadRailRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section id="rails" className="py-[clamp(56px,7vw,90px)] bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <span className="inline-block bg-purple/10 text-purple font-bold text-[13px] px-3 py-1.25 rounded-full">
              📘 একাডেমিক ব্যাচ
            </span>
            <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mt-3">চলমান ডিপ্লোমা ব্যাচ</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollAcad(-1)}
              aria-label="আগের"
              className="w-11 h-11 rounded-full border-2 border-ink bg-white shadow-sticker-sm cursor-pointer text-lg"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollAcad(1)}
              aria-label="পরের"
              className="w-11 h-11 rounded-full border-2 border-ink bg-white shadow-sticker-sm cursor-pointer text-lg"
            >
              ›
            </button>
          </div>
        </div>
      </div>
      <div className="bg-lavender mt-5.5 py-6.5">
        <div
          ref={acadRailRef}
          className="max-w-[1200px] mx-auto px-6 flex gap-4.5 overflow-x-auto [scrollbar-width:none]"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {BATCHES.slice(0, 3).map((b) => (
            <BatchRailCard key={b.slug} b={b} />
          ))}
          <Link
            href="/academic"
            className="shrink-0 w-50 border-2 border-dashed border-ink rounded-2xl grid place-content-center text-center text-ink no-underline gap-1.5 bg-white/50"
            style={{ scrollSnapAlign: "start" }}
          >
            <span className="text-[28px]">📚</span>
            <span className="font-display font-bold text-base">সব ব্যাচ দেখো →</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-9.5">
        <span className="inline-block bg-gold/22 text-[#8a6a00] font-bold text-[13px] px-3 py-1.25 rounded-full">
          🚀 স্কিল কোর্স
        </span>
        <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mt-3 mb-4.5">
          ক্যারিয়ার বদলে দেওয়া স্কিল
        </h2>
        <div className="flex gap-4.5 overflow-x-auto pb-1.5 [scrollbar-width:none]" style={{ scrollSnapType: "x mandatory" }}>
          {SKILLS.map((s) => (
            <SkillRailCard key={s.slug} s={s} />
          ))}
          <Link
            href="/skills"
            className="shrink-0 w-50 border-2 border-dashed border-ink rounded-2xl grid place-content-center text-center text-ink no-underline gap-1.5 bg-white/50"
            style={{ scrollSnapAlign: "start" }}
          >
            <span className="text-[28px]">🎯</span>
            <span className="font-display font-bold text-base">সব কোর্স দেখো →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
