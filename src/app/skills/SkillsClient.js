"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SupportChat from "@/components/SupportChat";

const WHY = [
  { icon: "♾️", title: "লাইফটাইম অ্যাক্সেস", desc: "একবার নাও, যতদিন খুশি ফিরে এসো।" },
  { icon: "🎓", title: "সার্টিফিকেট", desc: "কোর্স শেষে যাচাইযোগ্য সার্টিফিকেট।" },
  { icon: "🎤", title: "প্র্যাকটিস সেশন", desc: "শুধু শোনা নয় — বলে, করে শেখা।" },
  { icon: "🗣️", title: "বাংলায় ব্যাখ্যা", desc: "কঠিন জিনিস নিজের ভাষায়, সহজ করে।" },
];

const OUTCOMES = [
  {
    icon: "💬",
    title: "যে কারো সাথে ইংরেজিতে কথা",
    desc: "পরিচিত হোক বা অপরিচিত — শুরু করতে আর ভয় লাগবে না।",
  },
  {
    icon: "🎤",
    title: "স্টেজে আত্মবিশ্বাসে দাঁড়ানো",
    desc: "প্রেজেন্টেশন হোক বা ইন্টারভিউ — হাত-পা আর কাঁপবে না।",
  },
  { icon: "📈", title: "IELTS-এ ভালো ব্যান্ড", desc: "চার মডিউলেই স্ট্র্যাটেজি — টার্গেট স্কোরের দিকে।" },
];

function SkillCard({ c, index }) {
  return (
    <Link
      href={`/skills/${c.slug}`}
      style={{ animationDelay: `${index * 70}ms` }}
      className="animate-sog-up block bg-white border-2 border-ink rounded-2xl shadow-sticker overflow-hidden no-underline text-ink transition-transform duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:rotate-[0.5deg] hover:shadow-[8px_8px_0_0_var(--color-ink)]"
    >
      <div className="h-37.5 relative grid place-items-center bg-[repeating-linear-gradient(45deg,#FFF3D4,#FFF3D4_10px,#FCE9B5_10px,#FCE9B5_20px)]">
        <span className="absolute top-3 left-3 bg-gold text-ink font-bold text-xs px-2.5 py-1 rounded-full border-[1.5px] border-ink">
          {c.level}
        </span>
        <span className="font-mono text-[11px] text-ink/45">COVER</span>
      </div>
      <div className="px-4.5 pt-4.25 pb-4.75">
        <div className="font-display font-extrabold text-lg leading-tight">{c.title}</div>
        <div className="text-sm text-ink/62 mt-1.5">{c.pitch}</div>
        <div className="text-[13px] text-ink/55 mt-2">
          {c.lessons} · {c.dur}
        </div>
        <div className="text-[12.5px] text-success font-bold mt-1">♾️ লাইফটাইম{c.certificate ? " · 🎓 সার্টিফিকেট" : ""}</div>
        <div className="flex items-baseline gap-2.25 mt-3">
          <span className="font-display font-extrabold text-[23px]">{c.price}</span>
          <span className="line-through text-ink/40 text-sm">{c.old}</span>
        </div>
        <span className="block text-center mt-3.5 font-display font-bold text-[15.5px] py-2.75 bg-ink text-white border-2 border-ink rounded-full shadow-sticker-sm">
          কোর্সটি দেখো →
        </span>
      </div>
    </Link>
  );
}

export default function SkillsClient({ skills, faqs }) {
  const progressRef = useRef(null);

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

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 h-1 bg-cloud z-[120] border-b border-ink/12">
        <div ref={progressRef} className="h-full w-0 bg-gold" />
      </div>

      <SiteNav active="skills" />

      <header className="bg-lavender border-b border-ink/8">
        <div className="max-w-[1100px] mx-auto px-6 py-[clamp(44px,6vw,72px)]">
          <span className="inline-flex items-center gap-1.75 bg-gold text-ink border-2 border-ink rounded-full px-3.75 py-1.75 font-bold text-sm shadow-sticker-sm">
            🚀 স্কিল কোর্স
          </span>
          <h1 className="font-display font-extrabold text-[clamp(32px,4.6vw,52px)] leading-[1.14] mt-4.5">
            যে স্কিল <span className="bg-gold px-2 rounded">ক্যারিয়ার</span> বদলায়
          </h1>
          <p className="text-[clamp(16px,1.5vw,19px)] text-ink/72 mt-3 max-w-140">
            ইংরেজি বলা, উপস্থাপনা আর IELTS — ধাপে ধাপে, বাংলায়। প্রতিটাতে লাইফটাইম অ্যাক্সেস আর সার্টিফিকেট।
          </p>
        </div>
      </header>

      {/* CATEGORY CHIPS */}
      <div className="max-w-[1100px] mx-auto px-6 pt-6.5 pb-1.5 flex flex-wrap gap-2.5 items-center">
        <span className="font-display font-bold text-[15px] px-4.5 py-2.25 rounded-full border-2 border-ink bg-gold text-ink shadow-sticker-sm">
          ভাষা ও যোগাযোগ
        </span>
        <span className="font-semibold text-[15px] px-4.5 py-2.25 rounded-full border-2 border-dashed border-ink/30 bg-cloud text-ink/45 cursor-not-allowed">
          টেক <span className="text-xs">· শীঘ্রই</span>
        </span>
        <span className="font-semibold text-[15px] px-4.5 py-2.25 rounded-full border-2 border-dashed border-ink/30 bg-cloud text-ink/45 cursor-not-allowed">
          ক্রিয়েটিভ <span className="text-xs">· শীঘ্রই</span>
        </span>
        <span className="text-[13.5px] text-ink/50 italic ml-1">— নতুন ক্যাটাগরি আসছে</span>
      </div>

      {/* COURSE GRID */}
      <section className="max-w-[1100px] mx-auto px-6 pt-5.5 pb-17.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((c, i) => (
            <SkillCard key={c.slug} c={c} index={i} />
          ))}
        </div>
      </section>

      {/* WHY THESE */}
      <section className="bg-lavender">
        <div className="max-w-[1100px] mx-auto px-6 py-[clamp(48px,6vw,76px)]">
          <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-6 text-center">
            কেন এই কোর্সগুলো
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.title} className="bg-white border-2 border-ink rounded-2xl shadow-sticker p-5.5">
                <div className="text-2xl">{w.icon}</div>
                <h3 className="font-display font-bold text-[17px] mt-2 mb-0.75">{w.title}</h3>
                <p className="text-sm text-ink/65">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOME BAND */}
      <section className="bg-ink text-white">
        <div className="max-w-[1000px] mx-auto px-6 py-[clamp(48px,6vw,76px)] text-center">
          <span className="text-gold font-bold">✦ আউটকাম ✦</span>
          <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mt-2 mb-6.5">
            কোর্স শেষে তুমি পারবে…
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 text-left">
            {OUTCOMES.map((o) => (
              <div key={o.title} className="bg-white/6 border border-white/15 rounded-2xl p-5.5">
                <div className="text-2xl">{o.icon}</div>
                <h3 className="font-display font-bold text-[18px] mt-2 mb-1">{o.title}</h3>
                <p className="text-[14.5px] text-white/72">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-white">
          <div className="max-w-190 mx-auto px-6 py-[clamp(48px,6vw,76px)]">
            <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)] mb-6 text-center">
              স্কিল কোর্স · প্রশ্ন-উত্তর
            </h2>
            <div className="grid gap-3">
              {faqs.map((f) => (
                <div key={f.q} className="bg-white border-2 border-ink rounded-[14px] shadow-[3px_3px_0_0_var(--color-ink)] px-4.5 py-4">
                  <div className="font-display font-bold text-[17px]">{f.q}</div>
                  <div className="text-[15px] text-ink/75 mt-1.5">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA BAND */}
      <section className="bg-periwinkle relative overflow-hidden bg-cta-stripes">
        <div className="relative max-w-190 mx-auto px-6 py-[clamp(48px,7vw,88px)] text-center">
          <h2 className="font-display font-extrabold text-[clamp(26px,3.6vw,42px)]">
            একটা স্কিল বেছে নাও — আজই শুরু
          </h2>
          <p className="text-[17px] text-ink/78 mt-3 mb-6">
            লাইফটাইম অ্যাক্সেস মানে কোনো তাড়া নেই। নিজের গতিতে এগোও।
          </p>
          {skills[0] && (
            <Link
              href={`/skills/${skills[0].slug}`}
              className="font-display font-bold text-lg px-8 py-3.75 bg-ink text-white border-2 border-ink rounded-full shadow-sticker no-underline inline-block transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg"
            >
              {skills[0].title} দেখো
            </Link>
          )}
        </div>
      </section>

      <SiteFooter />

      <div className="fixed right-5.5 bottom-5.5 z-[130]">
        <SupportChat />
      </div>
    </div>
  );
}
