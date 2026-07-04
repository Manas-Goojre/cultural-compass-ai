const GLYPHS = [
  { icon: "✈️", top: "12%", left: "6%", size: "4rem", delay: "0s" },
  { icon: "🧭", top: "68%", left: "4%", size: "3.5rem", delay: "-2s" },
  { icon: "🗺️", top: "22%", left: "88%", size: "4.5rem", delay: "-4s" },
  { icon: "🧳", top: "78%", left: "90%", size: "3.5rem", delay: "-1s" },
  { icon: "⛩️", top: "48%", left: "94%", size: "3rem", delay: "-3s" },
  { icon: "🏔️", top: "85%", left: "46%", size: "4rem", delay: "-5s" },
];

export default function TravelBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path className="flight-path" d="M -50 220 C 300 40, 700 400, 1100 120 S 1600 260, 1900 80" />
        <path className="flight-path" style={{ animationDelay: "-8s", opacity: 0.6 }} d="M -50 520 C 400 620, 800 300, 1200 560 S 1700 420, 1950 620" />
      </svg>
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className="travel-glyph animate-float"
          style={{ top: g.top, left: g.left, fontSize: g.size, animationDelay: g.delay }}
        >
          {g.icon}
        </span>
      ))}
    </div>
  );
}
