"use client";

import { useEffect, useRef } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { toBn } from "@/lib/bn";

const PINS = [
  { n: "ঢাকা", c: "৯২০+", lat: 23.81, lng: 90.41, photo: true },
  { n: "চট্টগ্রাম", c: "৫৪০+", lat: 22.36, lng: 91.78, photo: true },
  { n: "রাজশাহী", c: "৪৮০+", lat: 24.37, lng: 88.6, photo: true },
  { n: "খুলনা", c: "৩১০+", lat: 22.85, lng: 89.54 },
  { n: "সিলেট", c: "২২০+", lat: 24.9, lng: 91.87 },
  { n: "বরিশাল", c: "১৭০+", lat: 22.7, lng: 90.37 },
  { n: "রংপুর", c: "২৬০+", lat: 25.75, lng: 89.24 },
  { n: "ময়মনসিংহ", c: "২৪০+", lat: 24.75, lng: 90.4 },
  { n: "কুমিল্লা", c: "১৯০+", lat: 23.46, lng: 91.18 },
  { n: "বগুড়া", c: "১৫০+", lat: 24.85, lng: 89.37 },
  { n: "যশোর", c: "১৩০+", lat: 23.17, lng: 89.21 },
  { n: "কক্সবাজার", c: "৯০+", lat: 21.44, lng: 91.97 },
  { n: "দিনাজপুর", c: "১১০+", lat: 25.63, lng: 88.64 },
  { n: "ফরিদপুর", c: "৮০+", lat: 23.6, lng: 89.84 },
  { n: "টাঙ্গাইল", c: "১২০+", lat: 24.25, lng: 89.92 },
  { n: "পাবনা", c: "১০০+", lat: 24.0, lng: 89.24 },
];

function runCounter(el, end, suffix, toBnFn) {
  const dur = 1600;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    const v = Math.floor((1 - Math.pow(1 - k, 3)) * end);
    el.textContent = toBnFn(v.toLocaleString("en-US")) + suffix;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function MapSection() {
  const mapRef = useRef(null);
  const studRef = useRef(null);
  const distRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const studTarget = studRef.current;
    if (reduced) {
      if (studTarget) studTarget.textContent = toBn((5200).toLocaleString("en-US")) + "+";
      if (distRef.current) distRef.current.textContent = toBn(48);
    } else if (studTarget) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              runCounter(studRef.current, 5200, "+", toBn);
              runCounter(distRef.current, 48, "", toBn);
              io.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      io.observe(studTarget);
    }
  }, []);

  useEffect(() => {
    const host = mapRef.current;
    if (!host) return;
    let cancelled = false;
    const w = host.clientWidth || 460;
    const h = host.clientHeight || 500;

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries);
        const bd =
          fc.features.find((f) => String(f.id) === "050") ||
          fc.features.find((f) => f.properties && f.properties.name === "Bangladesh");
        if (!bd) throw new Error("BD not found");
        const proj = geoMercator().fitExtent(
          [
            [16, 16],
            [w - 16, h - 16],
          ],
          bd
        );
        const path = geoPath(proj);
        host.innerHTML = "";
        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        svg.style.display = "block";
        const bg = document.createElementNS(NS, "rect");
        bg.setAttribute("width", String(w));
        bg.setAttribute("height", String(h));
        bg.setAttribute("fill", "#EEEFFB");
        svg.appendChild(bg);
        const shape = document.createElementNS(NS, "path");
        shape.setAttribute("d", path(bd));
        shape.setAttribute("fill", "#fff");
        shape.setAttribute("stroke", "#221B5E");
        shape.setAttribute("stroke-width", "2");
        shape.setAttribute("stroke-linejoin", "round");
        svg.appendChild(shape);
        host.appendChild(svg);

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        PINS.forEach((pin, i) => {
          const xy = proj([pin.lng, pin.lat]);
          if (!xy) return;
          const dot = document.createElement("div");
          dot.title = pin.n + " · " + pin.c;
          dot.style.cssText = `position:absolute;left:${xy[0]}px;top:${xy[1]}px;transform:translate(-50%,-100%) scale(0);transform-origin:bottom center;transition:transform .4s cubic-bezier(.34,1.56,.64,1) ${i * 45}ms;z-index:${pin.photo ? 3 : 2};cursor:pointer;`;
          if (pin.photo) {
            dot.innerHTML =
              '<div style="width:34px;height:34px;border-radius:50%;background:repeating-linear-gradient(45deg,#EEEFFB,#EEEFFB 5px,#E1E2F3 5px,#E1E2F3 10px);border:2px solid #221B5E;box-shadow:2px 2px 0 0 #221B5E;"></div><div style="position:absolute;left:50%;top:100%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid #221B5E;"></div>';
          } else {
            dot.innerHTML =
              '<div style="width:14px;height:14px;border-radius:50%;background:#5B2EE5;border:2px solid #221B5E;box-shadow:1px 1px 0 0 #221B5E;"></div>';
          }
          const tip = document.createElement("div");
          tip.textContent = pin.n + " · " + pin.c;
          tip.style.cssText =
            "position:absolute;left:50%;bottom:calc(100% + 6px);transform:translateX(-50%);background:#221B5E;color:#fff;font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s;";
          dot.appendChild(tip);
          dot.addEventListener("mouseenter", () => (tip.style.opacity = "1"));
          dot.addEventListener("mouseleave", () => (tip.style.opacity = "0"));
          host.appendChild(dot);
          if (reduced) dot.style.transition = "none";
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              dot.style.transform = "translate(-50%,-100%) scale(1)";
            })
          );
        });
      })
      .catch(() => {
        if (cancelled) return;
        host.innerHTML =
          '<div style="position:absolute;inset:0;display:grid;place-items:center;color:rgba(34,27,94,.4);font-family:ui-monospace,monospace;font-size:12px;">MAP · Bangladesh</div>';
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h2 className="font-display font-extrabold text-[clamp(24px,3vw,34px)]">সারা দেশে আমাদের শিক্ষার্থী</h2>
      <div className="flex gap-6.5 my-4 mb-5">
        <div>
          <div ref={studRef} className="font-display font-extrabold text-[clamp(30px,4vw,44px)] text-purple leading-none">
            ৫,২০০+
          </div>
          <div className="text-sm text-ink/60">শিক্ষার্থী</div>
        </div>
        <div>
          <div ref={distRef} className="font-display font-extrabold text-[clamp(30px,4vw,44px)] text-purple leading-none">
            ৪৮
          </div>
          <div className="text-sm text-ink/60">জেলা</div>
        </div>
      </div>
      <div
        ref={mapRef}
        className="relative w-full bg-white border-2 border-ink rounded-2xl shadow-sticker overflow-hidden"
        style={{ aspectRatio: "4/4.4" }}
      />
      <div className="text-[12.5px] text-ink/45 mt-2 italic">
        ⚠️ ডেমো সংখ্যা — আসল ডেটা দিয়ে বদলাতে হবে।
      </div>
    </div>
  );
}
