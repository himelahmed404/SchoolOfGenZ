"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SupportChat from "@/components/SupportChat";
import AccordionList from "@/components/AccordionList";
import StickyPurchaseBar from "@/components/StickyPurchaseBar";

function OutcomeCheck({ text, delay }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = reduced ? 0 : len;
    if (reduced) return;
    const el = p.closest("[data-outcome-item]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            p.style.transition = `stroke-dashoffset .5s ease ${delay}ms`;
            p.style.strokeDashoffset = 0;
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    if (el) io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      data-outcome-item
      className="flex items-center gap-4 bg-white border-2 border-ink rounded-[14px] shadow-[3px_3px_0_0_var(--color-ink)] px-5 py-4"
    >
      <svg width="34" height="34" viewBox="0 0 34 34" className="shrink-0">
        <circle cx="17" cy="17" r="15" fill="none" stroke="#1FA36B" strokeWidth="2" opacity="0.25" />
        <path
          ref={pathRef}
          d="M10 17.5 L15 22.5 L24 11.5"
          fill="none"
          stroke="#1FA36B"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-base font-medium">{text}</span>
    </div>
  );
}

export default function SkillDetailClient({ skill }) {
  const progressRef = useRef(null);
  const hasFullDetail = !!skill.modules;

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

  const enrollHref = `/enroll?type=skill&slug=${skill.slug}`;
  const freeCount = hasFullDetail
    ? skill.modules.reduce((n, m) => n + m.rows.filter((r) => r.badge).length, 0)
    : 0;

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 h-1 bg-cloud z-[120] border-b border-ink/12">
        <div ref={progressRef} className="h-full w-0 bg-gold" />
      </div>

      <SiteNav active="skills" />

      <div className="max-w-[1160px] mx-auto px-6 pt-3.5 text-[13.5px] text-ink/55">
        <Link href="/" className="text-ink/55 no-underline">
          হোম
        </Link>{" "}
        ›{" "}
        <Link href="/skills" className="text-ink/55 no-underline">
          স্কিল কোর্স
        </Link>{" "}
        › <span className="text-ink font-semibold">{skill.title}</span>
      </div>

      {/* HERO */}
      <header className="bg-lavender">
        <div className="max-w-[1160px] mx-auto px-6 pt-6.5 pb-12 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-9 items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="font-bold text-[13px] px-3 py-1.25 rounded-full border-[1.5px] border-ink bg-gold text-ink">
                {skill.level}
              </span>
              <span className="font-bold text-[13px] px-3 py-1.25 rounded-full border-[1.5px] border-ink bg-white text-ink">
                {skill.dur} · {skill.lessons}
              </span>
              {hasFullDetail && (
                <span className="font-bold text-[13px] px-3 py-1.25 rounded-full border-[1.5px] border-ink bg-white text-ink">
                  🎓 সার্টিফিকেট
                </span>
              )}
            </div>
            <h1 className="font-display font-extrabold text-[clamp(28px,3.8vw,44px)] leading-[1.16] mt-4">
              {skill.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="bg-gold px-1.5 rounded">{skill.title.split(" ").slice(-1)}</span>
            </h1>
            <p className="text-[clamp(16px,1.5vw,18.5px)] text-ink/75 mt-3.5 max-w-140">
              {skill.tagline || skill.pitch}
            </p>
            {skill.students && (
              <div className="inline-flex items-center gap-2 mt-5 bg-white border-[1.5px] border-ink/15 rounded-full px-4 py-2 text-sm font-semibold">
                🎤 {skill.students}
              </div>
            )}
          </div>

          <StickyPurchaseBar
            price={skill.price}
            old={skill.old}
            discount={skill.discount}
            ctaHref={enrollHref}
            ctaLabel="কোর্সটি নাও"
            itemLabel={skill.title}
            benefits={["♾️ লাইফটাইম অ্যাক্সেস", "🎓 কোর্স শেষে সার্টিফিকেট", "🎤 লাইভ প্র্যাকটিস সেশন"]}
            note={
              <>
                <span className="bg-[#E2136E] text-white px-2 py-0.5 rounded font-bold">bKash</span>
                <span className="bg-[#F7941D] text-white px-2 py-0.5 rounded font-bold">Nagad</span>
                <span>দিয়ে পেমেন্ট</span>
              </>
            }
          >
            <div className="relative h-37.5 bg-[repeating-linear-gradient(45deg,#FFF3D4,#FFF3D4_10px,#FCE9B5_10px,#FCE9B5_20px)] grid place-items-center cursor-pointer">
              <div className="w-15 h-15 rounded-full bg-ink border-2 border-ink grid place-items-center text-white text-xl shadow-[3px_3px_0_0_rgba(0,0,0,0.25)]">
                ▶
              </div>
              <span className="absolute bottom-2 left-2.5 font-mono text-[10px] text-ink/50">প্রোমো ভিডিও</span>
            </div>
          </StickyPurchaseBar>
        </div>
      </header>

      {hasFullDetail ? (
        <>
          {/* FOR WHOM */}
          <section className="max-w-[1100px] mx-auto px-6 py-[clamp(44px,6vw,72px)]">
            <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-5.5">
              এই কোর্সটি কার জন্য
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {skill.forWhom.map((p) => (
                <div key={p.title} className="bg-white border-2 border-ink rounded-2xl shadow-sticker p-5.5">
                  <div className="text-[28px]">{p.icon}</div>
                  <h3 className="font-display font-bold text-[17.5px] mt-2 mb-1">{p.title}</h3>
                  <p className="text-[14.5px] text-ink/65">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* OUTCOMES */}
          <section className="bg-lavender">
            <div className="max-w-225 mx-auto px-6 py-[clamp(44px,6vw,72px)]">
              <div className="text-center mb-1.5">
                <span className="font-display font-bold text-[13px] tracking-widest uppercase text-purple">
                  Outcomes
                </span>
              </div>
              <h2 className="font-display font-extrabold text-[clamp(26px,3.4vw,40px)] mb-1.5 text-center">
                কোর্স শেষে তুমি পারবে
              </h2>
              <p className="text-base text-ink/60 mx-auto mb-7 text-center max-w-130">
                লেসন সংখ্যা নয় — তোমার জন্য কী বদলাবে, সেটাই আসল।
              </p>
              <div className="grid gap-3.5 max-w-170 mx-auto">
                {skill.outcomes.map((o, i) => (
                  <OutcomeCheck key={o} text={o} delay={i * 160} />
                ))}
              </div>
            </div>
          </section>

          {/* CURRICULUM */}
          <section className="bg-white">
            <div className="max-w-225 mx-auto px-6 py-[clamp(44px,6vw,72px)]">
              <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-1.5">কারিকুলাম</h2>
              <p className="text-[15px] text-ink/60 mb-5.5">
                {skill.modules.length}টি মডিউল · {skill.lessons} ·{" "}
                <span className="text-purple font-bold">{freeCount}টি ফ্রি প্রিভিউ</span>
              </p>
              <AccordionList items={skill.modules} />
            </div>
          </section>

          {/* INSTRUCTOR */}
          <section className="bg-lavender">
            <div className="max-w-225 mx-auto px-6 py-[clamp(44px,6vw,72px)]">
              <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-5.5">তোমার শিক্ষক</h2>
              <div className="flex flex-wrap gap-6 bg-white border-2 border-ink rounded-[20px] shadow-[5px_5px_0_0_var(--color-ink)] p-6.5">
                <div className="relative shrink-0 w-40 h-50 rounded-xl bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_10px,#E1E2F3_10px,#E1E2F3_20px)] grid place-items-center">
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 -rotate-3 w-20 h-5.5 bg-gold/70 border border-ink/25" />
                  <span className="font-mono text-[10px] text-ink/45">PHOTO</span>
                </div>
                <div className="flex-1 min-w-65">
                  <div className="font-display font-extrabold text-2xl">{skill.instructor.name}</div>
                  <div className="text-[15px] text-purple font-semibold">{skill.instructor.role}</div>
                  <div className="flex flex-wrap gap-2 my-3">
                    {skill.instructor.badges.map((b) => (
                      <span
                        key={b}
                        className="bg-cloud border-[1.5px] border-ink rounded-full px-3 py-1 text-[13px] font-semibold"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                  <p className="text-[15.5px] text-ink/78">{skill.instructor.quote}</p>
                </div>
              </div>
            </div>
          </section>

          {/* INCLUDED */}
          <section className="bg-white">
            <div className="max-w-225 mx-auto px-6 py-[clamp(40px,5vw,64px)]">
              <h2 className="font-display font-extrabold text-[clamp(22px,2.6vw,30px)] mb-5">কোর্সে যা থাকছে</h2>
              <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  "▶ ৪৮ লেসন",
                  "📄 ডাউনলোডেবল রিসোর্স",
                  "🎤 প্র্যাকটিস সেশন",
                  "🎓 সার্টিফিকেট",
                  "♾️ লাইফটাইম অ্যাক্সেস",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2.5 bg-lavender rounded-xl px-4 py-3.5 font-semibold text-[15px]"
                  >
                    {t}
                  </div>
                ))}
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
                {skill.testimonials.map((t) => (
                  <div
                    key={t.name}
                    className="bg-gold text-ink border-2 border-black rounded-[14px] shadow-[4px_4px_0_0_rgba(0,0,0,0.4)] px-5 py-4.5"
                  >
                    <div className="text-purple text-sm tracking-[2px]">★★★★★</div>
                    <p className="text-[15.5px] my-2">&ldquo;{t.quote}&rdquo;</p>
                    <div className="font-display font-bold text-[14.5px]">{t.name}</div>
                    <div className="text-[12.5px] text-ink/65">{t.meta}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HOW TO BUY */}
          <section className="bg-lavender">
            <div className="max-w-225 mx-auto px-6 py-[clamp(44px,6vw,72px)]">
              <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-6 text-center">
                কীভাবে কিনবে
              </h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                {[
                  { n: "০১", title: "bKash-এ পেমেন্ট", desc: `Send Money ${skill.price} — ০১XXXXXXXXX।` },
                  { n: "০২", title: "TrxID জমা দাও", desc: "ফর্মে TrxID আর নম্বর লিখে দাও।" },
                  { n: "০৩", title: "শুরু করে দাও", desc: "সাথে সাথেই সব লেসন খুলে যাবে।" },
                ].map((s) => (
                  <div key={s.n} className="bg-white border-2 border-ink rounded-2xl shadow-sticker p-5">
                    <div className="font-display font-extrabold text-purple text-[22px]">{s.n}</div>
                    <h3 className="font-display font-bold text-[17px] mt-1.5 mb-1">{s.title}</h3>
                    <p className="text-sm text-ink/65">{s.desc}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6.5">
                <Link
                  href={enrollHref}
                  className="font-display font-bold text-lg px-8.5 py-3.75 bg-ink text-white border-2 border-ink rounded-full shadow-sticker no-underline inline-block transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg"
                >
                  কোর্সটি নাও →
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
                {skill.faqs.map((f) => (
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
        <section className="bg-white">
          <div className="max-w-190 mx-auto px-6 py-[clamp(44px,6vw,72px)] text-center">
            <div className="border-2 border-dashed border-ink/30 rounded-[20px] bg-lavender px-7 py-9">
              <div className="font-display font-extrabold text-2xl mb-2">বিস্তারিত পাঠ্যক্রম শীঘ্রই আসছে</div>
              <p className="text-[15.5px] text-ink/65 max-w-130 mx-auto">
                এই কোর্সের মডিউল, শিক্ষক আর রিভিউ পেজে শীঘ্রই যুক্ত হবে। এখনই ভর্তি হয়ে সবার আগে সিট নিশ্চিত করতে
                পারো — লাইফটাইম অ্যাক্সেস আর সার্টিফিকেট থাকছেই।
              </p>
              <Link
                href={enrollHref}
                className="inline-block mt-5 font-display font-bold text-lg px-8 py-3.5 bg-ink text-white border-2 border-ink rounded-full shadow-sticker no-underline"
              >
                কোর্সটি নাও →
              </Link>
            </div>
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
