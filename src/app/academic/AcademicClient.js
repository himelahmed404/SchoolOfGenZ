"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SupportChat from "@/components/SupportChat";
import { BATCHES } from "@/lib/data/batches";
import { toBn, fromBn } from "@/lib/bn";

const DEPARTMENTS = [
  ["all", "সব"],
  ["CST", "CST"],
  ["সিভিল", "সিভিল"],
  ["ইলেকট্রিক্যাল", "ইলেকট্রিক্যাল"],
  ["ইলেকট্রনিক্স", "ইলেকট্রনিক্স"],
  ["মেকানিক্যাল", "মেকানিক্যাল"],
];

const SEMESTERS = [
  ["all", "সব"],
  ["১ম", "১ম"],
  ["২য়", "২য়"],
  ["৩য়", "৩য়"],
  ["৪র্থ", "৪র্থ"],
  ["৫ম", "৫ম"],
  ["৬ষ্ঠ", "৬ষ্ঠ"],
];

const STATUSES = [
  ["all", "সব"],
  ["ভর্তি চলছে", "ভর্তি চলছে"],
  ["শীঘ্রই", "শীঘ্রই"],
];

const FAQS = [
  {
    q: "ব্যাচের ফি কত এবং কীভাবে দেব?",
    a: "বেশিরভাগ ব্যাচ ৳২,৫০০ (বিশেষ ছাড়ে)। bKash বা Nagad-এ পেমেন্ট করে TrxID জমা দিলেই ভর্তি নিশ্চিত।",
  },
  {
    q: "অ্যাক্সেস কতদিন থাকবে?",
    a: "পুরো সেমিস্টার জুড়ে সব ক্লাস, নোট আর মডেল টেস্ট খোলা থাকবে।",
  },
  {
    q: "লাইভ ক্লাস মিস করলে?",
    a: "প্রতিটা লাইভ ক্লাসের রেকর্ডিং ড্যাশবোর্ডে থাকে — পরে যতবার খুশি দেখতে পারবে।",
  },
  {
    q: "আমার ডিপার্টমেন্ট নেই কেন?",
    a: "আমরা ধাপে ধাপে সব ডিপার্টমেন্ট যোগ করছি। নাম্বার রেখে গেলে তোমার ব্যাচ চালু হলে SMS পাবে।",
  },
];

const WHY_TRACK = [
  { icon: "📖", title: "বোর্ড সিলেবাস অনুযায়ী", desc: "যা পরীক্ষায় আসে, ঠিক তাই — অধ্যায় ধরে ধরে।" },
  { icon: "🎥", title: "সাপ্তাহিক লাইভ ক্লাস", desc: "সরাসরি প্রশ্ন করো; মিস করলে রেকর্ডিং।" },
  { icon: "📝", title: "অধ্যায়ভিত্তিক নোট", desc: "ডাউনলোড করে রাখো, পরীক্ষার আগে রিভিশন।" },
  { icon: "🎯", title: "বোর্ড ধাঁচে মডেল টেস্ট", desc: "সময় ধরে, হলে ঢোকার আগেই অভ্যাস।" },
];

function chipClass(active) {
  return (
    "font-body font-semibold text-sm px-3.75 py-2 rounded-full border-2 border-ink cursor-pointer shadow-sticker-sm transition-[transform,box-shadow] duration-150 " +
    (active ? "bg-purple text-white -translate-x-px -translate-y-px shadow-sticker" : "bg-white text-ink")
  );
}

function ChipGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="font-bold text-[13px] text-ink/55 min-w-24">{label}</span>
      {options.map(([val, text]) => (
        <button key={val} type="button" data-val={val} onClick={() => onChange(val)} className={chipClass(value === val)}>
          {text}
        </button>
      ))}
    </div>
  );
}

function BatchCard({ b, index }) {
  const enrolling = b.status === "ভর্তি চলছে";
  return (
    <Link
      href={`/academic/${b.slug}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className="animate-sog-up block bg-white border-2 border-ink rounded-2xl shadow-sticker overflow-hidden no-underline transition-transform duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:-rotate-[0.5deg] hover:shadow-[8px_8px_0_0_var(--color-ink)]"
    >
      <div className="h-35 bg-batch-thumb relative grid place-items-center">
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
      <div className="pt-4.25 px-4.5 pb-4.75">
        <div className="font-display font-extrabold text-lg leading-tight text-ink">{b.title}</div>
        <div className="text-[13.5px] text-ink/60 mt-1.5">{b.counts}</div>
        <div className="text-[13px] text-ink/55 mt-0.75">শুরু: {b.start}</div>
        <div className="flex items-baseline gap-2.25 mt-3.25">
          <span className="font-display font-extrabold text-[22px] text-ink">{b.price}</span>
          {b.old && <span className="line-through text-ink/40 text-sm">{b.old}</span>}
        </div>
        <span
          className={
            "block text-center mt-3.5 font-display font-bold text-[15.5px] py-2.75 rounded-full border-2 border-ink " +
            (enrolling ? "bg-purple text-white shadow-sticker-sm" : "bg-cloud text-ink/70")
          }
        >
          {enrolling ? "ভর্তি হও →" : "বিস্তারিত দেখো →"}
        </span>
      </div>
    </Link>
  );
}

export default function AcademicClient() {
  const [dept, setDept] = useState("all");
  const [sem, setSem] = useState("all");
  const [status, setStatus] = useState("all");
  const [notified, setNotified] = useState(false);
  const [phoneErr, setPhoneErr] = useState("");
  const progressRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const de = document.documentElement;
      const max = de.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = BATCHES.filter(
    (b) => (dept === "all" || b.dept === dept) && (sem === "all" || b.sem === sem) && (status === "all" || b.status === status)
  );

  const resetFilters = () => {
    setDept("all");
    setSem("all");
    setStatus("all");
  };

  const notifyMe = () => {
    const raw = phoneRef.current?.value || "";
    const digits = fromBn(raw.replace(/[^0-9০-৯]/g, ""));
    if (digits.length !== 11) {
      setPhoneErr("ফোন নম্বরটি আবার দেখো — ১১ ডিজিট হবে।");
      return;
    }
    setNotified(true);
    setPhoneErr("");
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 h-1 bg-cloud z-[120] border-b border-ink/12">
        <div ref={progressRef} className="h-full w-0 bg-gold" />
      </div>

      <SiteNav active="academic" />

      {/* PAGE HEADER */}
      <header className="bg-lavender border-b border-ink/8">
        <div className="max-w-[1100px] mx-auto px-6 py-[clamp(44px,6vw,72px)]">
          <span className="inline-flex items-center gap-1.75 bg-purple text-white border-2 border-ink rounded-full px-3.75 py-1.75 font-bold text-sm shadow-sticker-sm">
            📘 একাডেমিক
          </span>
          <h1 className="font-display font-extrabold text-[clamp(32px,4.6vw,52px)] leading-[1.14] mt-4.5">
            ডিপ্লোমা সেমিস্টার <span className="bg-gold px-2 rounded">ব্যাচ</span>
          </h1>
          <p className="text-[clamp(16px,1.5vw,19px)] text-ink/72 mt-3 max-w-140">
            তোমার ডিপার্টমেন্ট আর সেমিস্টার বেছে নাও — পুরো সিলেবাস কভার, বোর্ড প্রশ্নের ধাঁচে প্র্যাকটিস।
          </p>
        </div>
      </header>

      {/* FILTER BAR (sticky) */}
      <div className="sticky top-18 z-[80] bg-white/95 backdrop-blur-sm border-b border-cloud">
        <div className="max-w-[1100px] mx-auto px-6 py-4 grid gap-3">
          <ChipGroup label="ডিপার্টমেন্ট" options={DEPARTMENTS} value={dept} onChange={setDept} />
          <ChipGroup label="সেমিস্টার" options={SEMESTERS} value={sem} onChange={setSem} />
          <ChipGroup label="স্ট্যাটাস" options={STATUSES} value={status} onChange={setStatus} />
        </div>
      </div>

      {/* RESULTS */}
      <section className="max-w-[1100px] mx-auto px-6 pt-7 pb-17.5">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="font-display font-extrabold text-xl">
            <span className="text-purple">{toBn(filtered.length)}</span>টি ব্যাচ পাওয়া গেছে
          </div>
          <button type="button" onClick={resetFilters} className="bg-transparent border-none text-ink/55 font-body font-semibold text-sm cursor-pointer underline">
            ফিল্টার রিসেট
          </button>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b, i) => (
              <BatchCard key={b.title} b={b} index={i} />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-ink rounded-[20px] bg-lavender px-7 py-10 text-center max-w-130 mx-auto">
            <div className="w-24 h-24 mx-auto bg-white border-2 border-dashed border-ink rounded-2xl grid place-items-center">
              <span className="text-[44px]">🐧</span>
            </div>
            <div className="font-display font-extrabold text-[22px] mt-4">এই সেমিস্টারের ব্যাচ এখনো আসেনি</div>
            <p className="text-[15.5px] text-ink/65 my-2 mb-4.5">নাম্বারটা রেখে যাও — ব্যাচ চালু হলে সবার আগে SMS পাবে।</p>

            {notified ? (
              <div className="inline-flex items-center gap-2.25 bg-success text-white font-bold px-5.5 py-3 rounded-full border-2 border-ink">
                ✓ ধন্যবাদ! ব্যাচ চালু হলে জানাবো।
              </div>
            ) : (
              <>
                <div className="flex gap-2.5 max-w-100 mx-auto flex-wrap justify-center">
                  <input
                    ref={phoneRef}
                    placeholder="০১XXXXXXXXX"
                    inputMode="numeric"
                    className="flex-1 min-w-45 font-body text-base px-4 py-3 border-2 border-ink rounded-xl shadow-sticker-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={notifyMe}
                    className="font-display font-bold text-base px-5.5 py-3 bg-purple text-white border-2 border-ink rounded-xl shadow-sticker-sm cursor-pointer"
                  >
                    নোটিফাই করো
                  </button>
                </div>
                {phoneErr && <div className="text-red text-[13.5px] mt-2">{phoneErr}</div>}
              </>
            )}
          </div>
        )}
      </section>

      {/* WHY THIS TRACK */}
      <section className="bg-lavender">
        <div className="max-w-[1100px] mx-auto px-6 py-[clamp(48px,6vw,76px)]">
          <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-6 text-center">
            একাডেমিক ব্যাচে কী থাকে
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_TRACK.map((item) => (
              <div key={item.title} className="bg-white border-2 border-ink rounded-2xl shadow-sticker p-5.5">
                <div className="text-2xl">{item.icon}</div>
                <h3 className="font-display font-bold text-[17px] mt-2 mb-0.75">{item.title}</h3>
                <p className="text-sm text-ink/65">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="max-w-190 mx-auto px-6 py-[clamp(48px,6vw,76px)]">
          <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-6 text-center">
            একাডেমিক ব্যাচ · প্রশ্ন-উত্তর
          </h2>
          <div className="grid gap-3">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white border-2 border-ink rounded-[14px] shadow-[3px_3px_0_0_var(--color-ink)] px-4.5 py-4">
                <div className="font-display font-bold text-[17px]">{f.q}</div>
                <div className="text-[15px] text-ink/75 mt-1.5">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-periwinkle relative overflow-hidden bg-cta-stripes">
        <div className="relative max-w-190 mx-auto px-6 py-[clamp(48px,7vw,88px)] text-center">
          <h2 className="font-display font-extrabold text-[clamp(26px,3.6vw,42px)]">
            তোমার সেমিস্টারটা খুঁজে পেয়েছো?
          </h2>
          <p className="text-[17px] text-ink/78 mt-3 mb-6">না পেলে বলো — নতুন ব্যাচ তোমার জন্যই খুলি।</p>
          <Link
            href="/#finder"
            className="font-display font-bold text-lg px-8 py-3.75 bg-purple text-white border-2 border-ink rounded-full shadow-sticker no-underline inline-block transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg"
          >
            Course Finder খোলো
          </Link>
        </div>
      </section>

      <SiteFooter />

      <div className="fixed right-5.5 bottom-5.5 z-[130]">
        <SupportChat />
      </div>
    </div>
  );
}
