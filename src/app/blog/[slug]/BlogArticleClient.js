"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SupportChat from "@/components/SupportChat";
import { getRelatedPosts } from "@/lib/data/blog";

function MarginNote({ text, rotate }) {
  return (
    <span
      className={
        "hidden md:block absolute top-0.5 left-[calc(-1*clamp(20px,3vw,40px))] -translate-x-full bg-gold text-ink font-bold text-xs px-2.5 py-0.75 rounded-md whitespace-nowrap shadow-[1px_1px_0_rgba(34,27,94,0.2)] " +
        rotate
      }
    >
      {text}
    </span>
  );
}

function Body({ blocks }) {
  return blocks.map((b, i) => {
    if (b.type === "p") {
      return (
        <p key={i} className="mb-5.5">
          {b.text}
        </p>
      );
    }
    if (b.type === "h2") {
      return (
        <div key={i} className="relative">
          {b.note && <MarginNote text={b.note.text} rotate={b.note.rotate} />}
          <h2 className="font-display font-extrabold text-2xl mt-7 mb-3 text-ink">{b.text}</h2>
        </div>
      );
    }
    if (b.type === "quote") {
      return (
        <div key={i} className="relative">
          {b.note && <MarginNote text={b.note.text} rotate={b.note.rotate} />}
          <blockquote className="my-2 mb-5.5 px-5 py-3.5 border-l-4 border-gold bg-gold/10 rounded-r-xl text-[17px] italic">
            {b.text}
          </blockquote>
        </div>
      );
    }
    if (b.type === "pdf") {
      return (
        <div
          key={i}
          className="flex items-center gap-4 bg-lavender border-2 border-ink rounded-[14px] shadow-[3px_3px_0_0_var(--color-ink)] px-4.5 py-4 my-6.5"
        >
          <div className="shrink-0 w-11.5 h-11.5 rounded-[10px] bg-red grid place-items-center text-white font-display font-extrabold text-[13px]">
            PDF
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-base">{b.title}</div>
            <div className="text-[13px] text-ink/60">{b.meta}</div>
          </div>
        </div>
      );
    }
    if (b.type === "list") {
      return (
        <ul key={i} className="mb-5.5 pl-5.5 list-disc">
          {b.items.map((it) => (
            <li key={it} className="mb-2">
              {it}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  });
}

export default function BlogArticleClient({ post }) {
  const progressRef = useRef(null);
  const related = getRelatedPosts(post);
  const hasFullBody = !!post.body;

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

  const cta = post.cta || {
    kicker: "📘 আরও শিখতে চাও?",
    title: post.category,
    desc: post.excerpt,
    href: post.track === "skill" ? "/skills" : "/academic",
    label: post.track === "skill" ? "স্কিল কোর্স দেখো →" : "একাডেমিক ব্যাচ দেখো →",
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 h-1 bg-cloud z-[120] border-b border-ink/12">
        <div ref={progressRef} className="h-full w-0 bg-gold" />
      </div>

      <SiteNav active="blog" />

      <header className="bg-lavender border-b border-ink/8">
        <div className="max-w-190 mx-auto px-6 pt-5.5 pb-[clamp(32px,4vw,48px)]">
          <div className="text-[13.5px] text-ink/55 mb-4">
            <Link href="/" className="text-ink/55 no-underline">
              হোম
            </Link>{" "}
            ›{" "}
            <Link href="/blog" className="text-ink/55 no-underline">
              ব্লগ
            </Link>{" "}
            › <span className="text-ink font-semibold">{post.category}</span>
          </div>
          <span className="inline-block bg-purple text-white font-bold text-[12.5px] px-3.25 py-1.25 rounded-full">
            {post.category}
          </span>
          <h1 className="font-display font-extrabold text-[clamp(28px,4vw,44px)] leading-[1.18] mt-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4.5 text-sm text-ink/60">
            {post.author ? (
              <span className="flex items-center gap-2.25">
                <span className="w-9 h-9 rounded-full bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_6px,#E1E2F3_6px,#E1E2F3_12px)] border-[1.5px] border-ink" />
                <b className="text-ink font-bold">{post.author.short}</b>
              </span>
            ) : (
              <span className="font-bold text-ink">School of GenZ টিম</span>
            )}
            · <span>{post.date}</span> · <span>{post.read} পড়া</span>
          </div>
        </div>
      </header>

      <div className="max-w-225 mx-auto px-6">
        <div className="-mt-6 h-[clamp(200px,32vw,340px)] border-2 border-ink rounded-[20px] shadow-[5px_5px_0_0_var(--color-ink)] bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_14px,#E1E2F3_14px,#E1E2F3_28px)] grid place-items-center">
          <span className="font-mono text-xs text-ink/40">COVER IMAGE · placeholder</span>
        </div>
      </div>

      <article className="max-w-225 mx-auto px-6 py-[clamp(36px,5vw,60px)]">
        <div className="relative bg-white [background-image:repeating-linear-gradient(#fff_0_35px,rgba(34,27,94,.06)_35px_36px)] border border-cloud rounded-2xl shadow-soft px-[clamp(24px,4vw,52px)] py-[clamp(28px,4vw,48px)]">
          <div className="absolute left-[clamp(52px,7vw,84px)] top-0 bottom-0 w-0.5 bg-red/35" />
          <div className="max-w-[68ch] ml-[clamp(20px,3vw,40px)] text-[17.5px] text-ink/90">
            {hasFullBody ? (
              <Body blocks={post.body} />
            ) : (
              <>
                <p className="mb-5.5">{post.excerpt}</p>
                <p className="text-ink/55 text-base">
                  এই বিষয়ে সম্পূর্ণ লেখাটি শীঘ্রই যুক্ত হবে — এর মধ্যে সম্পর্কিত ব্যাচ বা কোর্সটি দেখে নিতে পারো।
                </p>
              </>
            )}
          </div>
        </div>

        {post.author && (
          <div className="flex gap-4.5 items-center bg-white border-2 border-ink rounded-2xl shadow-sticker px-5.5 py-5 mt-8">
            <div className="shrink-0 w-18 h-18 rounded-[14px] bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_8px,#E1E2F3_8px,#E1E2F3_16px)] border-[1.5px] border-ink" />
            <div>
              <div className="text-[12.5px] text-ink/50 font-semibold">লিখেছেন</div>
              <div className="font-display font-extrabold text-lg">{post.author.name}</div>
              <div className="text-sm text-ink/65">{post.author.bio}</div>
            </div>
          </div>
        )}

        {/* RELATED COURSE CTA */}
        <div className="mt-6 bg-gradient-to-br from-[#6a3df0] to-purple-deep text-white border-2 border-ink rounded-[20px] shadow-[5px_5px_0_0_var(--color-ink)] p-[clamp(24px,3vw,34px)] relative overflow-hidden bg-cta-stripes">
          <div className="relative flex flex-wrap gap-5 items-center justify-between">
            <div className="flex-1 min-w-60">
              <div className="text-[13px] font-bold opacity-85">{cta.kicker}</div>
              <div className="font-display font-extrabold text-[clamp(20px,2.4vw,26px)] mt-1.5 mb-1">
                {cta.title}
              </div>
              <div className="text-[15px] opacity-90">{cta.desc}</div>
            </div>
            <Link
              href={cta.href}
              className="font-display font-bold text-[17px] px-7 py-3.5 bg-gold text-ink border-2 border-ink rounded-full shadow-[4px_4px_0_0_rgba(0,0,0,0.25)] no-underline whitespace-nowrap transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              {cta.label}
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h3 className="font-display font-extrabold text-[22px] mb-4.5">আরও পড়ো</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="block bg-white border-2 border-ink rounded-2xl shadow-sticker overflow-hidden no-underline text-ink transition-transform duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[7px_7px_0_0_var(--color-ink)]"
                >
                  <div
                    className={
                      "h-24 " +
                      (r.track === "skill"
                        ? "bg-[repeating-linear-gradient(45deg,#FFF3D4,#FFF3D4_10px,#FCE9B5_10px,#FCE9B5_20px)]"
                        : "bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_10px,#E1E2F3_10px,#E1E2F3_20px)]")
                    }
                  />
                  <div className="px-3.75 pt-3.5 pb-4">
                    <span className="text-[11.5px] font-bold text-purple">{r.category}</span>
                    <div className="font-display font-bold text-[15.5px] leading-tight mt-1.25">{r.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <SiteFooter />

      <div className="fixed right-5.5 bottom-5.5 z-[130]">
        <SupportChat />
      </div>
    </div>
  );
}
