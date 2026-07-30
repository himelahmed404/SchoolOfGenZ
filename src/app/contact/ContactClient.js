"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SupportChat from "@/components/SupportChat";
import useOfflineHours from "@/hooks/useOfflineHours";
import { toBn } from "@/lib/bn";

const SUBJECTS = [
  "ভর্তি ও পেমেন্ট",
  "একাডেমিক ডিপ্লোমা ব্যাচ",
  "স্কিল কোর্স",
  "ক্লাস ও অ্যাক্সেস",
  "টেকনিক্যাল সমস্যা",
  "রিফান্ড ও রিপ্লেসমেন্ট",
  "অভিভাবকের প্রশ্ন",
  "শিক্ষক হতে চাই",
  "অন্য কিছু",
];

const CHANNELS = [
  {
    icon: "💬",
    iconBg: "bg-[#0084ff]/12 border-[#0084ff]/40",
    title: "Messenger",
    desc: "সবচেয়ে দ্রুত। ছবি বা স্ক্রিনশট পাঠাতে পারবেন।",
    eta: "⏱ সাধারণত ১০ মিনিটে উত্তর",
    href: "https://m.me/schoolofgenz",
    rotate: "-rotate-1",
  },
  {
    icon: "📞",
    iconBg: "bg-[#25D366]/14 border-[#25D366]/45",
    title: "WhatsApp / ফোন",
    desc: "০১৮১২-৩৪৫৬৭৮ — কল বা মেসেজ, দুটোই চলে।",
    eta: "⏱ হেল্পলাইনের সময়ে সাথে সাথে",
    href: "https://wa.me/8801812345678",
    rotate: "rotate-[0.6deg]",
  },
  {
    icon: "✉️",
    iconBg: "bg-gold/22 border-gold/60",
    title: "ইমেইল",
    desc: "hello@schoolofgenz.com — বিস্তারিত বা কাগজপত্রের জন্য।",
    eta: "⏱ ১ কর্মদিবসের মধ্যে",
    href: "mailto:hello@schoolofgenz.com",
    rotate: "-rotate-[0.5deg]",
  },
];

function ChannelCard({ c }) {
  return (
    <a
      href={c.href}
      target={c.href.startsWith("mailto:") ? undefined : "_blank"}
      rel={c.href.startsWith("mailto:") ? undefined : "noopener"}
      className={
        `block bg-white border-2 border-ink rounded-[18px] shadow-[5px_5px_0_0_var(--color-ink)] p-6 no-underline text-ink transition-transform duration-150 hover:rotate-0 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_var(--color-ink)] ` +
        c.rotate
      }
    >
      <span
        className={`grid place-items-center w-12 h-12 rounded-[14px] border-[1.5px] text-[22px] ${c.iconBg}`}
      >
        {c.icon}
      </span>
      <div className="font-display font-extrabold text-[21px] mt-3.5 mb-1">{c.title}</div>
      <div className="text-[15px] text-ink/65">{c.desc}</div>
      <div className="mt-3.5 inline-flex items-center gap-1.75 text-[13.5px] font-semibold bg-cloud rounded-full px-3 py-1.25">
        {c.eta}
      </div>
    </a>
  );
}

export default function ContactClient() {
  const offline = useOfflineHours();
  const progressRef = useRef(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sentName, setSentName] = useState("");
  const [sentSubject, setSentSubject] = useState("");
  const [ticket, setTicket] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = () => {
    if (name.trim().length < 2) return setError("আপনার নামটা লিখুন।");
    if (!/^[০-৯0-9\s\-+]{9,}$/.test(phone.trim()))
      return setError("সঠিক ফোন নম্বর দিন — আমরা এখানেই ফিরে আসব।");
    if (message.trim().length < 8)
      return setError("বার্তাটা একটু বিস্তারিত লিখুন, তাহলে সঠিক উত্তর দিতে পারব।");
    setError("");
    setSentName(name.trim());
    setSentSubject(subject);
    setTicket("SG-" + toBn(String(Math.floor(1000 + Math.random() * 9000))));
    setSent(true);
  };

  const reset = () => {
    setSent(false);
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setSubject(SUBJECTS[0]);
    setError("");
  };

  const replyPromise = offline
    ? "হেল্পলাইন এখন বন্ধ, তাই সকাল ১০টার পরেই ফিরছি।"
    : "সাধারণত ১ কর্মদিবসের মধ্যে উত্তর যায়, ফোনে হলে আরও আগে।";

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 h-1 bg-cloud z-[120] border-b border-ink/12">
        <div ref={progressRef} className="h-full w-0 bg-gold" />
      </div>

      <SiteNav active="contact" />

      {/* HERO */}
      <header className="bg-lavender border-b border-ink/8">
        <div className="max-w-[1160px] mx-auto px-6 pt-13 pb-11">
          <div className="text-[13.5px] text-ink/55 mb-3.5">
            <Link href="/" className="text-ink/55 no-underline">
              হোম
            </Link>{" "}
            · যোগাযোগ
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-155">
              <span className="inline-block bg-gold border-2 border-ink rounded-full px-3.5 py-1 font-display font-bold text-[13px] shadow-sticker-sm">
                আমরা সত্যিই উত্তর দিই
              </span>
              <h1 className="font-display font-extrabold text-[clamp(34px,5vw,52px)] leading-[1.1] mt-4 mb-2.5 tracking-[-0.5px]">
                যোগাযোগ
              </h1>
              <p className="text-[17.5px] text-ink/70">
                ভর্তি, পেমেন্ট, ক্লাস বা টেকনিক্যাল — যেকোনো প্রশ্নে সরাসরি মানুষ পাবেন। বট নয়, স্ক্রিপ্ট নয়।
              </p>
            </div>
            <div className="bg-white border-2 border-ink rounded-2xl shadow-sticker px-5 py-4 min-w-65">
              <div className="flex items-center gap-2 text-[13.5px] text-ink/60">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: offline ? "#FFC226" : "#1FA36B" }}
                />
                {offline ? "এখন বন্ধ · সকাল ১০টায় খুলছে" : "এখন খোলা আছে"}
              </div>
              <div className="font-display font-extrabold text-[26px] mt-1 tracking-[-0.3px]">
                ০১৭১১-১২৩৪৫৬
              </div>
              <div className="text-sm text-ink/65">হেল্পলাইন · প্রতিদিন সকাল ১০টা – রাত ১০টা</div>
            </div>
          </div>
        </div>
      </header>

      {/* CHANNELS */}
      <section className="max-w-[1160px] mx-auto px-6 pt-13 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5.5">
          {CHANNELS.map((c) => (
            <ChannelCard key={c.title} c={c} />
          ))}
        </div>
      </section>

      {/* FORM + OFFICE */}
      <section className="max-w-[1160px] mx-auto px-6 pt-11 pb-5 grid grid-cols-1 lg:grid-cols-[1.12fr_1fr] gap-8.5 items-start">
        <div className="bg-white border-2 border-ink rounded-[20px] shadow-[6px_6px_0_0_var(--color-ink)] p-7.5">
          {!sent ? (
            <div>
              <h2 className="font-display font-extrabold text-[28px] mb-1">বার্তা পাঠান</h2>
              <p className="text-[15px] text-ink/65 mb-5.5">
                লিখে রাখুন, আমরা ফোনে বা ইমেইলে ফিরে আসব।
              </p>

              <label className="block font-semibold text-[14.5px] mb-1.5">
                আপনার নাম <span className="text-red">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="যেমন — সাদিয়া ইসলাম"
                className="w-full px-3.5 py-3 border-2 border-ink/20 rounded-xl font-body text-[15px] text-ink outline-none mb-4 focus:border-purple"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-[14.5px] mb-1.5">
                    ফোন নম্বর <span className="text-red">*</span>
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError("");
                    }}
                    placeholder="০১৭…"
                    className="w-full px-3.5 py-3 border-2 border-ink/20 rounded-xl font-body text-[15px] text-ink outline-none mb-4 focus:border-purple"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[14.5px] mb-1.5">
                    ইমেইল <span className="text-ink/45 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@mail.com"
                    className="w-full px-3.5 py-3 border-2 border-ink/20 rounded-xl font-body text-[15px] text-ink outline-none mb-4 focus:border-purple"
                  />
                </div>
              </div>

              <label className="block font-semibold text-[14.5px] mb-1.5">
                বিষয় <span className="text-red">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-3 border-2 border-ink/20 rounded-xl font-body text-[15px] text-ink outline-none mb-4 bg-white focus:border-purple"
              >
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <label className="block font-semibold text-[14.5px] mb-1.5">
                বার্তা <span className="text-red">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setError("");
                }}
                rows={5}
                placeholder="যা জানতে চান খোলাখুলি লিখুন — কোন ব্যাচ, কোন সেমিস্টার, কী সমস্যা।"
                className="w-full px-3.5 py-3 border-2 border-ink/20 rounded-xl font-body text-[15px] text-ink outline-none resize-y leading-relaxed focus:border-purple"
              />

              {error && (
                <div className="mt-3.5 bg-red/10 border-[1.5px] border-red/45 rounded-xl px-3.5 py-2.75 text-sm text-[#B33636]">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-5.5">
                <button
                  type="button"
                  onClick={submit}
                  className="font-display font-bold text-base px-7.5 py-3.5 bg-purple text-white border-2 border-ink rounded-full shadow-sticker cursor-pointer transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-sticker-sm"
                >
                  বার্তা পাঠান
                </button>
                <span className="text-[13.5px] text-ink/55">
                  তাড়া থাকলে সরাসরি কল দিন — ০১৭১১-১২৩৪৫৬
                </span>
              </div>
            </div>
          ) : (
            <div className="animate-sog-up text-center py-6.5 px-1.5">
              <div className="w-19 h-19 mx-auto rounded-full bg-success/13 border-2 border-success grid place-items-center text-[34px]">
                ✓
              </div>
              <h2 className="font-display font-extrabold text-[28px] mt-5 mb-2">বার্তা পৌঁছে গেছে</h2>
              <p className="text-base text-ink/70 mx-auto mb-4.5 max-w-105">
                ধন্যবাদ {sentName}! আপনার প্রশ্ন &ldquo;{sentSubject}&rdquo; টিমের কাছে গেছে। {replyPromise}
              </p>
              <div className="inline-block bg-cloud border-[1.5px] border-dashed border-ink/30 rounded-xl px-4.5 py-2.5 text-[14.5px]">
                টিকিট নম্বর <strong className="font-display">{ticket}</strong>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <Link
                  href="/academic"
                  className="font-display font-bold text-[15px] px-5.5 py-2.75 bg-gold text-ink border-2 border-ink rounded-full shadow-[3px_3px_0_0_var(--color-ink)] no-underline"
                >
                  ব্যাচ দেখুন
                </Link>
                <button
                  type="button"
                  onClick={reset}
                  className="font-display font-bold text-[15px] px-5.5 py-2.75 bg-white text-ink border-2 border-ink rounded-full cursor-pointer"
                >
                  আরেকটি বার্তা
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-5.5">
          <div className="bg-white border-2 border-ink rounded-[18px] shadow-[5px_5px_0_0_var(--color-ink)] overflow-hidden">
            <iframe
              title="অফিসের ম্যাপ"
              src="https://www.openstreetmap.org/export/embed.html?bbox=90.3690%2C23.7415%2C90.3830%2C23.7515&layer=mapnik&marker=23.7465%2C90.3760"
              className="w-full h-53 block border-0 border-b-2 border-ink saturate-[0.85]"
            />
            <div className="p-5">
              <div className="font-display font-extrabold text-[19px]">আমাদের অফিস</div>
              <p className="text-[15px] text-ink/70 mt-1.5 mb-3">
                বাড়ি ৪২ (৩য় তলা), রোড ১২/এ
                <br />
                ধানমন্ডি, ঢাকা ১২০৯
              </p>
              <div className="text-sm text-ink/60 border-t border-ink/10 pt-3">
                সরাসরি আসার আগে একবার কল দিন — কাউন্সেলর ফাঁকা আছেন কিনা জানিয়ে দেব।
              </div>
              <a
                href="https://www.openstreetmap.org/?mlat=23.7465&mlon=90.3760#map=17/23.7465/90.3760"
                target="_blank"
                rel="noopener"
                className="inline-block mt-3.5 font-semibold text-[14.5px] no-underline"
              >
                ম্যাপে দেখুন →
              </a>
            </div>
          </div>

          <div className="bg-lavender border-2 border-ink rounded-[18px] shadow-[5px_5px_0_0_var(--color-ink)] p-5.5">
            <div className="font-display font-extrabold text-[19px] mb-3">হেল্পলাইনের সময়</div>
            <div className="grid gap-2.25 text-[15px]">
              <div className="flex justify-between gap-3">
                <span>শনি – বৃহস্পতি</span>
                <strong className="font-semibold">সকাল ১০টা – রাত ১০টা</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span>শুক্রবার</span>
                <strong className="font-semibold">বিকাল ৪টা – রাত ১০টা</strong>
              </div>
              <div className="flex justify-between gap-3 text-ink/60">
                <span>Messenger / WhatsApp</span>
                <strong className="font-semibold">সবসময় খোলা</strong>
              </div>
            </div>
            <div className="mt-3.5 pt-3.25 border-t border-ink/14 text-sm text-ink/65">
              সময়ের বাইরে লিখলেও উত্তর পাবেন — সকালে প্রথম কাজ ওগুলোর জবাব দেওয়া।
            </div>
          </div>

          <div className="bg-white border-2 border-ink rounded-[18px] shadow-[5px_5px_0_0_var(--color-ink)] p-5.5">
            <div className="font-display font-extrabold text-[19px] mb-1">কমিউনিটিতে যোগ দিন</div>
            <p className="text-[14.5px] text-ink/65 mb-3.5">
              সহপাঠীরা যেখানে প্রশ্ন করে, নোট শেয়ার করে।
            </p>
            <div className="grid gap-2.25">
              <a
                href="https://facebook.com/groups/schoolofgenz"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2.75 px-3.25 py-2.75 border-[1.5px] border-ink/16 rounded-xl no-underline text-ink hover:border-purple hover:bg-lavender"
              >
                <span className="w-8 h-8 rounded-[9px] bg-[#1877F2]/12 grid place-items-center font-bold text-[#1877F2]">
                  f
                </span>
                <span className="flex-1">
                  <span className="font-semibold text-[14.5px] block">ফেসবুক স্টুডেন্ট গ্রুপ</span>
                  <span className="text-[13px] text-ink/55">১২,০০০+ সদস্য</span>
                </span>
              </a>
              <a
                href="https://youtube.com/@schoolofgenz"
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2.75 px-3.25 py-2.75 border-[1.5px] border-ink/16 rounded-xl no-underline text-ink hover:border-purple hover:bg-lavender"
              >
                <span className="w-8 h-8 rounded-[9px] bg-red/10 grid place-items-center text-[#E62117] text-[13px]">
                  ▶
                </span>
                <span className="flex-1">
                  <span className="font-semibold text-[14.5px] block">ইউটিউব চ্যানেল</span>
                  <span className="text-[13px] text-ink/55">ফ্রি ক্লাস ও রিভিশন</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TEACH WITH US */}
      <section className="max-w-[1160px] mx-auto px-6 pt-8.5 pb-2">
        <div className="bg-ink text-white rounded-[22px] px-9 py-9.5 grid grid-cols-1 lg:grid-cols-[1.4fr_auto] gap-7 items-center">
          <div>
            <span className="inline-block bg-gold text-ink rounded-full px-3.25 py-0.75 font-display font-bold text-[13px]">
              আমরা শিক্ষক খুঁজছি
            </span>
            <h2 className="font-display font-extrabold text-[32px] mt-3.5 mb-2 tracking-[-0.3px]">
              শিক্ষক হতে চাই
            </h2>
            <p className="text-[16.5px] text-white/75 max-w-140">
              ডিপ্লোমার কোনো সাবজেক্ট বা স্কিল আপনি ভালো বোঝান? বাংলায় পড়াতে ভালোবাসেন? সিভি আর একটি ৩ মিনিটের
              ডেমো ভিডিও পাঠান — আমরা দুই সপ্তাহের মধ্যে জানাই।
            </p>
            <div className="text-[14.5px] text-white/60 mt-3">
              teach@schoolofgenz.com · বিষয় লাইনে সাবজেক্টের নাম লিখুন
            </div>
          </div>
          <a
            href="mailto:teach@schoolofgenz.com?subject=শিক্ষক হতে চাই"
            className="justify-self-start lg:justify-self-end font-display font-bold text-[16.5px] px-8 py-3.75 bg-gold text-ink border-2 border-white rounded-full shadow-[4px_4px_0_0_rgba(255,255,255,0.35)] no-underline whitespace-nowrap transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            সিভি পাঠান
          </a>
        </div>
      </section>

      {/* FAQ STRIP */}
      <section className="max-w-[1160px] mx-auto px-6 pt-8.5 pb-16">
        <div className="border-2 border-dashed border-ink/30 rounded-[18px] px-7 py-6.5 flex flex-wrap items-center justify-between gap-5 bg-cloud">
          <div>
            <div className="font-display font-extrabold text-2xl">উত্তর পাওনি?</div>
            <p className="text-[15.5px] text-ink/65 mt-1">
              সবচেয়ে বেশি জিজ্ঞেস করা ২৫টি প্রশ্নের উত্তর এক জায়গায় — ফি, ক্লাস, রিফান্ড, ডিভাইস।
            </p>
          </div>
          <Link
            href="/how"
            className="font-display font-bold text-[15.5px] px-6.5 py-3.25 bg-white text-ink border-2 border-ink rounded-full shadow-[3px_3px_0_0_var(--color-ink)] no-underline whitespace-nowrap hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-ink)] transition-transform duration-150"
          >
            প্রশ্ন-উত্তর দেখুন
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
