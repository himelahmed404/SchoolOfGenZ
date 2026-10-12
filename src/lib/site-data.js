import { clockBn, dateBn, hoursBn, ordinalBn, toBn, toBnTaka, WEEKDAYS } from "./bn";

/**
 * Turns what the API sends (numbers, dates, English facts) into the Bangla strings the pages show.
 * The components were written for the shapes these two functions return.
 */

export const ENROLLING = "ভর্তি চলছে";
const DEPARTMENTS = { Civil: "সিভিল", Electrical: "ইলেকট্রিক্যাল", Electronics: "ইলেকট্রনিক্স", Mechanical: "মেকানিক্যাল" };
/** A count of students is shown from here up; a new batch does not say "1 student". */
const WORTH_SAYING = 20;
/** On a lesson anyone can watch, and on a chapter that has one. */
const FREE = "ফ্রি ▶";

const list = (v) => (Array.isArray(v) ? v : []);
const text = (v) => (typeof v === "string" ? v : "");
/** A page's own questions come first, then its track's; one asked in both is shown once. */
const once = (faqs) => list(faqs).filter((f, i, all) => all.findIndex((x) => x.q === f.q) === i);

/** The struck-through price: the full price during an early-bird window, otherwise the old price the sales page names. */
function oldPrice(p) {
  const old = Math.max(p.price.full, p.oldPrice || 0);
  return old > p.price.now ? old : 0;
}

function money(p) {
  const old = oldPrice(p);
  return {
    priceNum: p.price.now,
    oldNum: old || p.price.now,
    price: p.price.now ? toBnTaka(p.price.now) : "ফ্রি",
    old: old ? toBnTaka(old) : "",
    discount: old ? `${toBn(Math.round(((old - p.price.now) / old) * 100))}% ছাড়` : "",
  };
}

const people = (sales) => list(sales.people).filter((x) => x && x.name);

function batchStatus(b, today) {
  if (b.status === "running") return "ক্লাস চলছে";
  const open = b.status === "enrolling" && b.seatsLeft > 0 && (!b.enrollDeadline || b.enrollDeadline >= today);
  return open ? ENROLLING : "ভর্তি বন্ধ";
}

/** A diploma batch, for a card, and with its syllabus when the API sent one (`/academic/[slug]`). */
export function toBatch(b, today) {
  const sales = b.sales || {};
  const dept = DEPARTMENTS[b.department] || b.department || b.code;
  const sem = b.semester ? ordinalBn(b.semester) : "";
  const lessons = b.subjects.reduce((n, s) => n + s.lessons, 0);
  const enrolled = b.seats - b.seatsLeft;
  const card = {
    slug: b.slug,
    program: b.program,
    batchCode: b.batch,
    dept,
    sem,
    title: `${dept} — ${sem} সেমিস্টার — ব্যাচ ${toBn(String(b.no).padStart(2, "0"))}`,
    status: batchStatus(b, today),
    ...money(b),
    start: dateBn(b.startDate),
    counts: text(sales.counts) || `${toBn(b.subjects.length)} বিষয় · ${toBn(lessons)} লেসন`,
    deadline: b.enrollDeadline ? dateBn(b.enrollDeadline) : "",
    students: enrolled >= WORTH_SAYING ? toBn(enrolled) : "",
    duration: text(sales.duration),
    medium: text(sales.medium),
    tagline: text(sales.tagline),
  };
  if (!b.subjects.some((s) => s.chapters)) return card;

  const named = people(sales);
  const teaching = new Map();
  for (const s of b.subjects) for (const t of s.teachers) teaching.set(t.name, [...(teaching.get(t.name) || []), s.titleBn || s.title]);
  return {
    ...card,
    stats: list(sales.stats),
    subjects: b.subjects.map((s) => ({
      title: s.titleBn || s.title,
      code: s.bteb ? `BTEB ${s.bteb}` : s.code,
      meta: `${toBn(list(s.chapters).length)} অধ্যায় · ${toBn(s.lessons)} লেসন`,
      rows: list(s.chapters).map((c) => ({ text: c.name, meta: `${toBn(c.lessons.length)} লেসন`, ...(c.lessons.some((l) => l.free) ? { badge: FREE } : {}) })),
    })),
    routine: list(b.routine).map((r) => ({ day: WEEKDAYS[r.weekday] || "", time: toBn(r.time), subject: r.course || "", teacher: r.teacher || "" })),
    // The people the sales page names; without them, whoever teaches the subjects.
    teachers: named.length
      ? named.map((t) => ({ title: t.name, teaches: text(t.role), credential: text(t.credential) }))
      : [...teaching].map(([name, subjects]) => ({ title: name, teaches: subjects.join(", "), credential: "" })),
    testimonials: list(b.testimonials).map((t) => ({ title: t.name, meta: t.meta, quote: t.quote })),
    faqs: once(b.faqs),
  };
}

/** A single course, for a card, and with its modules when the API sent them (`/skills/[slug]`). */
export function toSkill(s) {
  const sales = s.sales || {};
  const c = s.course;
  const card = {
    slug: s.slug,
    program: s.slug,
    title: s.title,
    pitch: text(sales.pitch),
    ...money(s),
    lessons: `${toBn(c.lessons)} লেসন`,
    dur: text(sales.duration) || (s.weeks ? `${toBn(s.weeks)} সপ্তাহ` : hoursBn(c.durationSec)),
    level: text(sales.level) || "রেকর্ডেড",
    students: s.students >= WORTH_SAYING ? `${toBn(s.students)} শিক্ষার্থী এই কোর্সে` : "",
    certificate: s.hasCertificate,
    tagline: text(sales.tagline),
  };
  if (!c.chapters) return card;

  const [first] = people(sales);
  const teacher = c.teachers[0];
  return {
    ...card,
    forWhom: list(sales.forWhom),
    outcomes: list(sales.outcomes),
    modules: c.chapters.map((m) => ({
      title: m.name,
      meta: `${toBn(m.lessons.length)} লেসন · ${hoursBn(m.lessons.reduce((n, l) => n + l.durationSec, 0))}`,
      rows: m.lessons.map((l) => ({ text: l.title, meta: l.durationSec ? clockBn(l.durationSec) : "", ...(l.free ? { badge: FREE } : {}) })),
    })),
    instructor: first
      ? { name: first.name, role: text(first.role), badges: list(first.badges), quote: text(first.quote) }
      : teacher
        ? { name: teacher.name, role: "", badges: [], quote: teacher.bio || "" }
        : null,
    testimonials: list(s.testimonials),
    faqs: once(s.faqs),
  };
}
