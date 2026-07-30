"use client";

import { useState } from "react";
import Link from "next/link";
import { BATCHES } from "@/lib/data/batches";
import { SKILLS } from "@/lib/data/skills";

const DEPARTMENTS = ["CST", "সিভিল", "ইলেকট্রিক্যাল", "ইলেকট্রনিক্স", "মেকানিক্যাল"];
const SEMESTERS = ["১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ"];
const GOALS = [
  { label: "ইংরেজিতে কথা বলতে চাই", slug: "spoken-english-mastery" },
  { label: "স্টেজে ভয় লাগে", slug: "public-speaking-presentation" },
  { label: "IELTS দেবো", slug: "ielts-preparation" },
];

function chipClass(active, accent) {
  const base =
    "font-semibold text-[15px] px-4 py-2.25 rounded-full border-2 border-ink cursor-pointer shadow-sticker-sm transition-[transform,box-shadow] duration-150 ";
  if (!active) return base + "bg-white text-ink";
  return base + (accent === "gold" ? "bg-gold text-ink -translate-x-px -translate-y-px shadow-sticker" : "bg-purple text-white -translate-x-px -translate-y-px shadow-sticker");
}

function tabClass(active) {
  return (
    "font-display font-bold text-[15px] px-5 py-2.25 rounded-full border-none cursor-pointer transition-colors duration-200 " +
    (active ? "bg-ink text-white" : "bg-transparent text-ink/60")
  );
}

export default function CourseFinder() {
  const [mode, setMode] = useState("academic");
  const [dept, setDept] = useState(null);
  const [sem, setSem] = useState(null);
  const [goal, setGoal] = useState(null);

  const setAcademic = () => {
    setMode("academic");
    setGoal(null);
  };
  const setSkill = () => {
    setMode("skill");
    setDept(null);
    setSem(null);
  };

  const isAcad = mode === "academic";
  const isSkill = mode === "skill";
  const acc = isSkill ? "gold" : "purple";

  let result = null;
  if (isAcad && dept && sem) {
    const b = BATCHES.find((x) => x.dept === dept && x.sem === sem);
    if (b && b.status === "ভর্তি চলছে") {
      result = {
        card: true,
        badge: "📘 " + b.status,
        badgeClass: "bg-purple text-white",
        title: b.title,
        meta: `${b.counts} · শুরু ${b.start}`,
        price: b.price,
        old: b.old,
        href: `/academic/${b.slug}`,
        cta: "ভর্তি হও",
        ctaClass: "bg-purple text-white",
      };
    } else {
      result = { empty: true, title: `${dept} — ${sem} সেমিস্টার`, sub: "এই ব্যাচটি শীঘ্রই আসছে — চালু হলে SMS পেতে নাম্বার দাও।" };
    }
  } else if (isSkill && goal) {
    const g = GOALS.find((x) => x.label === goal);
    const sk = g && SKILLS.find((x) => x.slug === g.slug);
    if (sk) {
      result = {
        card: true,
        badge: "🚀 স্কিল কোর্স",
        badgeClass: "bg-gold text-ink",
        title: sk.title,
        meta: `${sk.lessons} · ${sk.dur} · ♾️ লাইফটাইম · 🎓 সার্টিফিকেট`,
        price: sk.price,
        old: sk.old,
        href: `/skills/${sk.slug}`,
        cta: "কোর্সটি নাও",
        ctaClass: "bg-ink text-white",
      };
    }
  }

  return (
    <section id="finder" className="bg-lavender border-y border-ink/8">
      <div className="max-w-230 mx-auto px-6 py-[clamp(56px,7vw,90px)]">
        <div className="text-center">
          <span className="font-display font-bold text-[13px] tracking-widest uppercase text-purple">
            Course Finder
          </span>
          <h2 className="font-display font-extrabold text-[clamp(26px,3.6vw,40px)] mt-1.5">
            তোমার কোর্সটা খুঁজে নাও
          </h2>
          <p className="text-ink/60 text-[17px] mt-2">দুই ট্যাপে বের করো তোমার জন্য কোনটা।</p>
        </div>

        <div className="bg-white border-2 border-ink rounded-2xl shadow-sticker p-[clamp(20px,3vw,32px)] mt-7.5">
          <div className="inline-flex bg-cloud border-2 border-ink rounded-full p-1 gap-1">
            <button type="button" onClick={setAcademic} className={tabClass(isAcad)}>
              📘 একাডেমিক
            </button>
            <button type="button" onClick={setSkill} className={tabClass(isSkill)}>
              🚀 স্কিল কোর্স
            </button>
          </div>

          {isAcad && (
            <div className="mt-6">
              <div className="font-bold text-sm text-ink/65 mb-2.5">১ · ডিপার্টমেন্ট</div>
              <div className="flex flex-wrap gap-2.25">
                {DEPARTMENTS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDept(d);
                      setSem(null);
                    }}
                    className={chipClass(d === dept, acc)}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {dept && (
                <>
                  <div className="font-bold text-sm text-ink/65 mt-5 mb-2.5">২ · সেমিস্টার</div>
                  <div className="flex flex-wrap gap-2.25">
                    {SEMESTERS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSem(s)}
                        className={chipClass(s === sem, acc)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {isSkill && (
            <div className="mt-6">
              <div className="font-bold text-sm text-ink/65 mb-2.5">তোমার লক্ষ্য কী?</div>
              <div className="flex flex-wrap gap-2.25">
                {GOALS.map((g) => (
                  <button
                    key={g.label}
                    type="button"
                    onClick={() => setGoal(g.label)}
                    className={chipClass(g.label === goal, "gold")}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6.5 border-t-2 border-dashed border-ink/15 pt-5.5">
              {result.empty ? (
                <div className="flex gap-4 items-center bg-cloud border-2 border-dashed border-ink rounded-2xl px-5 py-4.5">
                  <span className="text-[30px]">🔔</span>
                  <div>
                    <div className="font-display font-bold text-lg">{result.title}</div>
                    <div className="text-[14.5px] text-ink/60">{result.sub}</div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4.5 items-stretch flex-wrap bg-white border-2 border-ink rounded-[18px] shadow-sticker p-4.5">
                  <div className="flex-none w-37.5 min-w-37.5 rounded-xl bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_9px,#E1E2F3_9px,#E1E2F3_18px)] grid place-items-center">
                    <span className="font-mono text-[11px] text-ink/50">COVER</span>
                  </div>
                  <div className="flex-1 min-w-55 flex flex-col">
                    <span
                      className={`self-start font-bold text-xs px-2.75 py-1 rounded-full border-[1.5px] border-ink ${result.badgeClass}`}
                    >
                      {result.badge}
                    </span>
                    <div className="font-display font-extrabold text-xl mt-2.25 mb-1">{result.title}</div>
                    <div className="text-[14.5px] text-ink/62">{result.meta}</div>
                    <div className="flex items-baseline gap-2.5 mt-auto pt-3">
                      <span className="font-display font-extrabold text-2xl">{result.price}</span>
                      {result.old && <span className="line-through text-ink/40 font-semibold">{result.old}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <Link
                      href={result.href}
                      className={`font-display font-bold text-base px-5.5 py-3 border-2 border-ink rounded-full shadow-sticker-sm text-center no-underline whitespace-nowrap ${result.ctaClass}`}
                    >
                      {result.cta} →
                    </Link>
                    <Link href={result.href} className="text-[13.5px] text-center text-ink/55 no-underline">
                      বিস্তারিত দেখো
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="text-center text-ink/50 text-sm mt-3.5 italic">
          💡 এই টুলটাই সাইটের সবচেয়ে দ্রুত রাস্তা — বেছে নাও, বাকিটা আমরা দেখাচ্ছি।
        </div>
      </div>
    </section>
  );
}
