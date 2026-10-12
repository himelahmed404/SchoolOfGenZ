"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SupportChat from "@/components/SupportChat";
import Turnstile, { HAS_CAPTCHA } from "@/components/Turnstile";
import { phoneBn, toBn, toBnTaka } from "@/lib/bn";
import { getQuote, phoneOk, say, sendEnrollment, trxOk } from "@/lib/enroll";

const STEP_LABELS = ["তথ্য", "পেমেন্ট", "নিশ্চিতকরণ", "সম্পন্ন"];

const inputClass =
  "sog-input w-full mt-1.5 font-body text-base px-3.5 py-3 border-2 border-ink rounded-xl shadow-sticker-sm outline-none";
const primaryBtnClass =
  "font-display font-bold text-base px-6.5 py-3.25 bg-purple text-white border-2 border-ink rounded-full shadow-sticker-sm cursor-pointer";
const ghostBtnClass =
  "font-display font-bold text-base px-5.5 py-3.25 bg-white text-ink border-2 border-ink rounded-full shadow-sticker-sm cursor-pointer";
const choiceClass = (on) =>
  "font-display font-bold text-[15px] px-4 py-2.5 border-2 border-ink rounded-xl cursor-pointer " +
  (on ? "bg-ink text-white shadow-sticker-sm" : "bg-white text-ink");

function StepChip({ n, label, step }) {
  const active = step === n;
  const done = step > n;
  return (
    <div
      className={
        "flex items-center gap-2 font-bold text-[13.5px] px-3.5 py-2 rounded-full border-2 border-ink " +
        (active ? "bg-gold text-ink shadow-sticker-sm" : done ? "bg-success text-white" : "bg-white text-ink/50")
      }
    >
      <span
        className={
          "inline-grid place-items-center w-5.5 h-5.5 rounded-full text-xs " +
          (active ? "bg-ink text-white" : done ? "bg-white text-success" : "bg-cloud text-ink/50")
        }
      >
        {done ? "✓" : toBn(n)}
      </span>
      {label}
    </div>
  );
}

export default function EnrollClient({ item, site }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [method, setMethod] = useState("bKash");
  const [part, setPart] = useState(false);
  const [trx, setTrx] = useState("");
  const [sender, setSender] = useState("");
  const [errors, setErrors] = useState({});
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  // What the server says it costs. The price the page came with is shown only until this arrives.
  const [quote, setQuote] = useState(null);
  const [blocked, setBlocked] = useState("");
  const [busy, setBusy] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);

  const program = item?.program;
  const batch = item?.batch;
  useEffect(() => {
    if (!program) return;
    let live = true;
    getQuote({ program, batch }).then(
      (q) => live && setQuote(q),
      (e) => live && setBlocked(say(e).form || "")
    );
    return () => {
      live = false;
    };
  }, [program, batch]);

  if (!item || blocked) {
    return (
      <div className="min-h-screen bg-cloud grid place-items-center px-6 py-16">
        <div className="max-w-110 w-full bg-white border-2 border-ink rounded-2xl shadow-sticker p-8 text-center">
          <div className="text-4xl mb-3">🐧</div>
          <h1 className="font-display font-extrabold text-2xl mb-2">
            {item ? "এখন ভর্তি হওয়া যাচ্ছে না" : "কোনো কোর্স বাছা হয়নি"}
          </h1>
          <p className="text-[15px] text-ink/65 mb-6">
            {item ? blocked : "ভর্তি হতে চাইলে আগে একটা ব্যাচ বা স্কিল কোর্স বেছে নাও।"}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/academic"
              className="font-display font-bold text-[15px] px-5.5 py-2.75 bg-purple text-white border-2 border-ink rounded-full shadow-sticker-sm no-underline"
            >
              একাডেমিক ব্যাচ
            </Link>
            <Link
              href="/skills"
              className="font-display font-bold text-[15px] px-5.5 py-2.75 bg-gold text-ink border-2 border-ink rounded-full shadow-sticker-sm no-underline"
            >
              স্কিল কোর্স
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const price = quote ? quote.price : item.priceNum;
  const couponOff = quote ? quote.discount : 0;
  const total = quote ? quote.total : item.priceNum;
  const coupon = quote?.coupon || "";
  const oldNum = Math.max(item.oldNum, price);
  const baseDiscount = oldNum - price;
  const canSplit = !!quote?.installment;
  const payNow = part && canSplit ? quote.installment : total;
  const free = payNow === 0;
  const payNumber = phoneBn(method === "bKash" ? site.bkash : site.nagad);
  const itemSubLabel = item.kind === "skill" ? "স্কিল কোর্স" : `${item.dept} · একাডেমিক`;

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const next = () => {
    if (step === 1) {
      const errs = {};
      if (name.trim().length < 2) errs.name = "নাম লিখতে ভুলে গেছো।";
      if (!phoneOk(phone)) errs.phone = "ফোন নম্বরটি আবার দেখো — ১১ ডিজিট হবে।";
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      // Nothing to pay: there is no payment to describe, so the form is sent from here.
      if (free) {
        submit();
        return;
      }
      setErrors({});
      setStep(2);
      toTop();
    } else if (step === 2) {
      setStep(3);
      toTop();
    }
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = async () => {
    const errs = {};
    if (!free && !trxOk(trx)) errs.trx = `TrxID টা আবার দেখো — ${method} SMS-এ পাবে।`;
    if (!free && !phoneOk(sender)) errs.sender = "নম্বরটি ১১ ডিজিট হবে।";
    if (HAS_CAPTCHA && !captcha) errs.form = "নিচের যাচাই বক্সটি সম্পন্ন করো।";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      await sendEnrollment({
        program,
        batch,
        coupon: coupon || undefined,
        name: name.trim(),
        phone,
        institute: institution.trim() || undefined,
        ...(free ? {} : { method, trxId: trx.trim(), sender, part: (part && canSplit) || undefined }),
        captcha: captcha || undefined,
      });
      setStep(4);
      toTop();
    } catch (e) {
      const said = say(e);
      setErrors(said);
      if (said.name || said.phone) setStep(1);
      // The coupon stopped working since it was applied: show the price without it.
      if (said.coupon) {
        setCouponMsg(said.coupon);
        getQuote({ program, batch }).then(setQuote, () => {});
      }
      // An answer from the check works once, so a second try needs a new one.
      setCaptcha("");
      setCaptchaKey((k) => k + 1);
    } finally {
      setBusy(false);
    }
  };

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponMsg("একটা কুপন কোড লেখো।");
      return;
    }
    setBusy(true);
    try {
      setQuote(await getQuote({ program, batch, coupon: code }));
      setCouponMsg("");
    } catch (e) {
      const said = say(e);
      setCouponMsg(said.coupon || said.form);
    } finally {
      setBusy(false);
    }
  };

  const check = (
    <>
      <Turnstile key={captchaKey} onToken={setCaptcha} />
      {errors.form && <div className="text-red text-[13.5px] mt-3">{errors.form}</div>}
    </>
  );

  return (
    <div className="min-h-screen bg-cloud font-body text-ink">
      <div className="bg-white border-b border-ink/10 sticky top-0 z-20">
        <div className="max-w-[1000px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-grid place-items-center w-9 h-9 bg-purple text-white border-2 border-ink rounded-[10px] shadow-sticker-sm font-display font-extrabold">
              G
            </span>
            <span className="font-display font-extrabold text-base">School of GenZ</span>
          </div>
          <div className="text-[13.5px] text-ink/55">🔒 নিরাপদ ভর্তি</div>
        </div>
        <div className="h-1.25 bg-cloud">
          <div
            className="h-full bg-gold transition-[width] duration-400"
            style={{ width: `${(step / 4) * 100}%`, transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
          />
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 pt-5 flex flex-wrap gap-2">
        {STEP_LABELS.map((label, i) => (
          <StepChip key={label} n={i + 1} label={label} step={step} />
        ))}
      </div>

      {step === 4 ? (
        <div className="max-w-160 mx-auto px-6 pt-9 pb-20 text-center">
          <div className="bg-white border-2 border-ink rounded-[22px] shadow-sticker-lg px-8 py-10">
            <div className="animate-sog-pop w-27.5 h-27.5 mx-auto bg-lavender border-2 border-dashed border-ink rounded-[20px] grid place-items-center">
              <span className="text-[56px]">🐧🎉</span>
            </div>
            <h1 className="font-display font-extrabold text-[clamp(26px,3.6vw,36px)] mt-4.5">
              ভর্তির অনুরোধ পেয়েছি!
            </h1>
            <p className="text-[17px] text-ink/75 mt-3">
              ২৪ ঘণ্টার মধ্যে কনফার্মেশন SMS পাবে। {free ? "যাচাই হলেই" : "পেমেন্ট মিলে গেলেই"} ড্যাশবোর্ড খুলে যাবে।
            </p>
            <div className="bg-lavender rounded-[14px] px-4.5 py-4 my-5.5 text-left text-[14.5px] text-ink/75">
              <div className="font-display font-bold text-ink mb-1.5">এখন যা করবে</div>
              ১. নিচের ফেসবুক গ্রুপে জয়েন করো — ক্লাসের সব আপডেট ওখানে।
              <br />
              ২. কনফার্মেশন SMS-এর জন্য অপেক্ষা করো (২৪ ঘণ্টা)।
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <a
                href="https://facebook.com/groups/schoolofgenz"
                target="_blank"
                rel="noopener"
                className="font-display font-bold text-base px-6 py-3.25 bg-[#1877F2] text-white border-2 border-ink rounded-full shadow-sticker-sm no-underline"
              >
                ফেসবুক গ্রুপে জয়েন করো
              </a>
              <Link
                href="/"
                className="font-display font-bold text-base px-6 py-3.25 bg-white text-ink border-2 border-ink rounded-full shadow-sticker-sm no-underline"
              >
                হোমে ফিরে যাও
              </Link>
            </div>
            <div className="text-[13.5px] text-ink/55 mt-5">সমস্যা? 📞 {phoneBn(site.supportPhone)} (সকাল ৯টা — রাত ১০টা)</div>
          </div>
        </div>
      ) : (
        <div className="max-w-[1000px] mx-auto px-6 pt-6 pb-22.5 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
          <div key={step} className="animate-sog-slide bg-white border-2 border-ink rounded-[20px] shadow-sticker p-7.5">
            {step === 1 && (
              <div>
                <div className="font-display font-extrabold text-[22px]">তোমার তথ্য</div>
                <p className="text-[14.5px] text-ink/60 mt-1 mb-5">ভর্তি নিশ্চিত করতে এটুকু দরকার।</p>
                <div className="grid gap-4">
                  <label className="block">
                    <span className="font-semibold text-sm">নাম</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="তোমার পুরো নাম"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="font-semibold text-sm">ফোন নম্বর</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="numeric"
                      placeholder="০১XXXXXXXXX"
                      className={inputClass}
                    />
                    {errors.phone && <span className="block text-red text-[13px] mt-1">{errors.phone}</span>}
                  </label>
                  <label className="block">
                    <span className="font-semibold text-sm">
                      প্রতিষ্ঠান <span className="text-ink/45 font-normal">(ঐচ্ছিক)</span>
                    </span>
                    <input
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="যেমন: ঢাকা পলিটেকনিক"
                      className={inputClass}
                    />
                  </label>
                  {errors.name && <span className="text-red text-[13px] -mt-2">{errors.name}</span>}
                </div>
                {free && check}
                <div className="flex justify-end mt-6">
                  <button type="button" onClick={next} disabled={busy} className={primaryBtnClass}>
                    {free ? "ভর্তি সম্পন্ন করো ✓" : "পরবর্তী ধাপ →"}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="font-display font-extrabold text-[22px]">পেমেন্ট নির্দেশনা</div>
                <p className="text-[14.5px] text-ink/60 mt-1 mb-4.5">
                  নিচের নম্বরে ঠিক এই পরিমাণ Send Money করো।
                </p>
                <div className="flex flex-wrap gap-2.5 mb-4">
                  {["bKash", "Nagad"].map((m) => (
                    <button key={m} type="button" onClick={() => setMethod(m)} aria-pressed={method === m} className={choiceClass(method === m)}>
                      {m}
                    </button>
                  ))}
                </div>
                {canSplit && (
                  <div className="flex flex-wrap gap-2.5 mb-4">
                    <button type="button" onClick={() => setPart(false)} aria-pressed={!part} className={choiceClass(!part)}>
                      পুরোটা একসাথে · {toBnTaka(total)}
                    </button>
                    <button type="button" onClick={() => setPart(true)} aria-pressed={part} className={choiceClass(part)}>
                      {toBn(quote.installments)} কিস্তিতে · এখন {toBnTaka(quote.installment)}
                    </button>
                  </div>
                )}
                <div className="bg-lavender border-2 border-ink rounded-2xl p-5 grid gap-3">
                  <div className="flex justify-between items-center gap-2.5">
                    <span className="text-ink/65">{method} নম্বর</span>
                    <span className="font-display font-extrabold text-lg">{payNumber}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2.5 border-t border-dashed border-ink/20 pt-3">
                    <span className="text-ink/65">পরিমাণ</span>
                    <span className="font-display font-extrabold text-lg text-purple">{toBnTaka(payNow)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2.5 border-t border-dashed border-ink/20 pt-3">
                    <span className="text-ink/65">রেফারেন্স</span>
                    <span className="font-display font-bold text-[15px]">তোমার ফোন নম্বর</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2.5 mt-4">
                  {[`${method} খোলো`, "Send Money", "TrxID কপি করো"].map((label, i) => (
                    <div key={label} className="text-center">
                      <div className="h-30 rounded-[10px] bg-[repeating-linear-gradient(45deg,#f7dce9,#f7dce9_8px,#f2cadd_8px,#f2cadd_16px)] grid place-items-center font-mono text-[10px] text-ink/50">
                        STEP {toBn(i + 1)}
                      </div>
                      <div className="text-xs text-ink/60 mt-1.25">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between gap-3 mt-6">
                  <button type="button" onClick={back} className={ghostBtnClass}>
                    ← ফিরে যাও
                  </button>
                  <button type="button" onClick={next} className={primaryBtnClass}>
                    পেমেন্ট করেছি →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="font-display font-extrabold text-[22px]">পেমেন্ট নিশ্চিত করো</div>
                <p className="text-[14.5px] text-ink/60 mt-1 mb-5">
                  {method} থেকে পাওয়া TrxID আর যে নম্বর থেকে পাঠিয়েছো, লিখে দাও।
                </p>
                <div className="grid gap-4">
                  <label className="block">
                    <span className="font-semibold text-sm">Transaction ID (TrxID)</span>
                    <input
                      value={trx}
                      onChange={(e) => setTrx(e.target.value)}
                      placeholder="যেমন: 9F2X7K1QAB"
                      className={inputClass}
                    />
                    {errors.trx && <span className="block text-red text-[13px] mt-1">{errors.trx}</span>}
                  </label>
                  <label className="block">
                    <span className="font-semibold text-sm">যে নম্বর থেকে পাঠিয়েছো</span>
                    <input
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      inputMode="numeric"
                      placeholder="০১XXXXXXXXX"
                      className={inputClass}
                    />
                    {errors.sender && <span className="block text-red text-[13px] mt-1">{errors.sender}</span>}
                  </label>
                </div>
                {check}
                <div className="flex justify-between gap-3 mt-6">
                  <button type="button" onClick={back} className={ghostBtnClass}>
                    ← ফিরে যাও
                  </button>
                  <button type="button" onClick={submit} disabled={busy} className={primaryBtnClass}>
                    ভর্তি সম্পন্ন করো ✓
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:sticky lg:top-24 bg-white border-2 border-ink rounded-2xl shadow-sticker overflow-hidden">
            <div className="bg-purple text-white px-4.5 py-3.5 font-display font-bold text-[15px]">
              অর্ডার সামারি
            </div>
            <div className="p-4.5">
              <div className="flex gap-3">
                <div className="shrink-0 w-14 h-14 rounded-[10px] bg-[repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB_7px,#E1E2F3_7px,#E1E2F3_14px)] border-[1.5px] border-ink" />
                <div>
                  <div className="font-display font-bold text-[15.5px] leading-tight">{item.title}</div>
                  <div className="text-[12.5px] text-ink/55">{itemSubLabel}</div>
                </div>
              </div>
              <div className="border-t border-dashed border-ink/20 my-4" />
              <div className="flex justify-between text-[14.5px] mb-2">
                <span className="text-ink/65">কোর্স ফি</span>
                <span>{toBnTaka(oldNum)}</span>
              </div>
              {baseDiscount > 0 && (
                <div className="flex justify-between text-[14.5px] mb-2">
                  <span className="text-ink/65">ছাড়</span>
                  <span className="text-success">− {toBnTaka(baseDiscount)}</span>
                </div>
              )}
              {coupon && (
                <div className="flex justify-between text-[14.5px] mb-2">
                  <span className="text-ink/65">কুপন ({coupon})</span>
                  <span className="text-success">− {toBnTaka(couponOff)}</span>
                </div>
              )}
              <div className="border-t-2 border-ink my-3" />
              <div className="flex justify-between items-baseline">
                <span className="font-display font-bold">সর্বমোট</span>
                <span className="font-display font-extrabold text-2xl">{toBnTaka(total)}</span>
              </div>
              {payNow < total && (
                <div className="flex justify-between text-[14.5px] mt-2">
                  <span className="text-ink/65">এখন দিতে হবে</span>
                  <span className="font-bold">{toBnTaka(payNow)}</span>
                </div>
              )}

              {price === 0 ? null : !coupon ? (
                <>
                  <div className="flex gap-2 mt-4">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="কুপন কোড"
                      className="flex-1 min-w-0 font-body text-sm px-3 py-2.25 border-2 border-ink rounded-[10px] shadow-sticker-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={busy}
                      className="font-display font-bold text-sm px-4 py-2.25 bg-ink text-white border-2 border-ink rounded-[10px] cursor-pointer"
                    >
                      প্রয়োগ
                    </button>
                  </div>
                  {couponMsg && <div className="text-[12.5px] text-red mt-1.5">{couponMsg}</div>}
                </>
              ) : (
                <div className="flex items-center gap-1.5 mt-3.5 bg-success/10 text-success rounded-[10px] px-3 py-2.25 text-[13.5px] font-semibold">
                  ✓ কুপন প্রয়োগ হয়েছে
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="fixed right-5.5 bottom-5.5 z-[130]">
        <SupportChat />
      </div>
    </div>
  );
}
