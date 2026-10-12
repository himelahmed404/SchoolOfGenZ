"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SupportChat from "@/components/SupportChat";
import Marquee from "@/components/Marquee";
import Hero from "@/components/home/Hero";
import CourseFinder from "@/components/home/CourseFinder";
import Rails from "@/components/home/Rails";
import Journey from "@/components/home/Journey";
import MapSection from "@/components/home/MapSection";
import FreeClassFlip from "@/components/home/FreeClassFlip";

const TICKER = [
  "রাজশাহী থেকে সাব্বির ভর্তি হলো",
  "নতুন ব্যাচ: সিভিল ৩য় সেমিস্টার",
  "Public Speaking ব্যাচ শুরু ১ আগস্ট",
  "IELTS ব্যাচে ৩টি সিট বাকি",
];

const DELIVERABLES = [
  { n: "০১", title: "রেকর্ডেড ক্লাস", desc: "রাত ২টায় হোক বা টিফিনের ফাঁকে, যতবার খুশি দেখো। বুঝতে না পারলে আবার, আবার।" },
  {
    n: "০২",
    title: "সাপ্তাহিক লাইভ ক্লাস",
    tag: "এটা মিস করো না",
    desc: "সরাসরি প্রশ্ন করো, তখনই উত্তর পাও। মিস করলে রেকর্ডিং পাবে।",
  },
  { n: "০৩", title: "অধ্যায়ভিত্তিক নোট", desc: "প্রতিটি অধ্যায়ের পিডিএফ নোট, ডাউনলোড করে রাখো — পরীক্ষার আগে চট করে রিভিশন।" },
  { n: "০৪", title: "মডেল টেস্ট", desc: "বোর্ড প্রশ্নের ধাঁচে, সময় ধরে। পরীক্ষার হলে ঢোকার আগেই অভ্যাস হয়ে যাবে।" },
];

const WEEK = [
  { day: "শনিবার", title: "নতুন অধ্যায় খোলে", desc: "সপ্তাহের রেকর্ডেড ক্লাস আর নোট আনলক হয়।" },
  { day: "সোম ও বুধ · সন্ধ্যা", title: "লাইভ ক্লাস", desc: "সরাসরি প্রশ্ন করো, তখনই উত্তর পাও।" },
  { day: "প্রতি ক্লাসের পর", title: "নোট ও অনুশীলন", desc: "অধ্যায়ের পিডিএফ নোট নামিয়ে রিভিশন দাও।" },
  { day: "শুক্রবার", title: "মডেল টেস্ট", desc: "বোর্ড প্রশ্নের ধাঁচে, সময় ধরে পরীক্ষা।" },
  { day: "রবিবার", title: "লিডারবোর্ড", desc: "কে কেমন করল দেখো, নিজের অগ্রগতি মাপো।" },
];

const INSTRUCTORS = [
  { name: "মোঃ রাকিবুল হাসান", teaches: "গণিত-৪, ডেটা স্ট্রাকচার", credential: "B.Sc. Engg (CSE) · ৬ বছর" },
  { name: "নুসরাত জাহান", teaches: "ডেটাবেজ, ওয়েব ডিজাইন", credential: "B.Sc. Engg (CSE) · সফটওয়্যার ইঞ্জিনিয়ার" },
  { name: "ফারহানা আক্তার", teaches: "Spoken English, IELTS", credential: "IELTS 8.0 · ৫ বছর" },
  { name: "তানভীর আহমেদ", teaches: "Public Speaking", credential: "জাতীয় বিতর্ক চ্যাম্পিয়ন" },
  { name: "ইঞ্জি. সুমন মিয়া", teaches: "সিভিল বিষয়সমূহ", credential: "Diploma + B.Sc · ৮ বছর" },
];

const TESTIMONIALS = [
  { name: "সাব্বির আহমেদ", meta: "রাজশাহী পলিটেকনিক · CST ৪র্থ", quote: "আগে ম্যাথ দেখলেই ভয় লাগত। এখন ক্লাসে বন্ধুরা আমার কাছে বুঝতে আসে।" },
  { name: "মাহমুদা খাতুন", meta: "ঢাকা পলিটেকনিক · সিভিল ৩য়", quote: "লাইভ ক্লাসে সরাসরি প্রশ্ন করা যায় — এটাই সবচেয়ে ভালো লাগে।" },
  { name: "রাফি হোসেন", meta: "Spoken English", quote: "তিন মাস আগে একটা বাক্যও বলতে পারতাম না। গত সপ্তাহে ইন্টারভিউ দিয়ে এসেছি।" },
  { name: "তানিয়া সুলতানা", meta: "IELTS · ঢাকা", quote: "Band 7 পেয়েছি! বাংলায় বুঝিয়ে দেওয়ায় Speaking-এর ভয় কেটে গেছে।" },
];

const FAQS = [
  { q: "ক্লাস মিস করলে কী হবে?", a: "প্রতিটা লাইভ ক্লাসের রেকর্ডিং তোমার ড্যাশবোর্ডে থাকে — মিস করলেও পরে যতবার খুশি দেখতে পারবে।" },
  { q: "পেমেন্ট কীভাবে করব?", a: "bKash বা Nagad-এ পেমেন্ট করে TrxID জমা দিলেই হবে। ২৪ ঘণ্টার মধ্যে কনফার্মেশন SMS পাবে।" },
  { q: "অ্যাক্সেস কতদিন থাকবে?", a: "একাডেমিক ব্যাচে সেমিস্টার জুড়ে; স্কিল কোর্সে লাইফটাইম অ্যাক্সেস — একবার নিলেই যতদিন খুশি।" },
  { q: "মোবাইল দিয়ে ক্লাস করা যাবে?", a: "হ্যাঁ। মোবাইল, ট্যাব বা কম্পিউটার — যেকোনোটা দিয়েই সব ক্লাস, নোট আর টেস্ট করা যায়।" },
  { q: "সার্টিফিকেট কি পাব?", a: "তিনটি স্কিল কোর্সেই কোর্স শেষে সার্টিফিকেট পাবে। একাডেমিক ব্যাচের ক্ষেত্রে ব্যাচ-ভিত্তিক নিয়ম প্রযোজ্য।" },
];

export default function HomeClient({ batches, skills }) {
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

      <SiteNav active="home" />

      <Hero />

      {/* TICKER */}
      <div className="bg-ink text-white overflow-hidden whitespace-nowrap border-t-2 border-ink">
        <Marquee
          items={TICKER}
          durationSec={34}
          className="py-2.75"
          renderItem={(t, i) => (
            <span key={i} className="inline-flex items-center gap-2.5 px-7.5 font-semibold text-[14.5px]">
              <span className="text-gold">◆</span>
              {t}
            </span>
          )}
        />
      </div>

      {/* TWO DOORS */}
      <section className="max-w-320 mx-auto px-6 py-[clamp(56px,7vw,90px)]">
        <div className="text-center mb-8.5">
          <h2 className="font-display font-extrabold text-[clamp(26px,3.4vw,38px)]">তোমার দরজাটা বেছে নাও</h2>
          <p className="text-ink/60 text-[17px] mt-2">দুইটা ট্র্যাক, এক প্ল্যাটফর্ম — যেটা তোমার, সেটায় ঢোকো।</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 min-h-85 items-stretch">
          <Link
            href="/academic"
            className="flex-1 relative overflow-hidden border-2 border-ink rounded-[22px] shadow-sticker bg-gradient-to-br from-[#6a3df0] to-purple-deep text-white p-8.5 no-underline transition-[flex-grow,transform] duration-[450ms] hover:flex-[1.7] hover:-translate-y-1 bg-cta-stripes"
          >
            <div className="relative h-full flex flex-col">
              <span className="text-[34px]">📘</span>
              <h3 className="font-display font-extrabold text-[clamp(24px,2.6vw,32px)] mt-3.5">একাডেমিক — ডিপ্লোমা</h3>
              <p className="text-[16.5px] opacity-90 mt-2.5 max-w-90">
                সেমিস্টার ব্যাচ, সব ডিপার্টমেন্ট। বোর্ড সিলেবাস ধরে ধরে — লাইভ ক্লাস, নোট আর মডেল টেস্ট।
              </p>
              <span className="mt-auto self-start inline-flex items-center gap-2 font-display font-bold text-lg bg-white text-ink px-5 py-2.75 rounded-full border-2 border-ink shadow-[3px_3px_0_0_rgba(0,0,0,0.25)]">
                ব্যাচ দেখো →
              </span>
            </div>
          </Link>
          <Link
            href="/skills"
            className="flex-1 relative overflow-hidden border-2 border-ink rounded-[22px] shadow-sticker bg-gradient-to-br from-[#FFD866] to-[#FFB300] text-ink p-8.5 no-underline transition-[flex-grow,transform] duration-[450ms] hover:flex-[1.7] hover:-translate-y-1"
          >
            <div className="relative h-full flex flex-col">
              <span className="text-[34px]">🚀</span>
              <h3 className="font-display font-extrabold text-[clamp(24px,2.6vw,32px)] mt-3.5">স্কিল কোর্স</h3>
              <p className="text-[16.5px] opacity-82 mt-2.5 max-w-90">
                Spoken English · Public Speaking · IELTS। লাইফটাইম অ্যাক্সেস আর সার্টিফিকেট — আউটকাম-ভিত্তিক।
              </p>
              <span className="mt-auto self-start inline-flex items-center gap-2 font-display font-bold text-lg bg-ink text-white px-5 py-2.75 rounded-full border-2 border-ink shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]">
                কোর্স দেখো →
              </span>
            </div>
          </Link>
        </div>
      </section>

      <CourseFinder batches={batches} skills={skills} />

      <Rails batches={batches} skills={skills} />

      {/* DELIVERABLES */}
      <section className="bg-white">
        <div className="max-w-230 mx-auto px-6 py-[clamp(56px,7vw,90px)]">
          <h2 className="font-display font-extrabold text-[clamp(26px,3.4vw,38px)] mb-1.5">তুমি কী কী পাচ্ছো</h2>
          <p className="text-ink/60 text-[17px] mb-7.5">প্রতিটা জিনিস আসলে কী কাজে লাগে — খোলাখুলি।</p>
          <div
            className="relative bg-white border border-cloud rounded-2xl shadow-soft px-6.5 sm:px-10 py-9 pl-16 sm:pl-22.5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(#fff 0 33px,rgba(34,27,94,.07) 33px 34px),linear-gradient(90deg,transparent 62px,rgba(238,90,90,.4) 62px,rgba(238,90,90,.4) 64px,transparent 64px)",
            }}
          >
            <div className="grid gap-6.5">
              {DELIVERABLES.map((d) => (
                <div key={d.n} className="relative">
                  <span className="absolute -left-16 sm:-left-16 top-0.5 font-display font-extrabold text-purple text-[22px]">
                    {d.n}
                  </span>
                  <h3 className="font-display font-bold text-xl">
                    {d.title}{" "}
                    {d.tag && (
                      <span className="font-body font-bold text-[13px] bg-gold text-ink px-2.25 py-0.5 rounded-full -rotate-3 inline-block ml-1">
                        {d.tag}
                      </span>
                    )}
                  </h3>
                  <p className="text-[16.5px] text-ink/80 mt-1.25 max-w-160">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENTO — কেন School of GenZ */}
      <section className="bg-lavender">
        <div className="max-w-230 mx-auto px-6 py-[clamp(56px,7vw,90px)]">
          <h2 className="font-display font-extrabold text-[clamp(26px,3.4vw,38px)] mb-6.5 text-center">
            কেন School of GenZ
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[150px] gap-4">
            <div className="col-span-2 row-span-2 bg-ink text-white border-2 border-ink rounded-[20px] shadow-[5px_5px_0_0_rgba(34,27,94,0.35)] p-6.5 flex flex-col justify-between overflow-hidden relative">
              <div className="self-start bg-white/12 border border-dashed border-white/40 rounded-xl px-5.5 py-4 text-center">
                <div className="font-mono text-[10px] opacity-60">MASCOT</div>
                <div className="text-5xl leading-none">🐧</div>
              </div>
              <div>
                <h3 className="font-display font-extrabold text-2xl">বাংলায়, ধাপে ধাপে</h3>
                <p className="opacity-82 text-[15.5px] mt-2">কঠিন জিনিস সহজ ভাষায়। যেভাবে বন্ধু বোঝায়, সেভাবে।</p>
              </div>
            </div>
            <div className="col-span-2 bg-white border-2 border-ink rounded-[20px] shadow-sticker p-5.5 transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg">
              <div className="text-2xl">📖</div>
              <h3 className="font-display font-bold text-lg mt-2 mb-0.75">বোর্ড সিলেবাস ধরে</h3>
              <p className="text-sm text-ink/65">যা পরীক্ষায় আসে, ঠিক তাই — বাড়তি নয়, কমও নয়।</p>
            </div>
            <div className="bg-gold text-ink border-2 border-ink rounded-[20px] shadow-sticker p-5 flex flex-col justify-center">
              <div className="text-2xl">🎓</div>
              <h3 className="font-display font-extrabold text-[17px] mt-1.5">সার্টিফিকেট</h3>
            </div>
            <div className="bg-white border-2 border-ink rounded-[20px] shadow-sticker p-5 flex flex-col justify-center transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg">
              <div className="text-2xl text-purple animate-sog-spin w-6.5">✦</div>
              <h3 className="font-display font-bold text-base mt-1.5">প্র্যাকটিস সেশন</h3>
            </div>
            <div className="col-span-2 bg-white border-2 border-ink rounded-[20px] shadow-sticker p-5.5 flex items-center gap-4.5 transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg">
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg mb-0.75">প্রগ্রেস ট্র্যাকিং</h3>
                <p className="text-sm text-ink/65">কতদূর এলে, কী বাকি — সবসময় চোখের সামনে।</p>
              </div>
              <div className="flex-none w-22.5">
                <div className="h-2.25 bg-cloud border-[1.5px] border-ink rounded-full overflow-hidden">
                  <div className="h-full w-[68%] bg-gold" />
                </div>
                <div className="font-display font-extrabold text-[13px] mt-1.25 text-right">৬৮%</div>
              </div>
            </div>
            <div className="col-span-2 bg-purple text-white border-2 border-ink rounded-[20px] shadow-sticker p-5.5 flex flex-col justify-center">
              <div className="text-2xl">♾️</div>
              <h3 className="font-display font-extrabold text-lg mt-1.5 mb-0.75">স্কিল কোর্সে লাইফটাইম অ্যাক্সেস</h3>
              <p className="opacity-85 text-sm">একবার নাও, যতদিন খুশি ফিরে এসো।</p>
            </div>
          </div>
        </div>
      </section>

      {/* WEEK IN THE LIFE */}
      <section id="howweek" className="bg-white">
        <div className="max-w-225 mx-auto px-6 py-[clamp(56px,7vw,90px)]">
          <div className="text-center mb-8.5">
            <h2 className="font-display font-extrabold text-[clamp(26px,3.4vw,38px)]">ভর্তির পর কেমন চলে</h2>
            <p className="text-ink/60 text-[17px] mt-2">একটা সাধারণ সপ্তাহ — শনি থেকে রবি।</p>
          </div>
          <div className="relative pl-10">
            <div
              className="absolute left-3.25 top-2 bottom-2 w-0.5"
              style={{ backgroundImage: "repeating-linear-gradient(var(--color-periwinkle) 0 8px,transparent 8px 14px)" }}
            />
            <div className="grid gap-5">
              {WEEK.map((d) => (
                <div key={d.day} className="relative bg-white border border-cloud rounded-[14px] shadow-soft px-5 py-4">
                  <span className="absolute -left-8.5 top-4.5 w-4 h-4 rounded-full bg-gold border-2 border-ink" />
                  <div className="font-display font-extrabold text-[14px] text-purple">{d.day}</div>
                  <div className="font-display font-bold text-lg mt-0.25">{d.title}</div>
                  <div className="text-[15px] text-ink/70 mt-0.5">{d.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Journey />

      {/* MAP + ORIGIN */}
      <section className="bg-lavender">
        <div className="max-w-[1200px] mx-auto px-6 py-[clamp(56px,7vw,90px)] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-11 items-center">
          <MapSection />
          <div
            className="relative bg-white border border-cloud rounded-2xl shadow-soft px-6.5 sm:px-8 py-7.5"
            style={{ backgroundImage: "repeating-linear-gradient(#fff 0 33px,rgba(34,27,94,.06) 33px 34px)" }}
          >
            <span className="inline-block bg-gold text-ink font-bold text-[13px] px-3 py-1 rounded-full -rotate-2">
              আমাদের গল্প
            </span>
            <h3 className="font-display font-extrabold text-2xl mt-3.5">কেন শুরু করলাম</h3>
            <p className="text-[16.5px] text-ink/82 mt-3">
              আমরা নিজেরাও ডিপ্লোমা করেছি। তাই জানি সেমিস্টার ফাইনালের আগের রাতটা কেমন যায় — হাতে গাইড বই, ইউটিউবে
              এলোমেলো ভিডিও, আর মাথায় ভয়…
            </p>
            <p className="text-[16.5px] text-ink/82 mt-3">সেই রাতটা আর কাউকে একা কাটাতে হবে না — এটুকুই আমাদের কাজ।</p>
            <Link href="/" className="inline-flex items-center gap-1.5 mt-4 font-display font-bold text-base no-underline">
              পুরো গল্পটা পড়ো →
            </Link>
          </div>
        </div>
      </section>

      {/* FOR WHOM / NOT */}
      <section className="bg-white">
        <div className="max-w-200 mx-auto px-6 py-[clamp(56px,7vw,90px)]">
          <h2 className="font-display font-extrabold text-[clamp(26px,3.4vw,38px)] mb-1.5 text-center">
            এটা কার জন্য — আর কার জন্য নয়
          </h2>
          <p className="text-ink/60 text-[17px] mb-7.5 text-center">সৎ থাকি, তাতে দুজনেরই ভালো।</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-success/6 border-2 border-success rounded-2xl px-6.5 py-6.5">
              <div className="font-display font-extrabold text-xl text-success mb-3.5">✓ এটা তোমার জন্য, যদি —</div>
              <div className="grid gap-3">
                {["নিয়মিত ক্লাস করে সত্যিই শিখতে চাও", "বাংলায় বুঝে বুঝে এগোতে চাও", "প্রশ্ন করতে, প্র্যাকটিস করতে রাজি আছো"].map(
                  (t) => (
                    <div key={t} className="flex gap-2.5 text-base">
                      <span className="text-success font-extrabold">✓</span>
                      <span>{t}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="bg-cloud border-2 border-ink/25 rounded-2xl px-6.5 py-6.5">
              <div className="font-display font-extrabold text-xl text-ink/60 mb-3.5">✗ এটা তোমার জন্য নয়, যদি —</div>
              <div className="grid gap-3">
                {[
                  "চাও শুধু পরীক্ষার আগের রাতে সাজেশন মুখস্থ করবে",
                  "ক্লাস না করেই সার্টিফিকেট চাও",
                  "এক রাতে সব শিখে ফেলার শর্টকাট খুঁজছো",
                ].map((t) => (
                  <div key={t} className="flex gap-2.5 text-base text-ink/70">
                    <span className="font-extrabold">✗</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEACHERS */}
      <section id="teachers" className="bg-lavender">
        <div className="max-w-[1200px] mx-auto px-6 py-[clamp(56px,7vw,90px)]">
          <div className="text-center mb-7.5">
            <h2 className="font-display font-extrabold text-[clamp(26px,3.4vw,38px)]">যাঁরা পড়ান</h2>
            <p className="text-ink/60 text-[17px] mt-2">যাঁদের কাছে শিখবে, তাঁদের চিনে নাও।</p>
          </div>
          <div className="flex flex-wrap gap-4.5 justify-center">
            {INSTRUCTORS.map((t) => (
              <div
                key={t.name}
                className="flex-none w-52.5 bg-white border-2 border-ink rounded-2xl shadow-sticker p-4 transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-1 hover:-rotate-1 hover:shadow-[7px_7px_0_0_var(--color-ink)]"
              >
                <div className="relative h-37.5 rounded-[10px] bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_9px,#E1E2F3_9px,#E1E2F3_18px)] grid place-items-center">
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 -rotate-3 w-19 h-5.5 bg-gold/70 border border-ink/25" />
                  <span className="font-mono text-[10px] text-ink/45">PHOTO</span>
                </div>
                <div className="font-display font-extrabold text-[17px] mt-3">{t.name}</div>
                <div className="text-[13.5px] text-purple font-semibold">{t.teaches}</div>
                <div className="text-[13px] text-ink/60 mt-0.75">{t.credential}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="success" className="bg-ink text-white py-[clamp(56px,7vw,90px)] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 pb-7.5 text-center">
          <span className="text-gold font-bold">✦ সফলতার গল্প ✦</span>
          <h2 className="font-display font-extrabold text-[clamp(26px,3.4vw,38px)] mt-2">শিক্ষার্থীরা যা বলে</h2>
        </div>
        <div className="grid gap-4.5">
          <Marquee
            items={TESTIMONIALS}
            durationSec={46}
            className="gap-4.5"
            renderItem={(t, i) => (
              <div
                key={i}
                className="flex-none w-85 bg-white text-ink border-2 border-black rounded-[14px] shadow-[4px_4px_0_0_rgba(0,0,0,0.4)] px-5 py-4.5 -rotate-[1.2deg] mx-1"
              >
                <div className="text-gold text-sm tracking-[2px]">★★★★★</div>
                <p className="text-[15.5px] my-2">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <span className="w-9.5 h-9.5 rounded-full bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_6px,#E1E2F3_6px,#E1E2F3_12px)] border-[1.5px] border-ink shrink-0" />
                  <div>
                    <div className="font-display font-bold text-[14.5px]">{t.name}</div>
                    <div className="text-[12.5px] text-ink/60">{t.meta}</div>
                  </div>
                </div>
              </div>
            )}
          />
          <Marquee
            items={TESTIMONIALS.slice().reverse()}
            durationSec={52}
            direction="right"
            className="gap-4.5"
            renderItem={(t, i) => (
              <div
                key={i}
                className="flex-none w-85 bg-gold text-ink border-2 border-black rounded-[14px] shadow-[4px_4px_0_0_rgba(0,0,0,0.4)] px-5 py-4.5 rotate-[1.2deg] mx-1"
              >
                <div className="text-purple text-sm tracking-[2px]">★★★★★</div>
                <p className="text-[15.5px] my-2">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <span className="w-9.5 h-9.5 rounded-full bg-[repeating-linear-gradient(45deg,#fff5db,#fff5db_6px,#f3e2ad_6px,#f3e2ad_12px)] border-[1.5px] border-ink shrink-0" />
                  <div>
                    <div className="font-display font-bold text-[14.5px]">{t.name}</div>
                    <div className="text-[12.5px] text-ink/60">{t.meta}</div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
        <div className="text-center mt-6.5 text-[13px] text-white/50">
          ⚠️ ডেমো টেস্টিমোনিয়াল — লঞ্চের আগে আসল শিক্ষার্থীদের দিয়ে বদলাতে হবে।
        </div>
      </section>

      {/* FREE CLASS */}
      <section id="freeclass" className="bg-white">
        <div className="max-w-225 mx-auto px-6 py-[clamp(56px,7vw,90px)] text-center">
          <h2 className="font-display font-extrabold text-[clamp(26px,3.4vw,38px)] mb-1.5">খাতা খুলো — একটা ক্লাস ফ্রি</h2>
          <p className="text-ink/60 text-[17px] mb-7.5">কেনার আগে নিজে দেখে নাও কেমন পড়াই।</p>
          <FreeClassFlip />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-lavender">
        <div className="max-w-195 mx-auto px-6 py-[clamp(56px,7vw,90px)]">
          <h2 className="font-display font-extrabold text-[clamp(26px,3.4vw,38px)] mb-6.5 text-center">প্রশ্ন-উত্তর</h2>
          <div className="grid gap-3">
            {FAQS.map((f, i) => (
              <details
                key={f.q}
                className="[&>summary::-webkit-details-marker]:hidden bg-white border-2 border-ink rounded-[14px] shadow-[3px_3px_0_0_var(--color-ink)] p-0.5"
                style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.4}deg)` }}
              >
                <summary className="cursor-pointer list-none font-display font-bold text-[17px] px-4.5 py-3.75 flex justify-between gap-3">
                  {f.q}
                  <span className="text-purple">+</span>
                </summary>
                <div className="px-4.5 pb-4 text-[15.5px] text-ink/78">{f.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link href="/how" className="font-display font-bold text-base no-underline">
              সব প্রশ্ন দেখো →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative bg-periwinkle overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(rgba(255,255,255,0)_0_37px,rgba(255,255,255,.35)_37px_38px)]" />
        <div className="relative max-w-205 mx-auto px-6 py-[clamp(60px,8vw,110px)] text-center">
          <div className="text-4xl">🐧🎉</div>
          <h2 className="font-display font-extrabold text-[clamp(30px,4.4vw,52px)] leading-[1.14] mt-3.5">
            তোমার শেখা শুরু হোক <span className="bg-gold px-2 rounded">আজই</span>।
          </h2>
          <p className="text-lg text-ink/78 mt-4">দুই মিনিটে বেছে নাও, বাকিটা আমরা সহজ করে দিচ্ছি।</p>
          <div className="flex flex-wrap gap-3.5 justify-center mt-7">
            <a
              href="#finder"
              className="font-display font-bold text-lg px-8 py-3.75 bg-purple text-white border-2 border-ink rounded-full shadow-sticker no-underline transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg"
            >
              কোর্স দেখো
            </a>
            <Link
              href="/contact"
              className="font-display font-bold text-lg px-7.5 py-3.75 bg-white text-ink border-2 border-ink rounded-full shadow-sticker no-underline transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg"
            >
              কথা বলো
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      <div className="fixed right-5.5 bottom-5.5 z-[130]">
        <SupportChat />
      </div>
    </div>
  );
}
