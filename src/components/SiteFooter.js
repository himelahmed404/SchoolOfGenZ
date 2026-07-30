import Link from "next/link";

const COURSE_LINKS = [
  { label: "একাডেমিক ব্যাচ", href: "/academic" },
  { label: "স্কিল কোর্স", href: "/skills" },
  { label: "ফ্রি রিসোর্স", href: "/" },
];

const ORG_LINKS = [
  { label: "আমাদের গল্প", href: "/" },
  { label: "কীভাবে চলে", href: "/how" },
  { label: "শিক্ষক", href: "/teachers" },
  { label: "সফলতা", href: "/success" },
  { label: "ব্লগ", href: "/blog" },
  { label: "যোগাযোগ", href: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "FAQ", href: "/how" },
  { label: "অভিভাবকদের জন্য", href: "/" },
  { label: "রিফান্ড পলিসি", href: "/" },
  { label: "হেল্পলাইন", href: "/contact" },
];

function LinkColumn({ title, links }) {
  return (
    <div>
      <div className="font-display font-bold text-white mb-3">{title}</div>
      <div className="grid gap-2 text-[14.5px]">
        {links.map((l) => (
          <Link key={l.label} href={l.href} className="text-white/82 no-underline">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-white/82 font-body">
      <div className="max-w-[1200px] mx-auto px-6 pt-14 pb-7.5 grid gap-7.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 text-white">
            <span className="inline-grid place-items-center w-9 h-9 bg-white text-ink rounded-[10px] font-display font-extrabold">
              G
            </span>
            <span className="font-display font-extrabold text-[17px]">
              School of GenZ
            </span>
          </div>
          <p className="text-[14.5px] mt-3.5 max-w-70">
            বাংলায় শেখার প্ল্যাটফর্ম — ডিপ্লোমা থেকে স্কিল, তোমার ভাষায়।
          </p>
          <div className="flex gap-2.5 mt-4">
            <span className="w-9.5 h-9.5 rounded-[10px] border border-white/25 grid place-items-center text-base">
              f
            </span>
            <span className="w-9.5 h-9.5 rounded-[10px] border border-white/25 grid place-items-center text-sm">
              ▶
            </span>
            <span className="w-9.5 h-9.5 rounded-[10px] border border-white/25 grid place-items-center text-[13px]">
              TT
            </span>
          </div>
        </div>

        <LinkColumn title="কোর্স" links={COURSE_LINKS} />
        <LinkColumn title="প্রতিষ্ঠান" links={ORG_LINKS} />
        <LinkColumn title="সহায়তা" links={SUPPORT_LINKS} />
      </div>

      <div className="border-t border-white/12">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-wrap gap-3 justify-between items-center text-[13px] text-white/55">
          <div className="flex gap-2 items-center">
            <span className="bg-[#E2136E] text-white px-2.25 py-0.75 rounded-md font-bold">
              bKash
            </span>
            <span className="bg-[#F7941D] text-white px-2.25 py-0.75 rounded-md font-bold">
              Nagad
            </span>
          </div>
          <div>© ২০২৬ School of GenZ · ট্রেড লাইসেন্স নং ০০০০ · ডেমো</div>
        </div>
      </div>
    </footer>
  );
}
