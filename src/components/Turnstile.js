"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
/** Whether the form has a check to wait for. With no key set there is none, and the API checks nothing either. */
export const HAS_CAPTCHA = !!SITE_KEY;

/**
 * Cloudflare's "are you a person" box. `onToken` gets the answer to send with the form, and "" when it
 * expires. An answer works once: change `key` to draw a fresh box after a failed attempt.
 */
export default function Turnstile({ onToken }) {
  const box = useRef(null);
  const widget = useRef(null);
  const tell = useRef(onToken);
  useEffect(() => {
    tell.current = onToken;
  });

  const draw = () => {
    if (!box.current || widget.current !== null || !window.turnstile) return;
    widget.current = window.turnstile.render(box.current, {
      sitekey: SITE_KEY,
      callback: (token) => tell.current(token),
      "expired-callback": () => tell.current(""),
      "error-callback": () => tell.current(""),
    });
  };

  useEffect(() => {
    draw();
    return () => {
      if (widget.current !== null && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, []);

  if (!SITE_KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={draw} />
      <div ref={box} className="mt-4" />
    </>
  );
}
