"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SupportChat from "@/components/SupportChat";
import { toBn, fromBn } from "@/lib/bn";

const PER_PAGE = 6;

const COVER = {
  academic: "bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_10px,#E1E2F3_10px,#E1E2F3_20px)]",
  skill: "bg-[repeating-linear-gradient(45deg,#FFF3D4,#FFF3D4_10px,#FCE9B5_10px,#FCE9B5_20px)]",
};

function chipClass(active) {
  return (
    "font-semibold text-[13.5px] px-3.5 py-2 rounded-full border-2 border-ink cursor-pointer shadow-sticker-sm transition-[transform,box-shadow] duration-150 " +
    (active ? "bg-purple text-white -translate-x-px -translate-y-px shadow-sticker" : "bg-white text-ink")
  );
}

function PostCard({ p, index }) {
  return (
    <Link
      href={`/blog/${p.slug}`}
      style={{ animationDelay: `${index * 50}ms` }}
      className="animate-sog-up flex flex-col bg-white border-2 border-ink rounded-2xl shadow-sticker overflow-hidden no-underline text-ink transition-transform duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_var(--color-ink)]"
    >
      <div className={`h-37.5 relative grid place-items-center ${COVER[p.track]}`}>
        <span
          className={
            "absolute top-3 left-3 font-bold text-[11.5px] px-2.5 py-1 rounded-full border-[1.5px] border-ink " +
            (p.track === "skill" ? "bg-gold text-ink" : "bg-white text-purple")
          }
        >
          {p.category}
        </span>
        <span className="font-mono text-[11px] text-ink/40">COVER</span>
      </div>
      <div className="p-4.25 pt-4 flex-1 flex flex-col">
        <h3 className="font-display font-extrabold text-[17.5px] leading-tight">{p.title}</h3>
        <p className="text-sm text-ink/62 mt-2">{p.excerpt}</p>
        <div className="flex items-center gap-2 mt-3.5 text-[12.5px] text-ink/50">
          {p.date} · {p.read}
        </div>
      </div>
    </Link>
  );
}

export default function BlogClient({ posts }) {
  const progressRef = useRef(null);
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [subPhone, setSubPhone] = useState("");
  const [subMsg, setSubMsg] = useState("");
  const [subOk, setSubOk] = useState(false);

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

  // The newest post marked Featured leads the page; with none marked, the newest post does.
  const featured = posts.find((p) => p.featured) || posts[0];
  // Categories are whatever the posts on the site use, the fullest first.
  const categories = useMemo(() => {
    const count = new Map();
    for (const p of posts) if (p.category) count.set(p.category, (count.get(p.category) || 0) + 1);
    return [...count].sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n }));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) => (cat === "all" || p.category === cat) && (!q || (p.title + p.excerpt).toLowerCase().includes(q))
    );
  }, [posts, cat, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagePosts = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const trending = [...posts.filter((p) => p.featured), ...posts.filter((p) => !p.featured)].slice(0, 5);

  const resetAll = () => {
    setCat("all");
    setQuery("");
    setPage(1);
  };

  const subscribe = () => {
    const digits = fromBn(subPhone).replace(/[^0-9]/g, "");
    if (digits.length !== 11) {
      setSubMsg("নম্বরটি ১১ ডিজিট হবে — আবার দেখো।");
      setSubOk(false);
      return;
    }
    setSubMsg("✓ ধন্যবাদ! নতুন লেখা এলেই জানাবো।");
    setSubOk(true);
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 h-1 bg-cloud z-[120] border-b border-ink/12">
        <div ref={progressRef} className="h-full w-0 bg-gold" />
      </div>

      <SiteNav active="blog" />

      <header className="bg-lavender border-b border-ink/8">
        <div className="max-w-[1160px] mx-auto px-6 py-[clamp(40px,5.5vw,64px)]">
          <span className="inline-flex items-center gap-1.75 bg-white border-2 border-ink rounded-full px-3.75 py-1.75 font-bold text-sm shadow-sticker-sm">
            ✍️ ব্লগ ও নোট
          </span>
          <h1 className="font-display font-extrabold text-[clamp(30px,4.4vw,50px)] leading-[1.14] mt-4">
            শেখার <span className="bg-gold px-2 rounded">রিসোর্স</span> — সবার জন্য ফ্রি
          </h1>
          <p className="text-[clamp(16px,1.5vw,19px)] text-ink/72 mt-3 max-w-150">
            সাজেশন, বিটিইবি আপডেট, ক্যারিয়ার গাইড আর ইংরেজি শেখার টিপস — নিয়মিত নতুন লেখা, তোমার ভাষায়।
          </p>
        </div>
      </header>

      {/* FEATURED */}
      {featured && (
        <section className="max-w-[1160px] mx-auto px-6 pt-9">
          <Link
            href={`/blog/${featured.slug}`}
            className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] border-2 border-ink rounded-[22px] shadow-[6px_6px_0_0_var(--color-ink)] overflow-hidden no-underline text-ink transition-transform duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_0_var(--color-ink)]"
          >
            <div className="relative min-h-70 bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_12px,#E1E2F3_12px,#E1E2F3_24px)] grid place-items-center">
              <span className="absolute top-4 left-4 bg-gold text-ink font-bold text-[13px] px-3.25 py-1.25 rounded-full border-[1.5px] border-ink">
                ⭐ ফিচার্ড
              </span>
              <span className="font-mono text-xs text-ink/45">COVER IMAGE</span>
            </div>
            <div className="p-[clamp(24px,3vw,40px)] flex flex-col justify-center">
              <span className="self-start bg-purple/10 text-purple font-bold text-[12.5px] px-2.75 py-1 rounded-full">
                {featured.category}
              </span>
              <h2 className="font-display font-extrabold text-[clamp(22px,2.6vw,32px)] leading-tight mt-3">
                {featured.title}
              </h2>
              <p className="text-base text-ink/70 mt-3">{featured.excerpt}</p>
              <div className="flex items-center gap-2.5 mt-4.5 text-[13.5px] text-ink/55">
                <span className="w-7.5 h-7.5 rounded-full bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_5px,#E1E2F3_5px,#E1E2F3_10px)] border-[1.5px] border-ink" />
                <span>{featured.author ? featured.author.name : "School of GenZ টিম"}</span> · <span>{featured.date}</span> · <span>{featured.read}</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* BODY */}
      <section className="max-w-[1160px] mx-auto px-6 pt-9 pb-17.5 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-9 items-start">
        <div>
          <div className="grid gap-3.5 mb-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] opacity-50">🔍</span>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="লেখা খুঁজো — যেমন: গণিত সাজেশন, IELTS…"
                className="w-full font-body text-base py-3.25 pl-11 pr-4 border-2 border-ink rounded-[14px] shadow-sticker-sm outline-none focus:border-purple focus:shadow-[2px_2px_0_0_var(--color-purple)]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setCat("all");
                  setPage(1);
                }}
                className={chipClass(cat === "all")}
              >
                সব
              </button>
              {categories.map(({ name: c }) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCat(c);
                    setPage(1);
                  }}
                  className={chipClass(cat === c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-ink/55 mb-4">
            <span className="text-purple font-bold">{toBn(filtered.length)}</span>টি লেখা
          </div>

          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {pagePosts.map((p, i) => (
                  <PostCard key={p.slug} p={p} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-9">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="w-10 h-10 rounded-[10px] border-2 border-ink shadow-sticker-sm bg-white text-ink text-lg cursor-pointer"
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={
                        "w-10 h-10 rounded-[10px] border-2 border-ink shadow-sticker-sm font-display font-bold text-[15px] cursor-pointer " +
                        (currentPage === n ? "bg-purple text-white" : "bg-white text-ink")
                      }
                    >
                      {toBn(n)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="w-10 h-10 rounded-[10px] border-2 border-ink shadow-sticker-sm bg-white text-ink text-lg cursor-pointer"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="border-2 border-dashed border-ink rounded-[20px] bg-lavender px-7 py-10 text-center">
              <div className="text-[44px]">🐧</div>
              <div className="font-display font-extrabold text-xl mt-2.5">কিছু খুঁজে পেলাম না</div>
              <p className="text-[15px] text-ink/62 my-1.5 mb-3.5">অন্য শব্দে খুঁজে দেখো, বা সব লেখা দেখো।</p>
              <button
                type="button"
                onClick={resetAll}
                className="font-display font-bold text-[15px] px-5.5 py-2.5 bg-purple text-white border-2 border-ink rounded-full shadow-sticker-sm cursor-pointer"
              >
                সব লেখা দেখো
              </button>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-22.5 grid gap-5">
          <div className="bg-white border-2 border-ink rounded-2xl shadow-sticker overflow-hidden">
            <div className="bg-ink text-white px-4.5 py-3.25 font-display font-bold text-[15.5px]">
              🔥 জনপ্রিয় লেখা
            </div>
            <div className="p-1.5">
              {trending.map((t, i) => (
                <Link
                  key={t.slug}
                  href={`/blog/${t.slug}`}
                  className="flex gap-3 items-start px-3 py-2.75 rounded-xl no-underline text-ink hover:bg-lavender"
                >
                  <span className="shrink-0 font-display font-extrabold text-xl text-periwinkle leading-none">
                    {toBn(i + 1)}
                  </span>
                  <span className="font-semibold text-sm leading-snug">{t.title}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gold border-2 border-ink rounded-2xl shadow-sticker p-5">
            <div className="font-display font-extrabold text-lg">নতুন লেখা মিস করো না</div>
            <p className="text-[13.5px] text-ink/75 my-1.5 mb-3">
              নম্বর রেখে যাও — নতুন সাজেশন আর নোট এলেই SMS পাবে।
            </p>
            <div className="flex gap-2">
              <input
                value={subPhone}
                onChange={(e) => setSubPhone(e.target.value)}
                placeholder="০১XXXXXXXXX"
                inputMode="numeric"
                className="flex-1 min-w-0 font-body text-sm px-3 py-2.5 border-2 border-ink rounded-[10px] shadow-sticker-sm outline-none bg-white"
              />
              <button
                type="button"
                onClick={subscribe}
                className="font-display font-bold text-sm px-3.5 py-2.5 bg-ink text-white border-2 border-ink rounded-[10px] cursor-pointer whitespace-nowrap"
              >
                পাব
              </button>
            </div>
            {subMsg && (
              <div className={"text-[12.5px] font-semibold mt-2 " + (subOk ? "text-success" : "text-red")}>
                {subMsg}
              </div>
            )}
          </div>

          <div className="bg-white border-2 border-ink rounded-2xl shadow-sticker px-4.5 py-4">
            <div className="font-display font-bold text-[15.5px] mb-2.5">ক্যাটাগরি</div>
            <div className="grid gap-1.5">
              {categories.map(({ name: c, n }) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCat(c);
                    setPage(1);
                  }}
                  className="flex justify-between items-center bg-transparent border-none cursor-pointer font-body text-sm text-ink py-1.25 text-left"
                >
                  <span>{c}</span>
                  <span className="text-ink/45 font-semibold">
                    {toBn(n)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <SiteFooter />

      <div className="fixed right-5.5 bottom-5.5 z-[130]">
        <SupportChat />
      </div>
    </div>
  );
}
