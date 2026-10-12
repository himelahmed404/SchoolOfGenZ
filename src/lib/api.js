import { toBatch, toSkill } from "./site-data";

/**
 * What the pages read from the API, on the server. Each answer is kept for a minute, so a price changed in
 * the admin console shows here within a minute or so. Nothing in this file runs in the browser.
 */
const API_ORIGIN = (process.env.API_ORIGIN || (process.env.NODE_ENV === "production" ? "" : "http://localhost:4000")).replace(/\/$/, "");

/** The answer, or null when the API says there is no such thing. Anything else that goes wrong is thrown. */
async function read(path) {
  if (!API_ORIGIN) throw new Error("API_ORIGIN is not set");
  const res = await fetch(API_ORIGIN + "/v1/public" + path, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`The API answered ${res.status} for ${path}`);
  return res.json();
}

/** A list page still opens when the API cannot be reached: it shows nothing to buy instead of an error. */
async function list(path) {
  try {
    return (await read(path)) || [];
  } catch (e) {
    console.error(String(e));
    return [];
  }
}

/** Dhaka's date, as the API writes one: 2026-08-01. */
const today = () => new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 10);

export const getBatches = async () => (await list("/batches")).map((b) => toBatch(b, today()));
export const getSkills = async () => (await list("/courses")).map(toSkill);
/** The questions asked about every diploma batch ("diploma") or every single course ("single"). */
export const getFaqs = (track) => list("/faqs/" + track);

/** One batch with its syllabus, or null when there is none at that address. */
export async function getBatch(slug) {
  const b = await read("/batches/" + encodeURIComponent(slug));
  return b && toBatch(b, today());
}

/** One single course with its syllabus, or null. */
export async function getSkill(slug) {
  const s = await read("/courses/" + encodeURIComponent(slug));
  return s && toSkill(s);
}

const NO_FACTS = { bkash: "", nagad: "", supportPhone: "" };
/** Where to pay and whom to call. */
export async function getSite() {
  try {
    return (await read("/site")) || NO_FACTS;
  } catch (e) {
    console.error(String(e));
    return NO_FACTS;
  }
}
