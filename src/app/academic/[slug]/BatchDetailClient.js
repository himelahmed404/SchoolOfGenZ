"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SupportChat from "@/components/SupportChat";
import AccordionList from "@/components/AccordionList";
import StickyPurchaseBar from "@/components/StickyPurchaseBar";

const WHY_TRACK = [
  { icon: "📖", title: "বোর্ড সিলেবাস অনুযায়ী", desc: "যা পরীক্ষায় আসে, ঠিক তাই — অধ্যায় ধরে ধরে।" },
  { icon: "🎥", title: "সাপ্তাহিক লাইভ ক্লাস", desc: "সরাসরি প্রশ্ন করো; মিস করলে রেকর্ডিং।" },
  { icon: "📝", title: "অধ্যায়ভিত্তিক নোট", desc: "ডাউনলোড করে রাখো, পরীক্ষার আগে রিভিশন।" },
  { icon: "🎯", title: "বোর্ড ধাঁচে মডেল টেস্ট", desc: "সময় ধরে, হলে ঢোকার আগেই অভ্যাস।" },
];

export default function BatchDetailClient({ batch }) {
  const progressRef = useRef(null);
  const fillRef = useRef(null);
  const hasFullDetail = !!batch.subjects;
  const enrolling = batch.status === "ভর্তি চলছে";
  const enrollHref = `/enroll?type=batch&slug=${batch.slug}`;

  const [freeCount] = useState(() =>
    hasFullDetail ? batch.subjects.reduce((n, s) => n + s.rows.filter((r) => r.badge).length, 0) : 0
  );

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSyllabusOpenChange = (openSet) => {
    if (fillRef.current && hasFullDetail) {
      fillRef.current.style.height = (openSet.size / batch.subjects.length) * 100 + "%";
    }
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 h-1 bg-cloud z-[120] border-b border-ink/12">
        <div ref={progressRef} className="h-full w-0 bg-gold" />
      </div>

      <SiteNav active="academic" />

      <div className="max-w-[1160px] mx-auto px-6 pt-3.5 text-[13.5px] text-ink/55">
        <Link href="/" className="text-ink/55 no-underline">
          হোম
        </Link>{" "}
        ›{" "}
        <Link href="/academic" className="text-ink/55 no-underline">
          একাডেমিক
        </Link>{" "}
        › <span className="text-ink font-semibold">{batch.dept} — {batch.sem} সেমিস্টার</span>
      </div>

      {/* HERO */}
      <header className="bg-lavender">
        <div className="max-w-[1160px] mx-auto px-6 pt-6.5 pb-12 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-9 items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="font-bold text-[13px] px-3 py-1.25 rounded-full border-[1.5px] border-ink bg-purple text-white">
                {batch.dept}
              </span>
              <span className="font-bold text-[13px] px-3 py-1.25 rounded-full border-[1.5px] border-ink bg-white text-ink">
                {batch.sem} সেমিস্টার
              </span>
              <span
                className={
                  "font-bold text-[13px] px-3 py-1.25 rounded-full border-[1.5px] border-ink " +
                  (enrolling ? "bg-success text-white" : "bg-cloud text-ink/70")
                }
              >
                {batch.status}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-[clamp(28px,3.8vw,44px)] leading-[1.16] mt-4">
              {batch.dept} {batch.sem} সেমিস্টার — <span className="bg-gold px-1.5 rounded">সম্পূর্ণ ব্যাচ</span>
            </h1>
            <p className="text-[clamp(16px,1.5vw,18.5px)] text-ink/75 mt-3.5 max-w-140">
              {batch.tagline || batch.counts}
            </p>
            <div className="flex flex-wrap gap-5 mt-5.5">
              <div>
                <div className="text-[12.5px] text-ink/55">শুরু</div>
                <div className="font-display font-bold text-base">{batch.start}</div>
              </div>
              {batch.duration && (
                <div>
                  <div className="text-[12.5px] text-ink/55">সময়কাল</div>
                  <div className="font-display font-bold text-base">{batch.duration}</div>
                </div>
              )}
              {batch.medium && (
                <div>
                  <div className="text-[12.5px] text-ink/55">মাধ্যম</div>
                  <div className="font-display font-bold text-base">{batch.medium}</div>
                </div>
              )}
            </div>
            {batch.students && (
              <div className="inline-flex items-center gap-2 mt-5 bg-white border-[1.5px] border-ink/15 rounded-full px-4 py-2 text-sm font-semibold">
                🎓 এই সেমিস্টারে ইতিমধ্যে <span className="text-purple">{batch.students}</span> শিক্ষার্থী
              </div>
            )}
          </div>

          <StickyPurchaseBar
            price={batch.price}
            old={batch.old}
            discount={batch.old ? "ছাড়ে" : undefined}
            ctaHref={enrolling ? enrollHref : "/contact"}
            ctaLabel={enrolling ? "ভর্তি হও" : "যোগাযোগ করো"}
            itemLabel={batch.title}
            note={
              <>
                <span className="bg-[#E2136E] text-white px-2 py-0.5 rounded font-bold">bKash</span>
                <span className="bg-[#F7941D] text-white px-2 py-0.5 rounded font-bold">Nagad</span>
                <span>দিয়ে পেমেন্ট</span>
              </>
            }
          >
            <div className="relative h-37.5 bg-batch-thumb grid place-items-center cursor-pointer">
              <div className="w-15 h-15 rounded-full bg-purple border-2 border-ink grid place-items-center text-white text-xl shadow-[3px_3px_0_0_var(--color-ink)]">
                ▶
              </div>
              <span className="absolute bottom-2 left-2.5 font-mono text-[10px] text-ink/50">প্রোমো ভিডিও</span>
            </div>
            {batch.deadline && (
              <div className="px-4.5 pt-3.5 flex items-center gap-1.75 text-[13.5px] text-red font-semibold">
                ⏳ ভর্তির শেষ তারিখ: {batch.deadline}
              </div>
            )}
          </StickyPurchaseBar>
        </div>
      </header>

      {hasFullDetail ? (
        <>
          {/* WHAT YOU GET */}
          <section className="max-w-[1160px] mx-auto px-6 py-[clamp(44px,6vw,72px)]">
            <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-6">এই ব্যাচে যা পাচ্ছো</h2>
            <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {batch.stats.map((s) => (
                <div key={s.label} className="bg-white border-2 border-ink rounded-2xl shadow-sticker p-4.5">
                  <div className="text-2xl">{s.icon}</div>
                  <div className="font-display font-extrabold text-2xl mt-1.5">{s.n}</div>
                  <div className="text-[13.5px] text-ink/62">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* SYLLABUS */}
          <section id="syllabus" className="bg-lavender">
            <div className="max-w-225 mx-auto px-6 py-[clamp(44px,6vw,72px)]">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)]">সম্পূর্ণ সিলেবাস</h2>
                <div className="text-sm text-ink/60">
                  {batch.subjects.length}টি বিষয় ·{" "}
                  <span className="text-purple font-bold">{freeCount}টি ফ্রি লেসন</span>
                </div>
              </div>
              <p className="text-[15.5px] text-ink/65 my-1.5 mb-5.5">
                তোমার বিষয়গুলো আছে কিনা মিলিয়ে নাও — প্রতিটা অধ্যায় ধরে ধরে কভার করা।
              </p>

              <div className="relative pl-6.5">
                <div className="absolute left-1.75 top-1.5 bottom-1.5 w-[3px] bg-ink/12 rounded" />
                <div
                  ref={fillRef}
                  className="absolute left-1.75 top-1.5 w-[3px] h-0 bg-purple rounded transition-[height] duration-500"
                  style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
                />
                <AccordionList items={batch.subjects} defaultOpen={null} onOpenChange={onSyllabusOpenChange} />
              </div>
            </div>
          </section>

          {/* LIVE ROUTINE */}
          <section className="bg-white">
            <div className="max-w-225 mx-auto px-6 py-[clamp(44px,6vw,72px)]">
              <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-1.5">
                সাপ্তাহিক লাইভ ক্লাস রুটিন
              </h2>
              <p className="text-[15px] text-ink/60 mb-5">
                লাইভ ক্লাস মিস করলে রেকর্ডিং পাবে — কিছু বাদ যাবে না।
              </p>
              <div className="border-2 border-ink rounded-2xl shadow-sticker overflow-hidden overflow-x-auto">
                <div className="grid grid-cols-[1fr_1fr_1.4fr_1.4fr] bg-ink text-white font-display font-bold text-[14.5px] min-w-140">
                  <div className="px-4 py-3">বার</div>
                  <div className="px-4 py-3">সময়</div>
                  <div className="px-4 py-3">বিষয়</div>
                  <div className="px-4 py-3">শিক্ষক</div>
                </div>
                {batch.routine.map((r) => (
                  <div
                    key={r.day}
                    className="grid grid-cols-[1fr_1fr_1.4fr_1.4fr] border-t border-cloud text-[15px] min-w-140"
                  >
                    <div className="px-4 py-3.25 font-bold">{r.day}</div>
                    <div className="px-4 py-3.25">{r.time}</div>
                    <div className="px-4 py-3.25">{r.subject}</div>
                    <div className="px-4 py-3.25 text-ink/70">{r.teacher}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TEACHERS */}
          <section className="bg-lavender">
            <div className="max-w-225 mx-auto px-6 py-[clamp(44px,6vw,72px)]">
              <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-5.5">
                এই ব্যাচের শিক্ষকবৃন্দ
              </h2>
              <div className="flex flex-wrap gap-4.5">
                {batch.teachers.map((t) => (
                  <div
                    key={t.title}
                    className="flex-1 min-w-75 flex gap-4 bg-white border-2 border-ink rounded-2xl shadow-sticker p-4"
                  >
                    <div className="relative shrink-0 w-22.5 h-27.5 rounded-[10px] bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_8px,#E1E2F3_8px,#E1E2F3_16px)] grid place-items-center">
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 -rotate-3 w-15 h-4.5 bg-gold/70 border border-ink/25" />
                      <span className="font-mono text-[9px] text-ink/45">PHOTO</span>
                    </div>
                    <div>
                      <div className="font-display font-extrabold text-lg">{t.title}</div>
                      <div className="text-sm text-purple font-semibold">{t.teaches}</div>
                      <div className="text-[13.5px] text-ink/62 mt-1">{t.credential}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FREE CLASS */}
          <section className="bg-white">
            <div className="max-w-200 mx-auto px-6 py-[clamp(44px,6vw,72px)] text-center">
              <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-1.5">
                কেনার আগে একটা ক্লাস দেখে নাও
              </h2>
              <p className="text-[15.5px] text-ink/60 mb-5.5">গণিত-৪ এর প্রথম অধ্যায় — সম্পূর্ণ ফ্রি।</p>
              <div className="relative aspect-video border-2 border-ink rounded-2xl shadow-sticker bg-gradient-to-br from-[#6a3df0] to-purple-deep grid place-items-center cursor-pointer overflow-hidden bg-cta-stripes">
                <div className="relative text-center text-white">
                  <div className="w-19 h-19 rounded-full bg-gold border-2 border-white grid place-items-center mx-auto text-[28px] text-ink">
                    ▶
                  </div>
                  <div className="font-mono text-[11px] text-white/60 mt-3">VIDEO EMBED · placeholder</div>
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="bg-ink text-white">
            <div className="max-w-[1000px] mx-auto px-6 py-[clamp(44px,6vw,72px)]">
              <div className="text-center mb-6.5">
                <span className="text-gold font-bold">✦ শিক্ষার্থীদের কথা ✦</span>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                {batch.testimonials.map((t) => (
                  <div
                    key={t.title}
                    className="bg-white text-ink border-2 border-black rounded-[14px] shadow-[4px_4px_0_0_rgba(0,0,0,0.4)] px-5 py-4.5"
                  >
                    <div className="text-gold text-sm tracking-[2px]">★★★★★</div>
                    <p className="text-[15.5px] my-2">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-2.5">
                      <span className="w-9.5 h-9.5 rounded-full bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_6px,#E1E2F3_6px,#E1E2F3_12px)] border-[1.5px] border-ink shrink-0" />
                      <div>
                        <div className="font-display font-bold text-[14.5px]">{t.title}</div>
                        <div className="text-[12.5px] text-ink/60">{t.meta}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HOW TO ENROLL */}
          <section className="bg-lavender">
            <div className="max-w-225 mx-auto px-6 py-[clamp(44px,6vw,72px)]">
              <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-6 text-center">
                কীভাবে ভর্তি হবে
              </h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                {[
                  {
                    n: "০১",
                    title: "bKash-এ পেমেন্ট",
                    desc: `Send Money করো ০১XXXXXXXXX নম্বরে, ${batch.price}।`,
                    swatch: "bg-[repeating-linear-gradient(45deg,#f7dce9,#f7dce9_8px,#f2cadd_8px,#f2cadd_16px)]",
                    label: "bKash SCREENSHOT",
                  },
                  {
                    n: "০২",
                    title: "TrxID জমা দাও",
                    desc: "ভর্তি ফর্মে TrxID আর তোমার নম্বর লিখে দাও।",
                    swatch: "bg-cloud",
                    label: "FORM SCREENSHOT",
                  },
                  {
                    n: "০৩",
                    title: "অ্যাক্সেস পাও",
                    desc: "২৪ ঘণ্টার মধ্যে কনফার্মেশন SMS আর ড্যাশবোর্ড খুলে যাবে।",
                    swatch: "bg-[repeating-linear-gradient(45deg,#d6f0e4,#d6f0e4_8px,#c3e8d5_8px,#c3e8d5_16px)]",
                    label: "SMS SCREENSHOT",
                  },
                ].map((s) => (
                  <div key={s.n} className="bg-white border-2 border-ink rounded-2xl shadow-sticker p-5">
                    <div className="font-display font-extrabold text-purple text-[22px]">{s.n}</div>
                    <h3 className="font-display font-bold text-[17px] mt-1.5 mb-1">{s.title}</h3>
                    <p className="text-sm text-ink/65 mb-2.5">{s.desc}</p>
                    <div className={`h-22.5 rounded-lg grid place-items-center font-mono text-[10px] text-ink/50 ${s.swatch}`}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6.5">
                <Link
                  href={enrollHref}
                  className="font-display font-bold text-lg px-8.5 py-3.75 bg-purple text-white border-2 border-ink rounded-full shadow-sticker no-underline inline-block transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg"
                >
                  এখনই ভর্তি হও →
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white">
            <div className="max-w-190 mx-auto px-6 py-[clamp(44px,6vw,72px)]">
              <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-6 text-center">
                প্রশ্ন-উত্তর
              </h2>
              <div className="grid gap-3">
                {batch.faqs.map((f) => (
                  <div
                    key={f.q}
                    className="bg-white border-2 border-ink rounded-[14px] shadow-[3px_3px_0_0_var(--color-ink)] px-4.5 py-4"
                  >
                    <div className="font-display font-bold text-[16.5px]">{f.q}</div>
                    <div className="text-[15px] text-ink/75 mt-1.5">{f.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="bg-lavender">
          <div className="max-w-[1100px] mx-auto px-6 py-[clamp(44px,6vw,72px)]">
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
            {!enrolling && (
              <p className="text-center text-[15px] text-ink/60 mt-8 max-w-130 mx-auto">
                এই ব্যাচের বিস্তারিত সিলেবাস আর রুটিন শীঘ্রই যুক্ত হবে। যোগাযোগ পাতা থেকে নম্বর রেখে গেলে ব্যাচ চালু
                হওয়ার সাথে সাথেই জানিয়ে দেব।
              </p>
            )}
          </div>
        </section>
      )}

      <SiteFooter />

      <div className="fixed right-5.5 bottom-23 z-[130]">
        <SupportChat />
      </div>
    </div>
  );
}
