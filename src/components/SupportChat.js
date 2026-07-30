"use client";

import { useEffect, useRef, useState } from "react";
import useOfflineHours from "@/hooks/useOfflineHours";

const PERSONA = "রিয়া আপু";

const FLOWS = {
  admission: {
    label: "ভর্তি কীভাবে করব?",
    text:
      "ভর্তি তিন ধাপে হয়ে যায় —\n১) আপনার ব্যাচ বা স্কিল কোর্স বেছে নিন\n২) ফর্মে নাম-ফোন দিয়ে bKash/Nagad-এ Send Money করুন\n৩) TrxID জমা দিন — ২৪ ঘণ্টার মধ্যে ক্লাসের অ্যাক্সেস আর গ্রুপ লিংক পেয়ে যাবেন।",
    href: "/academic",
    hrefLabel: "ব্যাচগুলো দেখুন →",
    next: ["fee", "guardian", "human"],
  },
  fee: {
    label: "ফি কত? পেমেন্ট কীভাবে?",
    text:
      "একাডেমিক ডিপ্লোমা ব্যাচ — ৳২,৫০০ (নিয়মিত ৳৩,৫০০)।\nস্কিল কোর্স — Spoken English ৳১,৫০০ · Public Speaking ৳১,২০০ · IELTS ৳৩,০০০।\nbKash বা Nagad-এ Send Money করে TrxID দিলেই হবে। দুই কিস্তিতেও দেওয়া যায় — প্রথম কিস্তি ভর্তির সময়, দ্বিতীয়টি ২১ দিনের মধ্যে।",
    href: "/enroll",
    hrefLabel: "ভর্তির ফর্ম →",
    next: ["refund", "admission", "human"],
  },
  tech: {
    label: "লগইন বা ভিডিওর সমস্যা",
    text:
      "দুঃখিত, দেখি ঠিক করে দিই —\n• লগইন হচ্ছে না → ফোন নম্বর দিয়ে \"পাসওয়ার্ড রিসেট\" দিন, OTP আসবে\n• ভিডিও আটকাচ্ছে → কোয়ালিটি ৪৮০p করে দিন, ডেটাও কম লাগবে\n• অ্যাপে ক্লাস দেখাচ্ছে না → একবার অ্যাপ আপডেট দিয়ে লগআউট-লগইন করুন\nএখনও না হলে স্ক্রিনশটসহ লিখুন, টেক টিমকে ধরিয়ে দিচ্ছি।",
    next: ["human", "fee"],
  },
  refund: {
    label: "রিফান্ড ও রিপ্লেসমেন্ট",
    text:
      "প্রথম ৩টি লাইভ ক্লাসের মধ্যে ভালো না লাগলে পুরো টাকা ফেরত — কোনো প্রশ্ন করব না।\nব্যাচ মিস করলে পরের ব্যাচে একবার বিনামূল্যে রিপ্লেসমেন্ট।\nরিফান্ড আপনার bKash/Nagad নম্বরে ৫ কর্মদিবসের মধ্যে চলে যায়।",
    next: ["admission", "human"],
  },
  guardian: {
    label: "অভিভাবক হিসেবে জানতে চাই",
    text:
      "ভালো লাগল আপনি খোঁজ নিচ্ছেন। অভিভাবকের নম্বরে প্রতি সপ্তাহে সন্তানের উপস্থিতি ও পরীক্ষার রিপোর্ট SMS-এ যায়, ক্লাস রেকর্ডিং আপনিও দেখতে পারবেন, আর মাসে একবার অভিভাবক-শিক্ষক অনলাইন মিটিং হয়।",
    href: "/contact",
    hrefLabel: "হেল্পলাইন ও যোগাযোগ →",
    next: ["fee", "human"],
  },
  human: { label: "মানুষের সাথে কথা বলব", human: true },
};

const FALLBACK =
  "ঠিক ধরতে পারলাম না — এটা সরাসরি কথা বললে দ্রুত সমাধান হবে। হেল্পলাইন ০১৭১১-১২৩৪৫৬ (সকাল ১০টা – রাত ১০টা), অথবা নিচে নাম-নম্বর দিন, আমরাই কল দেব।";

let uid = 0;

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [chips, setChips] = useState([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [lead, setLead] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadMsg, setLeadMsg] = useState("");
  const [leadErr, setLeadErr] = useState(false);
  const offline = useOfflineHours();
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, lead, chips]);

  const push = (m) =>
    setMsgs((prev) => [...prev, { id: ++uid, isBot: !m.isUser, isUser: !!m.isUser, ...m }]);

  const greet = () =>
    offline
      ? `আসসালামু আলাইকুম! আমি ${PERSONA}। এখন হেল্পলাইনের সময় শেষ (সকাল ১০টা – রাত ১০টা), তবু নিচের উত্তরগুলো এখনই পড়তে পারেন — আর নম্বর রেখে গেলে সকালেই কল দেব।`
      : `আসসালামু আলাইকুম! আমি ${PERSONA} — School of GenZ-এর অ্যাডমিশন হেল্প। কী জানতে চান? নিচের যেকোনোটায় চাপ দিন, বা নিজের ভাষায় লিখুন।`;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    setHover(false);
    if (next && msgs.length === 0) {
      setTimeout(() => {
        push({ text: greet() });
        setChips(["admission", "fee", "tech", "refund", "guardian"]);
      }, 220);
    }
  };

  const pick = (key) => {
    const f = FLOWS[key];
    if (!f) return;
    push({ isUser: true, text: f.label });
    setChips([]);
    setLead(false);
    if (f.human) {
      setTimeout(() => {
        push({
          text:
            "অবশ্যই। নাম আর ফোন নম্বরটা রেখে যান — " +
            (offline ? "সকাল ১০টার পরপরই" : "সাধারণত ১০ মিনিটের মধ্যে") +
            " কাউন্সেলর কল দেবেন।",
        });
        setLead(true);
      }, 420);
      return;
    }
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      push({ text: f.text, href: f.href, hrefLabel: f.hrefLabel });
      setChips(f.next || ["human"]);
    }, 560);
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const send = () => {
    const q = draft.trim();
    if (!q || typing) return;
    push({ isUser: true, text: q });
    setDraft("");
    setChips([]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      push({ text: FALLBACK });
      setChips(["admission", "fee", "human"]);
    }, 560);
  };

  const submitLead = () => {
    const n = leadName.trim();
    const p = leadPhone.trim();
    if (n.length < 2) {
      setLeadMsg("নামটা লিখুন।");
      setLeadErr(true);
      return;
    }
    if (!/^[০-৯0-9\s\-+]{9,}$/.test(p)) {
      setLeadMsg("সঠিক ফোন নম্বর দিন।");
      setLeadErr(true);
      return;
    }
    setLead(false);
    setLeadMsg("");
    setLeadErr(false);
    push({ isUser: true, text: `${n} · ${p}` });
    setTimeout(() => {
      push({
        text:
          `ধন্যবাদ ${n}! নম্বরটা কাউন্সেলরের কাছে চলে গেছে — ` +
          (offline ? "সকাল ১০টার পর" : "অল্প সময়ের মধ্যেই") +
          " কল পাবেন। এর মধ্যে ব্যাচগুলো দেখে রাখতে পারেন।",
        href: "/academic",
        hrefLabel: "ব্যাচ দেখুন →",
      });
      setChips(["fee", "guardian"]);
    }, 480);
  };

  const showLead = lead;
  const hasChips = chips.length > 0 && !typing;

  return (
    <div className="font-body text-ink leading-normal flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(364px,calc(100vw-40px))] h-[min(556px,calc(100vh-150px))] bg-white border-2 border-ink rounded-[20px] shadow-sticker-lg flex flex-col overflow-hidden animate-chat-in">
          <div className="bg-ink text-white px-4 py-3.5 flex items-center gap-2.75 shrink-0">
            <span className="w-10 h-10 rounded-full bg-gold text-ink border-2 border-white grid place-items-center font-display font-extrabold text-[17px] shrink-0">
              রি
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-base leading-tight">{PERSONA}</div>
              <div className="flex items-center gap-1.5 text-[12.5px] text-white/70">
                <span
                  className="w-1.75 h-1.75 rounded-full shrink-0"
                  style={{ background: offline ? "#FFC226" : "#3BD97F" }}
                />
                {offline ? "এখন অফলাইন · সকাল ১০টায় ফিরছি" : "অনলাইন · সাধারণত ৫ মিনিটে উত্তর"}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="বন্ধ করুন"
              className="w-7.5 h-7.5 rounded-[9px] bg-white/13 border border-white/25 text-white text-base leading-none cursor-pointer shrink-0 hover:bg-white/26"
            >
              ✕
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3.5 pt-4 pb-1.5 bg-cloud flex flex-col gap-2.5"
          >
            {msgs.map((m) => (
              <div key={m.id}>
                {m.isBot && (
                  <div className="flex gap-2 items-end">
                    <span className="w-6.5 h-6.5 rounded-full bg-gold border-[1.5px] border-ink grid place-items-center font-display font-extrabold text-[11px] shrink-0 mb-0.5">
                      রি
                    </span>
                    <div className="max-w-65 bg-white border-[1.5px] border-ink/14 rounded-tl-[14px] rounded-tr-[14px] rounded-br-[14px] rounded-bl-[4px] px-3 py-2.5 text-[14.5px] whitespace-pre-line shadow-[0_1px_2px_rgba(34,27,94,0.06)]">
                      {m.text}
                    </div>
                  </div>
                )}
                {m.isUser && (
                  <div className="flex justify-end">
                    <div className="max-w-62.5 bg-purple text-white rounded-tl-[14px] rounded-tr-[14px] rounded-bl-[14px] rounded-br-[4px] px-3 py-2.5 text-[14.5px] whitespace-pre-line">
                      {m.text}
                    </div>
                  </div>
                )}
                {m.href && (
                  <a
                    href={m.href}
                    className="inline-flex items-center gap-1.5 mt-2 ml-8.5 px-3.5 py-2 bg-gold text-ink border-2 border-ink rounded-full shadow-sticker-sm font-display font-bold text-[13.5px] no-underline hover:-translate-x-px hover:-translate-y-px hover:shadow-sticker transition-[transform,box-shadow]"
                  >
                    {m.hrefLabel}
                  </a>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex gap-2 items-end">
                <span className="w-6.5 h-6.5 rounded-full bg-gold border-[1.5px] border-ink grid place-items-center font-display font-extrabold text-[11px] shrink-0">
                  রি
                </span>
                <div className="bg-white border-[1.5px] border-ink/14 rounded-tl-[14px] rounded-tr-[14px] rounded-br-[14px] rounded-bl-[4px] px-3.5 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink animate-chat-dot" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-ink animate-chat-dot"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-ink animate-chat-dot"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </div>
            )}

            {showLead && (
              <div className="bg-white border-2 border-ink rounded-[14px] p-3.5 ml-8.5 shadow-[2px_2px_0_0_rgba(34,27,94,0.18)]">
                <div className="font-display font-bold text-[15px] mb-0.5">
                  নাম আর নম্বরটা দিন
                </div>
                <div className="text-[13px] text-ink/60 mb-2.75">
                  {offline ? "হেল্পলাইন এখন বন্ধ — সকালেই কল দেব।" : "সাধারণত ১০ মিনিটের মধ্যে কল আসে।"}
                </div>
                <input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="w-full px-3 py-2.5 mb-2 border-[1.5px] border-ink/25 rounded-[10px] font-body text-sm text-ink outline-none focus:border-purple"
                />
                <input
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="ফোন নম্বর (০১৭…)"
                  className="w-full px-3 py-2.5 mb-2.5 border-[1.5px] border-ink/25 rounded-[10px] font-body text-sm text-ink outline-none focus:border-purple"
                />
                <button
                  onClick={submitLead}
                  className="w-full py-2.75 bg-purple text-white border-2 border-ink rounded-[10px] shadow-sticker-sm font-display font-bold text-[14.5px] cursor-pointer hover:-translate-x-px hover:-translate-y-px hover:shadow-sticker transition-[transform,box-shadow]"
                >
                  কল ব্যাক চাই
                </button>
                <div
                  className="text-xs mt-2"
                  style={{ color: leadErr ? "#EE5A5A" : "rgba(34,27,94,.55)" }}
                >
                  {leadMsg}
                </div>
              </div>
            )}

            {hasChips && (
              <div className="flex flex-wrap gap-1.75 mt-0.5 mb-2 ml-8.5">
                {chips.map((k) => (
                  <button
                    key={k}
                    onClick={() => pick(k)}
                    className="px-3.25 py-2 bg-white border-[1.5px] border-purple rounded-full text-purple font-semibold text-[13.5px] cursor-pointer text-left hover:bg-purple hover:text-white"
                  >
                    {FLOWS[k].label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 border-t-[1.5px] border-ink/12 bg-white">
            <div className="flex gap-1.5 px-3 pt-2.25">
              <a
                href="https://m.me/schoolofgenz"
                target="_blank"
                rel="noopener"
                className="flex-1 text-center py-1.75 rounded-lg bg-[#0084ff]/10 text-[#0068CC] text-[12.5px] font-semibold no-underline hover:bg-[#0084ff]/20"
              >
                Messenger
              </a>
              <a
                href="https://wa.me/8801812345678"
                target="_blank"
                rel="noopener"
                className="flex-1 text-center py-1.75 rounded-lg bg-[#25D366]/13 text-[#0F8A3C] text-[12.5px] font-semibold no-underline hover:bg-[#25D366]/24"
              >
                WhatsApp
              </a>
              <a
                href="tel:+8801711123456"
                className="flex-1 text-center py-1.75 rounded-lg bg-lavender text-purple text-[12.5px] font-semibold no-underline hover:bg-purple/16"
              >
                কল দিন
              </a>
            </div>
            <div className="flex gap-2 items-end px-3 pt-2.25 pb-2.75">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder="নিজের ভাষায় প্রশ্ন লিখুন…"
                className="flex-1 resize-none max-h-20 px-3 py-2.5 border-[1.5px] border-ink/22 rounded-xl font-body text-sm text-ink outline-none leading-normal focus:border-purple"
              />
              <button
                onClick={send}
                aria-label="পাঠান"
                className="w-10 h-10 shrink-0 rounded-[11px] bg-ink text-white border-none cursor-pointer grid place-items-center hover:bg-purple"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2 11 13" />
                  <path d="M22 2 15 22l-4-9-9-4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="flex items-center gap-2.5"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && !open && (
          <span className="bg-white border-2 border-ink rounded-full shadow-sticker px-3.75 py-2 font-display font-bold text-sm whitespace-nowrap animate-chat-in">
            সাহায্য দরকার?
          </span>
        )}
        <button
          onClick={toggle}
          aria-label="সাপোর্ট চ্যাট"
          className="w-14.5 h-14.5 shrink-0 rounded-full bg-purple text-white border-2 border-ink shadow-sticker grid place-items-center cursor-pointer transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-sticker-sm"
        >
          {open ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
