"use client";

export default function Marquee({ items, renderItem, direction = "left", durationSec = 40, className = "" }) {
  const doubled = items.concat(items);
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="overflow-hidden">
      <div
        data-marquee
        className={`inline-flex ${animClass} hover:[animation-play-state:paused] ${className}`}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {doubled.map((item, i) => renderItem(item, i))}
      </div>
    </div>
  );
}
