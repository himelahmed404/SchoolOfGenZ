const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

export const toBn = (n) => String(n).replace(/[0-9]/g, (d) => BN_DIGITS[+d]);
export const fromBn = (s) =>
  String(s).replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

export const priceToInt = (str) => parseInt(fromBn(str || "").replace(/[^0-9]/g, ""), 10) || 0;

export const toBnTaka = (n) => "৳" + toBn(n.toLocaleString("en-US"));

const ORDINALS = ["", "১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ", "৭ম", "৮ম"];
/** 4 → ৪র্থ */
export const ordinalBn = (n) => ORDINALS[n] || toBn(n) + "ম";

const MONTHS = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
/** "2026-08-01" → ১ আগস্ট ২০২৬ */
export const dateBn = (day) => {
  const [y, m, d] = String(day || "").split("-").map(Number);
  return y && m && d ? `${toBn(d)} ${MONTHS[m - 1]} ${toBn(y)}` : "—";
};

/** The API counts the week from Saturday. */
export const WEEKDAYS = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"];

/** 754 seconds → ১২:৩৪ */
export const clockBn = (sec) => toBn(`${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`);
/** 6000 seconds → ১ঘ ৪০মি */
export const hoursBn = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return [h ? `${toBn(h)}ঘ` : "", m || !h ? `${toBn(m)}মি` : ""].filter(Boolean).join(" ");
};

/** 01777 090909 → ০১৭৭৭ ০৯০৯০৯, or the placeholder while there is no number. */
export const phoneBn = (p) => (p ? toBn(p) : "০১XXXXXXXXX");
