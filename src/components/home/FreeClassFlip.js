"use client";

import { useState } from "react";

export default function FreeClassFlip() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      className="mx-auto max-w-140 cursor-pointer"
      style={{ perspective: "1400px" }}
    >
      <div
        className="relative w-full transition-transform duration-[800ms]"
        style={{
          aspectRatio: "16/10",
          transformStyle: "preserve-3d",
          transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* cover */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#6a3df0] to-purple-deep border-2 border-ink rounded-2xl shadow-sticker flex flex-col items-center justify-center text-white gap-3 bg-cta-stripes overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-5xl">📓</span>
          <div className="font-display font-extrabold text-2xl">খাতাটা খুলে দেখো</div>
          <span className="bg-gold text-ink border-2 border-ink rounded-full px-5 py-2.25 font-display font-bold text-[15px] shadow-[3px_3px_0_0_rgba(0,0,0,0.25)]">
            ট্যাপ করো ✦
          </span>
        </div>
        {/* back */}
        <div
          className="absolute inset-0 bg-ink border-2 border-ink rounded-2xl shadow-sticker grid place-items-center text-white"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <div className="w-18.5 h-18.5 rounded-full bg-gold border-2 border-white grid place-items-center mx-auto text-[28px] text-ink">
              ▶
            </div>
            <div className="font-display font-bold text-lg mt-3.5">ফ্রি স্যাম্পল ক্লাস</div>
            <div className="font-mono text-[11px] text-white/50 mt-1">VIDEO EMBED · placeholder</div>
            <div className="text-[13px] text-white/70 mt-2.5">+ ডাউনলোডযোগ্য নোট</div>
          </div>
        </div>
      </div>
    </div>
  );
}
