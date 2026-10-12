/**
 * The enrollment form's two calls. They go to /api/* on this site, which Next forwards to the API.
 * The API answers a failure with a code; `say` words it for the student.
 */

async function post(path, body) {
  let res;
  try {
    res = await fetch("/api/v1/public" + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } catch {
    throw { code: "offline" };
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw { code: data?.error?.code || "internal", fields: data?.error?.fields || {} };
  return data;
}

/** What it costs today: `{ price, discount, total, coupon, installment, installments }`. */
export const getQuote = (buying) => post("/quote", buying);
/** Send the form. Answers `{ status: "pending" | "active", amount }`. */
export const sendEnrollment = (form) => post("/enrollments", form);

const MESSAGES = {
  trx_taken: "এই TrxID আগে একবার জমা পড়েছে — SMS থেকে আবার মিলিয়ে দেখো।",
  payment_pending: "তোমার একটা পেমেন্ট যাচাইয়ের অপেক্ষায় আছে — কনফার্মেশন SMS-এর জন্য অপেক্ষা করো।",
  payment_needed: "পেমেন্টের মাধ্যম আর TrxID দুটোই লাগবে।",
  bad_coupon: "কুপনটি কাজ করছে না — আবার দেখো।",
  not_on_sale: "এই কোর্সে এখন ভর্তি নেওয়া হচ্ছে না।",
  not_enrolling: "এই ব্যাচে এখন ভর্তি নেওয়া হচ্ছে না।",
  deadline_passed: "এই ব্যাচে ভর্তির শেষ তারিখ পেরিয়ে গেছে।",
  batch_full: "এই ব্যাচের সব সিট পূর্ণ হয়ে গেছে।",
  captcha_failed: "যাচাই সম্পন্ন হয়নি — নিচের বক্সটি আবার টিক দিয়ে চেষ্টা করো।",
  rate_limited: "অনেকবার চেষ্টা হয়েছে — কিছুক্ষণ পর আবার চেষ্টা করো।",
  invalid_input: "কিছু তথ্য ঠিক নেই — ফর্মটা আবার মিলিয়ে দেখো।",
  offline: "ইন্টারনেট সংযোগ পাওয়া যাচ্ছে না — আবার চেষ্টা করো।",
};
const FIELDS = {
  name: "নামটা আবার দেখো।",
  phone: "ফোন নম্বরটি আবার দেখো — ১১ ডিজিট হবে।",
  trxId: "TrxID টা আবার দেখো — SMS-এ পাবে।",
  sender: "নম্বরটি ১১ ডিজিট হবে।",
  coupon: MESSAGES.bad_coupon,
};

/** The sentence for a failure, and under which field of the form it belongs (`form` when it is about none). */
export function say(e) {
  const code = e?.code || "internal";
  if (code === "trx_taken") return { trx: MESSAGES.trx_taken };
  if (code === "bad_coupon") return { coupon: MESSAGES.bad_coupon };
  if (code === "invalid_input") {
    const at = { name: "name", phone: "phone", trxId: "trx", sender: "sender", coupon: "coupon" };
    const out = {};
    for (const f of Object.keys(e.fields || {})) if (at[f]) out[at[f]] = FIELDS[f];
    if (Object.keys(out).length) return out;
  }
  return { form: MESSAGES[code] || "কিছু একটা সমস্যা হয়েছে — একটু পর আবার চেষ্টা করো।" };
}

const digits = (v) => String(v).replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d))).replace(/[\s-]/g, "").replace(/^\+?88(?=01)/, "");
/** A Bangladeshi mobile number, typed in either kind of digit. */
export const phoneOk = (v) => /^01[3-9]\d{8}$/.test(digits(v));
export const trxOk = (v) => /^[A-Z0-9]{6,20}$/i.test(String(v).trim());
