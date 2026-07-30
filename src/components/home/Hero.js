"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const STICKERS = [
  {
    rot: -5,
    style: "left-[6%] top-[2%] w-52.5 z-3",
    render: () => (
      <div className="bg-white border-2 border-ink rounded-2xl shadow-sticker p-3">
        <div className="h-29.5 rounded-[9px] bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_9px,#E1E2F3_9px,#E1E2F3_18px)] grid place-items-center relative">
          <span className="absolute -top-2.75 left-6 w-19.5 h-6 bg-gold/70 border border-ink/25 -rotate-6" />
          <span className="font-mono text-[11px] text-ink/50 tracking-wide">STUDENT PHOTO</span>
        </div>
        <div className="font-display font-bold text-sm mt-2.25">&ldquo;এখন আর ভয় লাগে না&rdquo;</div>
        <div className="text-xs text-ink/55">সাব্বির · রাজশাহী</div>
      </div>
    ),
  },
  {
    rot: 6,
    style: "right-[1%] top-0 w-45 z-4",
    render: () => (
      <div className="bg-purple text-white border-2 border-ink rounded-[14px] shadow-sticker px-3.75 py-3.25">
        <div className="text-xs opacity-85 font-semibold">📘 একাডেমিক</div>
        <div className="font-display font-bold text-base leading-tight mt-0.75">CST ৪র্থ সেমিস্টার</div>
        <div className="text-[12.5px] opacity-85 mt-0.5">১২০+ ক্লাস · নোট · মডেল টেস্ট</div>
      </div>
    ),
  },
  {
    rot: -8,
    style: "right-[9%] bottom-[6%] w-43 z-5",
    render: () => (
      <div className="bg-gold text-ink border-2 border-ink rounded-[14px] shadow-sticker px-3.75 py-3.25">
        <div className="text-xs font-bold">🚀 স্কিল কোর্স</div>
        <div className="font-display font-extrabold text-base leading-tight mt-0.75">Spoken English</div>
        <div className="text-[12.5px] font-semibold mt-0.5">♾️ লাইফটাইম · 🎓 সার্টিফিকেট</div>
      </div>
    ),
  },
  {
    rot: 4,
    style: "left-[2%] bottom-[2%] w-37.5 z-6",
    render: () => (
      <div className="bg-white border-2 border-ink rounded-[14px] shadow-sticker-sm px-3.5 py-2.75 flex items-center gap-2.25">
        <span className="text-[22px]">💡</span>
        <span className="font-display font-bold text-[13.5px] leading-tight">প্রতিদিন একটু একটু</span>
      </div>
    ),
  },
  {
    rot: -14,
    style: "left-[46%] top-[6%] w-15 h-15 z-7",
    render: () => (
      <div className="w-full h-full bg-white border-2 border-ink rounded-full shadow-sticker-sm grid place-items-center text-2xl text-gold">
        ✦
      </div>
    ),
  },
  {
    rot: 7,
    style: "left-[40%] bottom-[16%] w-33 z-8",
    render: () => (
      <div className="bg-lavender border-2 border-dashed border-ink rounded-xl px-3.5 py-3.5 text-center">
        <div className="font-mono text-[10px] text-ink/50">MASCOT</div>
        <div className="text-[30px] leading-none mt-0.5">🐧</div>
        <div className="font-mono text-[9px] text-ink/40 mt-0.75">placeholder</div>
      </div>
    ),
  },
];

export default function Hero() {
  const boardRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const marker = markerRef.current;
    if (marker) {
      if (reduced) {
        marker.style.transform = "scaleX(1)";
      } else {
        marker.style.transition = "transform .7s cubic-bezier(.16,1,.3,1) .35s";
        requestAnimationFrame(() => requestAnimationFrame(() => (marker.style.transform = "scaleX(1)")));
      }
    }

    if (reduced) return;
    const board = boardRef.current;
    if (!board) return;
    const cleanups = [];
    board.querySelectorAll("[data-sticker]").forEach((el) => {
      let dx = 0;
      let dy = 0;
      const rot = parseFloat(el.dataset.rot || "0");
      el.style.transition = "transform .35s cubic-bezier(.34,1.4,.64,1)";
      el.style.transform = `translate(0px,0px) rotate(${rot}deg)`;
      el.style.touchAction = "none";

      const onDown = (e) => {
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        el.style.zIndex = "40";
        el.style.cursor = "grabbing";
        el.style.transition = "none";
        const sx = e.clientX;
        const sy = e.clientY;
        const ox = dx;
        const oy = dy;
        const onMove = (ev) => {
          dx = ox + (ev.clientX - sx);
          dy = oy + (ev.clientY - sy);
          el.style.transform = `translate(${dx}px,${dy}px) rotate(${rot}deg)`;
        };
        const onUp = () => {
          el.style.cursor = "grab";
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerup", onUp);
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerup", onUp);
      };
      el.addEventListener("pointerdown", onDown);
      cleanups.push(() => el.removeEventListener("pointerdown", onDown));
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section className="relative bg-periwinkle overflow-hidden">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(rgba(255,255,255,0)_0_37px,rgba(255,255,255,.35)_37px_38px)] pointer-events-none" />
      <div className="relative max-w-[1200px] mx-auto px-6 pt-[clamp(48px,7vw,96px)] pb-[clamp(64px,8vw,110px)] grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 items-center">
        <div className="max-w-160">
          <span className="inline-flex items-center gap-1.75 bg-white border-2 border-ink rounded-full px-3.75 py-1.75 font-bold text-sm shadow-sticker-sm">
            🇧🇩 বাংলায় শেখার প্ল্যাটফর্ম
          </span>
          <h1 className="font-display font-extrabold text-[clamp(38px,5.6vw,64px)] leading-[1.14] tracking-[-0.5px] mt-5.5 [text-wrap:balance]">
            যা শিখতে চাও —<br />
            <span className="relative inline-block whitespace-nowrap">
              <span
                ref={markerRef}
                className="absolute -left-1 -right-1 bottom-1.5 h-[42%] bg-gold rounded z-0 origin-left"
                style={{ transform: "scaleX(0)" }}
              />
              <span className="relative z-1">নিজের ভাষায়</span>
            </span>
            ।
          </h1>
          <p className="text-[clamp(17px,1.5vw,20px)] text-ink/78 mt-5 max-w-130">
            ডিপ্লোমা সেমিস্টার হোক বা Spoken English — ক্লাস, নোট আর প্র্যাকটিস, সব এক জায়গায়।
          </p>
          <div className="flex flex-wrap gap-3.5 mt-7.5 items-center">
            <a
              href="#finder"
              className="font-display font-bold text-lg px-7.5 py-3.75 bg-purple text-white border-2 border-ink rounded-full shadow-sticker no-underline transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-sticker-sm"
            >
              কোর্স দেখো
            </a>
            <a
              href="#freeclass"
              className="font-display font-bold text-lg px-6.5 py-3.75 bg-white text-ink border-2 border-ink rounded-full shadow-sticker no-underline inline-flex items-center gap-2 transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-sticker-sm"
            >
              ফ্রি ক্লাস দেখো <span className="text-sm">▶</span>
            </a>
          </div>
        </div>

        <div ref={boardRef} className="relative h-[clamp(360px,34vw,440px)]">
          {STICKERS.map((s, i) => (
            <div
              key={i}
              data-sticker
              data-rot={s.rot}
              className={`absolute cursor-grab select-none ${s.style}`}
            >
              {s.render()}
            </div>
          ))}
          <div className="absolute right-[14%] top-[36%] bg-ink text-white font-semibold text-[12.5px] px-3 py-1.5 rounded-full -rotate-[4deg] z-9 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
            টেনে দেখো 👆
          </div>
        </div>
      </div>
      <div
        className="absolute left-0 right-0 -bottom-px h-5.5 bg-white"
        style={{
          maskImage:
            "linear-gradient(135deg,transparent 11px,#000 0) 0 0/22px 100% repeat-x,linear-gradient(-135deg,transparent 11px,#000 0) 0 0/22px 100% repeat-x",
          WebkitMaskImage:
            "linear-gradient(135deg,transparent 11px,#000 0) 0 0/22px 100% repeat-x,linear-gradient(-135deg,transparent 11px,#000 0) 0 0/22px 100% repeat-x",
        }}
      />
    </section>
  );
}
