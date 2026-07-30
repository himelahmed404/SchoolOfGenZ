"use client";

import { useEffect, useRef } from "react";

const MILESTONES = [
  { step: "০১", label: "কোর্স বেছে নাও", pos: "left-[2%] top-[64%] max-w-47.5" },
  { step: "০২", label: "ভর্তি হও", pos: "left-[30%] top-[2%] max-w-47.5" },
  { step: "০৩", label: "ক্লাস করো, প্র্যাকটিস করো", pos: "left-[55%] top-[60%] max-w-52.5" },
  { step: "০৪", label: "রেজাল্ট ও সার্টিফিকেট 🎓", pos: "right-0 top-[6%] max-w-50", gold: true },
];

const THRESHOLDS = [0.12, 0.36, 0.62, 0.9];

export default function Journey() {
  const outerRef = useRef(null);
  const pathRef = useRef(null);
  const mascotRef = useRef(null);
  const starRef = useRef(null);
  const msRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const pathLenRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const path = pathRef.current;
    if (path) {
      const len = path.getTotalLength();
      pathLenRef.current = len;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = reduced ? 0 : len;
    }
    if (reduced) return;

    let rafPending = false;
    const update = () => {
      const outer = outerRef.current;
      const p = pathRef.current;
      const len = pathLenRef.current;
      if (!outer || !p || !len) return;
      const rect = outer.getBoundingClientRect();
      const total = outer.offsetHeight - window.innerHeight;
      let progress = total > 0 ? -rect.top / total : 0;
      progress = Math.max(0, Math.min(1, progress));
      p.style.strokeDashoffset = String(len * (1 - progress));

      const mascot = mascotRef.current;
      if (mascot) {
        const pt = p.getPointAtLength(len * progress);
        mascot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      }
      msRefs.forEach((r, i) => {
        const el = r.current;
        if (!el) return;
        const on = progress >= THRESHOLDS[i];
        el.style.opacity = on ? "1" : "0";
        el.style.transform = on ? "translateY(0)" : "translateY(14px)";
      });
      const star = starRef.current;
      if (star) {
        const on = progress >= 0.96;
        star.style.transition = "opacity .4s, transform .4s cubic-bezier(.34,1.56,.64,1)";
        star.style.opacity = on ? "1" : "0";
      }
    };
    const onScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        update();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    requestAnimationFrame(update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={outerRef} className="relative bg-gradient-to-b from-white to-lavender" style={{ height: "230vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        <div className="text-center pt-[clamp(30px,5vh,64px)] px-6">
          <span className="font-display font-bold text-[13px] tracking-widest uppercase text-purple">
            The Journey
          </span>
          <h2 className="font-display font-extrabold text-[clamp(26px,3.6vw,40px)] mt-1.5">
            শুরু থেকে সার্টিফিকেট — চার ধাপ
          </h2>
          <p className="text-ink/55 text-base mt-1.5">স্ক্রল করো, রাস্তাটা নিজে আঁকা হবে 👇</p>
        </div>
        <div className="flex-1 relative flex items-center">
          <div className="relative w-full max-w-[1200px] mx-auto px-6">
            <svg viewBox="0 0 1200 300" className="w-full h-auto block overflow-visible">
              <path
                d="M 40 200 C 230 60, 360 300, 560 170 S 900 40, 1160 150"
                fill="none"
                stroke="rgba(34,27,94,.14)"
                strokeWidth="4"
                strokeDasharray="2 12"
                strokeLinecap="round"
              />
              <path
                ref={pathRef}
                d="M 40 200 C 230 60, 360 300, 560 170 S 900 40, 1160 150"
                fill="none"
                stroke="var(--color-purple)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <g ref={starRef} transform="translate(1160 150)" style={{ opacity: 0 }}>
                <text x="0" y="12" fontSize="46" textAnchor="middle" fill="#FFC226" stroke="#221B5E" strokeWidth="1.2">
                  ★
                </text>
              </g>
              <g ref={mascotRef} transform="translate(40 200)">
                <rect x="-30" y="-40" width="60" height="72" rx="10" fill="#EEEFFB" stroke="#221B5E" strokeWidth="2" strokeDasharray="4 4" />
                <text x="0" y="4" fontSize="30" textAnchor="middle">
                  🐧
                </text>
                <text x="0" y="26" fontSize="8" textAnchor="middle" fill="rgba(34,27,94,.5)" fontFamily="ui-monospace,monospace">
                  MASCOT
                </text>
              </g>
            </svg>

            {MILESTONES.map((m, i) => (
              <div
                key={m.step}
                ref={msRefs[i]}
                className={`absolute ${m.pos} opacity-0 transition-all duration-400`}
                style={{ transform: "translateY(14px)" }}
              >
                <div
                  className={
                    "border-2 border-ink rounded-[14px] shadow-sticker px-3.5 py-3 " +
                    (m.gold ? "bg-gold text-ink" : "bg-white text-ink")
                  }
                >
                  <div className="font-display font-extrabold text-purple text-[13px]">ধাপ {m.step}</div>
                  <div className="font-display font-bold text-base">{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
