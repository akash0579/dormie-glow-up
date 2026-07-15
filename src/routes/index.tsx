import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import dormBefore from "@/assets/dorm-before.jpg";
import dormAfter from "@/assets/dorm-after.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

// --- analytics stub ------------------------------------------------------
function track(event: string, props?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("[dormie:event]", event, props ?? {});
  }
}

// --- primitives ----------------------------------------------------------
function StickerChip({
  children,
  tone = "cream",
  className = "",
  float = false,
}: {
  children: ReactNode;
  tone?: "cream" | "lime" | "lilac" | "dark" | "peach";
  className?: string;
  float?: boolean;
}) {
  const tones: Record<string, string> = {
    cream: "bg-[#F5F0E8] text-[#0F0F11]",
    lime: "bg-[#D8FF4F] text-[#0F0F11]",
    lilac: "bg-[#C7B5FF] text-[#0F0F11]",
    dark: "bg-[#0F0F11] text-[#F2F1EA] ring-1 ring-white/15",
    peach: "bg-[#FFB39B] text-[#0F0F11]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-tight shadow-[0_6px_14px_-6px_rgba(0,0,0,0.6)] ${tones[tone]} ${float ? "animate-float" : ""} ${className}`}
    >
      {children}
    </span>
  );
}

function PrimaryCTA({
  children,
  onClick,
  size = "md",
  className = "",
  as = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  size?: "md" | "lg";
  className?: string;
  as?: "button" | "a";
}) {
  const Comp: any = as;
  const sizeCls = size === "lg" ? "px-7 py-4 text-base" : "px-6 py-3.5 text-sm";
  return (
    <Comp
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-full bg-lime text-[#0F0F11] font-semibold ${sizeCls} animate-pulse-glow transition active:scale-[0.97] ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute top-0 h-full w-1/3 bg-white/40 blur-md animate-shine" />
      </span>
      <span className="relative">{children}</span>
    </Comp>
  );
}

function SecondaryCTA({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-ink hover:bg-white/[0.06] transition active:scale-[0.97] ${className}`}
    >
      {children}
    </button>
  );
}

// --- Before/After slider -------------------------------------------------
function HeroRevealCard({ onCTA }: { onCTA: () => void }) {
  const [pos, setPos] = useState(20);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setPos(52); return; }
    const start = performance.now();
    const dur = 2400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      // ease: 20 -> 80 -> 52
      const eased = p < 0.5 ? 20 + (80 - 20) * (p / 0.5) : 80 + (52 - 80) * ((p - 0.5) / 0.5);
      setPos(eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const move = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(4, Math.min(96, p)));
  };

  return (
    <div className="relative rounded-[28px] bg-cream p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
      <div
        ref={wrapRef}
        onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onMouseDown={(e) => move(e.clientX)}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl select-none touch-none"
      >
        {/* After (base) */}
        <img
          src={dormAfter}
          alt="Styled dorm room after dormie"
          className="absolute inset-0 h-full w-full object-cover"
          width={768}
          height={1024}
        />
        {/* Before (clipped) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={dormBefore}
            alt="Plain dorm room before dormie"
            className="absolute inset-0 h-full w-full object-cover"
            width={768}
            height={1024}
          />
        </div>

        {/* labels */}
        <div className="absolute left-3 top-3">
          <StickerChip tone="cream">BEFORE</StickerChip>
        </div>
        <div className="absolute right-3 top-3">
          <StickerChip tone="dark">AFTER</StickerChip>
        </div>

        {/* floating chips */}
        <div className="absolute left-3 top-14">
          <StickerChip tone="lilac" float>no nails · no paint</StickerChip>
        </div>
        <div className="absolute right-3 top-14">
          <StickerChip tone="lime" float>to this ✦</StickerChip>
        </div>

        {/* drag line */}
        <div
          className="pointer-events-none absolute inset-y-0 w-[2px] bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
          style={{ left: `${pos}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white text-[#0F0F11] shadow-lg"
          style={{ left: `${pos}%` }}
        >
          <span className="text-sm">↔</span>
        </div>

        {/* drag hint */}
        <div className="absolute bottom-3 left-3">
          <StickerChip tone="cream" className="font-mono">drag the line ↔</StickerChip>
        </div>
      </div>

      {/* footer strip */}
      <div className="flex items-center justify-between px-2 pt-3 pb-1">
        <div className="text-[15px] font-semibold text-[#0F0F11]">the golden hour look</div>
        <div className="font-mono text-[11px] text-[#0F0F11]/60">14 pieces · $365 · shoppable</div>
      </div>

      {/* CTA row overlaid below */}
      <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-[#0F0F11] p-3 ring-1 ring-white/10">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">the deal</div>
          <div className="text-sm font-semibold text-ink">your room, ai-styled</div>
        </div>
        <button
          onClick={onCTA}
          className="shrink-0 rounded-full bg-lime px-4 py-2 text-xs font-bold text-[#0F0F11]"
        >
          3 free →
        </button>
      </div>
    </div>
  );
}

// --- vibe / step / share / plan cards -----------------------------------
type Vibe = { key: string; title: string; sub: string; grad: string };
const VIBES: Vibe[] = [
  { key: "cozy", title: "cozy szn", sub: "a room that hugs back.", grad: "from-[#3a2618] to-[#1a0f08]" },
  { key: "golden", title: "golden hour", sub: "that 6pm glow, but all day.", grad: "from-[#6b4a1e] to-[#2a1a08]" },
  { key: "locked", title: "locked in", sub: "deep focus. door closed. grind glow.", grad: "from-[#1e2733] to-[#0a0f16]" },
  { key: "main", title: "main character era", sub: "romanticize the room. lead role.", grad: "from-[#5a2e3d] to-[#1e1015]" },
  { key: "soft", title: "soft era", sub: "gentle everything. bows, blush, quiet.", grad: "from-[#5c3947] to-[#2a1a1f]" },
  { key: "yap", title: "yap den", sub: "built for the debrief.", grad: "from-[#3d2a4d] to-[#160f1e]" },
  { key: "old", title: "old money", sub: "quiet-luxury heirloom energy.", grad: "from-[#2a3524] to-[#0f150c]" },
  { key: "delulu", title: "delulu", sub: "dream big. decorate bigger.", grad: "from-[#5e2a55] to-[#1e0e1c]" },
];

function VibeCard({ vibe, selected, onClick }: { vibe: Vibe; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${vibe.grad} p-4 text-left ring-1 transition active:scale-[0.97] ${
        selected ? "ring-2 ring-lime shadow-[0_0_30px_-8px_rgba(216,255,79,0.6)]" : "ring-white/10 hover:ring-white/25"
      }`}
    >
      <div className="aspect-[4/3] w-full rounded-xl bg-black/30 mb-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,179,155,0.4),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(216,255,79,0.2),transparent_60%)]" />
      </div>
      {selected && (
        <div className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-lime text-[#0F0F11]">
          <span className="text-xs font-bold">✓</span>
        </div>
      )}
      <div className="text-[15px] font-bold text-ink">{vibe.title}</div>
      <div className="mt-0.5 text-xs text-ink-muted">{vibe.sub}</div>
    </button>
  );
}

function StepCard({ n, total = "4", title, body, tone = "dark" }: { n: string; total?: string; title: string; body: string; tone?: "dark" | "lilac" | "cream" }) {
  const isLilac = tone === "lilac";
  const isCream = tone === "cream";
  return (
    <div className={`relative rounded-3xl p-5 ring-1 ${isCream ? "bg-cream text-[#0F0F11] ring-lime/40" : isLilac ? "bg-gradient-to-br from-lilac/25 to-card ring-lilac/40" : "bg-card ring-white/10"}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-full font-mono text-xs font-bold text-[#0F0F11] ${isCream ? "bg-lime" : isLilac ? "bg-lilac" : "bg-lime"}`}>
          {n}
        </span>
        <span className={`font-mono text-[10px] uppercase tracking-widest ${isCream ? "text-black/50" : "text-ink-dim"}`}>step {n} / {total}</span>
        {(isCream || isLilac) && <span className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0F0F11] ${isCream ? "bg-lime" : "bg-lilac"}`}>the payoff</span>}
      </div>
      <div className={`text-lg font-bold ${isCream ? "text-[#0F0F11]" : "text-ink"}`}>{title}</div>
      <div className={`mt-1 text-sm ${isCream ? "text-black/70" : "text-ink-muted"}`}>{body}</div>
    </div>
  );
}

function ShareCard({ tag, title, body, tone }: { tag: string; title: string; body: string; tone: "lime" | "lilac" | "peach" }) {
  const toneCls: Record<string, string> = {
    lime: "bg-lime text-[#0F0F11]",
    lilac: "bg-lilac text-[#0F0F11]",
    peach: "bg-peach text-[#0F0F11]",
  };
  return (
    <div className="rounded-3xl bg-card p-4 ring-1 ring-white/10">
      <div className="relative aspect-[9/12] overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a1a10] to-[#0f0806]">
        <img src={dormAfter} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" loading="lazy" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
        <div className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold ${toneCls[tone]}`}>{tag}</div>
        <div className="absolute inset-x-3 bottom-3">
          <div className="text-sm font-bold text-white">{title}</div>
          <div className="mt-0.5 text-[11px] text-white/70">{body}</div>
        </div>
      </div>
    </div>
  );
}

// --- Start modal ---------------------------------------------------------
function StartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-end sm:place-items-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[28px] bg-card ring-1 ring-white/10 p-5 grain"
      >
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest text-lime">3 of 3 free · 1st needs no signup</div>
          <button onClick={onClose} className="text-ink-muted text-lg">×</button>
        </div>
        <h3 className="mt-2 font-display text-2xl font-bold leading-tight">let's see your room.</h3>
        <p className="mt-1 text-sm text-ink-muted">first design is free. no signup. no app.</p>

        <button
          onClick={() => { track("upload_room_clicked"); onClose(); }}
          className="mt-5 w-full rounded-2xl bg-lime p-5 text-left text-[#0F0F11] active:scale-[0.98] transition"
        >
          <div className="text-base font-bold">drop the room pic ↑</div>
          <div className="text-xs opacity-70">snap it or upload from camera roll</div>
        </button>

        <button
          onClick={() => { track("demo_room_clicked"); onClose(); }}
          className="mt-3 w-full rounded-2xl bg-white/[0.04] ring-1 ring-white/15 p-5 text-left active:scale-[0.98] transition"
        >
          <div className="text-base font-bold text-ink">use demo room →</div>
          <div className="text-xs text-ink-muted">no pic yet? try it on our room first</div>
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-ink-dim">
          <span>no nails</span><span>·</span><span>no paint</span><span>·</span><span>roomie-safe</span>
        </div>
      </div>
    </div>
  );
}

// --- Sticky bottom CTA ---------------------------------------------------
function StickyMobileCTA({ onOpen }: { onOpen: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 pointer-events-none px-3 pb-3 transition-all duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="pointer-events-auto mx-auto max-w-md rounded-full bg-[#18181B]/95 backdrop-blur ring-1 ring-white/15 p-1.5 pl-4 flex items-center justify-between shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)]">
        <div>
          <div className="text-[13px] font-bold text-ink leading-none">3 free designs</div>
          <div className="mt-0.5 text-[10px] text-ink-dim leading-none">first one, no signup</div>
        </div>
        <button
          onClick={() => { track("sticky_cta_clicked"); onOpen(); }}
          className="rounded-full bg-lime px-5 py-3 text-sm font-bold text-[#0F0F11] active:scale-[0.97]"
        >
          see my room →
        </button>
      </div>
    </div>
  );
}

// --- Sections ------------------------------------------------------------
function TopBar({ onOpen }: { onOpen: () => void }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-bg/80 border-b border-white/5">
      <div className="mx-auto max-w-md md:max-w-6xl px-4 md:px-8 h-12 md:h-16 flex items-center justify-between">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-display text-lg md:text-2xl font-extrabold text-lime lowercase leading-none">dormie</span>
          <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-ink-dim truncate">by reimaginehome ai</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <span className="hidden xs:inline md:hidden font-mono text-[9px] uppercase tracking-widest text-ink-dim">bts szn · 39d</span>
          <span className="rounded-full bg-lime/15 ring-1 ring-lime/40 px-2.5 py-1 text-[10px] md:text-[11px] font-bold text-lime">
            <span className="text-lime">3</span> free
          </span>
          <button
            onClick={() => { track("hero_cta_clicked", { section: "topbar" }); onOpen(); }}
            className="hidden md:inline-flex items-center gap-1 rounded-full bg-lime px-4 py-2 text-xs font-bold text-[#0F0F11] active:scale-95 transition"
          >
            see my room →
          </button>
        </div>
      </div>
    </header>
  );
}

function Marquee() {
  const items = ["shop it", "move in", "repeat", "design it", "shop it", "move in", "repeat", "design it"];
  return (
    <div className="overflow-hidden border-y border-white/5 py-2 bg-black/40">
      <div className="flex gap-6 animate-marquee whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-6">
            <span>{t}</span><span className="text-lime">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="relative px-4 md:px-8 pt-6 md:pt-12 pb-10 md:pb-20 grain">
      <div className="mx-auto max-w-md md:max-w-6xl md:grid md:grid-cols-2 md:gap-14 md:items-center">
        <div>
          <div className="flex md:justify-start justify-center">
            <StickerChip tone="dark" className="font-mono">back to school szn · 39 days out</StickerChip>
          </div>
          <h1 className="mt-4 text-center md:text-left font-display text-[42px] md:text-[76px] leading-[0.95] font-extrabold tracking-tight lowercase">
            your dorm,<br />
            <span className="text-lime">but it ate.</span>
          </h1>
          <p className="mt-3 md:mt-5 text-center md:text-left text-[15px] md:text-[18px] leading-snug text-ink-muted md:max-w-[46ch]">
            one pic of your actual room → styled around the furniture you're stuck with. first design is free. no signup.
          </p>

          <div className="mt-4 md:mt-6 flex flex-wrap justify-center md:justify-start gap-1.5">
            <StickerChip tone="lime">3 free designs</StickerChip>
            <StickerChip tone="dark">first one, no signup</StickerChip>
            <StickerChip tone="lilac">registry-ready</StickerChip>
            <StickerChip tone="peach">Amazon-ready bundles</StickerChip>
            <StickerChip tone="cream">real product links</StickerChip>
          </div>

          <div className="md:hidden mt-6">
            <HeroRevealCard onCTA={onOpen} />
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center items-stretch gap-3">
            <PrimaryCTA size="lg" onClick={() => { track("hero_cta_clicked"); onOpen(); }}>
              see my room →
            </PrimaryCTA>
            <SecondaryCTA onClick={() => { track("demo_room_clicked"); onOpen(); }}>
              use demo room
            </SecondaryCTA>
          </div>
          <p className="mt-3 text-center md:text-left text-[11px] md:text-[12px] text-ink-dim md:max-w-[52ch]">
            first, see the room. then turn it into a registry, shopping list, or Amazon-ready cart.
          </p>
        </div>

        <div className="hidden md:block">
          <HeroRevealCard onCTA={onOpen} />
        </div>
      </div>
    </section>
  );
}

function ProblemSection({ onOpen }: { onOpen: () => void }) {
  const cards = [
    { t: "the furniture stays", b: "we work around the school bed, desk, dresser, and chair." },
    { t: "your room is not a showroom", b: "small, weird lighting, random carpet, cinderblock walls. still workable." },
    { t: "don't buy first, regret later", b: "see the vibe before the cart gets expensive." },
  ];
  return (
    <section className="px-4 md:px-8 py-14 md:py-24">
      <div className="mx-auto max-w-md md:max-w-6xl">
        <div className="md:max-w-3xl">
          <h2 className="font-display text-3xl md:text-5xl leading-tight font-extrabold lowercase">
            pinterest doesn't know your dorm.
          </h2>
          <p className="mt-3 md:mt-4 text-[15px] md:text-[17px] text-ink-muted">
            your feed is cute. your room is tiny. the bed, desk, dresser, and chair probably have to stay. dormie designs around the room you actually got.
          </p>
        </div>
        <div className="mt-6 md:mt-10 grid gap-3 md:gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.t} className="rounded-2xl bg-card p-4 md:p-6 ring-1 ring-white/10">
              <div className="text-[15px] md:text-lg font-bold text-ink">{c.t}</div>
              <div className="mt-1 md:mt-2 text-[13px] md:text-[14px] text-ink-muted">{c.b}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 md:mt-10 flex justify-center">
          <PrimaryCTA onClick={() => { track("hero_cta_clicked", { section: "problem" }); onOpen(); }}>
            try my room free
          </PrimaryCTA>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="px-4 md:px-8 py-14 md:py-24 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="mx-auto max-w-md md:max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">how it works</p>
        <h2 className="mt-1 font-display text-3xl md:text-5xl leading-tight font-extrabold lowercase md:max-w-3xl">
          three taps. then the reveal. then the plan.
        </h2>
        <div className="mt-6 md:mt-10 grid gap-3 md:gap-4 md:grid-cols-4">
          <StepCard n="1" title="drop the room pic" body="snap it, upload it, or use the demo room." />
          <StepCard n="2" title="pick the energy" body="cozy szn, golden hour, locked in, soft era, or type your own." />
          <StepCard n="3" title="see the glow-up" body="get the before/after, remix the room, and send it to the group chat." />
          <StepCard n="4" tone="cream" title="build the registry + cart" body="set the budget, add your ZIP, get real product links, and turn eligible Amazon bundles into an Amazon cart." />
        </div>
        <div className="mt-6 md:mt-10 flex justify-center">
          <PrimaryCTA onClick={() => { track("hero_cta_clicked", { section: "how" }); onOpen(); }}>
            start with my first free design
          </PrimaryCTA>
        </div>
      </div>
    </section>
  );
}

function VibePicker({ onOpen }: { onOpen: () => void }) {
  const [selected, setSelected] = useState<string[]>(["golden", "cozy"]);
  const toggle = (k: string) => {
    track("vibe_card_clicked", { vibe: k });
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : s.length < 3 ? [...s, k] : s));
  };
  return (
    <section className="px-4 md:px-8 py-14 md:py-24">
      <div className="mx-auto max-w-md md:max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">step 3 / 4 · saves to your profile</p>
        <h2 className="mt-1 font-display text-3xl md:text-5xl leading-tight font-extrabold lowercase md:max-w-3xl">
          pick the energy. not the furniture.
        </h2>
        <p className="mt-2 md:mt-3 text-[14px] md:text-[17px] text-ink-muted">
          the school stuff stays. the vibe is yours. up to three.
        </p>
        <div className="mt-5 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {VIBES.map((v) => (
            <VibeCard key={v.key} vibe={v} selected={selected.includes(v.key)} onClick={() => toggle(v.key)} />
          ))}
        </div>
        <div className="mt-4 md:mt-6 md:flex md:gap-3 md:items-center">
          <input
            placeholder="or type it — 'coquette but navy'"
            className="w-full md:flex-1 rounded-full bg-white/[0.04] ring-1 ring-white/10 px-5 py-3.5 text-sm text-ink placeholder:text-ink-dim outline-none focus:ring-lime/60"
          />
          <PrimaryCTA className="mt-3 md:mt-0 w-full md:w-auto" onClick={() => { track("hero_cta_clicked", { section: "vibe" }); onOpen(); }}>
            cook it →
          </PrimaryCTA>
        </div>
      </div>
    </section>
  );
}

function ShoppingKitSection({ onOpen }: { onOpen: () => void }) {
  const budgets = ["$150", "$300", "$500", "custom"];
  const [budget, setBudget] = useState("$300");
  const [zip, setZip] = useState("78705");
  const items = [
    { t: "twin xl comforter", p: "$49", tag: "ships to your ZIP", tone: "lime" as const },
    { t: "washable rug", p: "$55", tag: "dorm-safe", tone: "lilac" as const },
    { t: "clip-on desk lamp", p: "$19", tag: "budget-friendly", tone: "peach" as const },
    { t: "command strips", p: "$13", tag: "no nails", tone: "lime" as const },
    { t: "under-bed bins", p: "$26", tag: "check stock before buying", tone: "cream" as const },
  ];
  const total = items.reduce((s, i) => s + parseInt(i.p.slice(1)), 0);
  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-md">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">the practical payoff</p>
        <h2 className="mt-1 font-display text-3xl leading-tight font-extrabold lowercase">
          build the shopping kit, then turn it into a registry.
        </h2>
        <p className="mt-2 text-[14px] text-ink-muted">
          real product links become your dorm registry. pick a budget, add your ZIP, and turn the look into a shoppable kit people can claim from.
        </p>

        <div className="mt-5 rounded-3xl bg-card p-4 ring-1 ring-white/10">
          {/* budget chips */}
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">budget</div>
            <div className="rounded-full bg-lime/15 ring-1 ring-lime/40 px-2.5 py-0.5 text-[10px] font-bold text-lime">this look: ${total}</div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => { setBudget(b); track("budget_selected", { budget: b }); }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-[0.97] ${
                  budget === b ? "bg-lime text-[#0F0F11]" : "bg-white/[0.05] ring-1 ring-white/15 text-ink hover:bg-white/[0.08]"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* ZIP */}
          <div className="mt-4">
            <label className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">ship to ZIP</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-full bg-white/[0.04] ring-1 ring-lime/40 focus-within:ring-lime px-4 py-2.5">
              <span className="text-ink-dim text-sm">📍</span>
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
                inputMode="numeric"
                placeholder="78705"
                className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-dim outline-none"
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-lime">ZIP-aware</span>
            </div>
          </div>

          {/* product list */}
          <div className="mt-4 space-y-2">
            {items.map((i) => (
              <div key={i.t} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] ring-1 ring-white/10 p-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02] ring-1 ring-white/10" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-ink truncate">{i.t}</div>
                  <div className="mt-0.5">
                    <StickerChip tone={i.tone} className="!px-2 !py-0.5 !text-[9px]">{i.tag}</StickerChip>
                  </div>
                </div>
                <div className="font-mono text-[13px] font-bold text-ink">{i.p}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { track("build_shopping_kit_clicked", { budget, zip }); onOpen(); }}
            className="mt-4 w-full rounded-full bg-lime px-5 py-3.5 text-sm font-bold text-[#0F0F11] active:scale-[0.98] transition"
          >
            build my shopping kit →
          </button>
          <p className="mt-3 text-center text-[10px] leading-relaxed text-ink-dim">
            we prioritize products that can ship to your ZIP. always confirm final availability at checkout.
          </p>
        </div>

        {/* budget hook */}
        <div className="mt-6 rounded-3xl bg-gradient-to-br from-peach/15 to-card ring-1 ring-peach/30 p-5">
          <h3 className="font-display text-xl font-extrabold lowercase text-ink">
            set the budget <span className="text-peach">before the registry gets chaotic.</span>
          </h3>
          <p className="mt-2 text-[13px] text-ink-muted">
            pick a spend range and dormie builds the room around it. cute is good. a registry that spirals is not.
          </p>
        </div>

        <p className="mt-4 text-center text-[11px] text-ink-dim">
          product links and shipping availability can change. dormie helps you plan faster — final price and availability are confirmed by the store.
        </p>
      </div>
    </section>
  );
}

function RegistrySection({ onOpen }: { onOpen: () => void }) {
  const studentItems = [
    { t: "washable 5x7 rug", p: "$36" },
    { t: "warm led string lights", p: "$9" },
    { t: "clip-on desk lamp", p: "$12" },
    { t: "peel-and-stick wall panels", p: "$18" },
    { t: "under-bed storage bins", p: "$17" },
    { t: "throw blanket", p: "$13" },
  ];
  const familyItems = [
    "washable 5x7 rug",
    "warm led string lights",
    "clip-on desk lamp",
    "command strips mega pack",
  ];
  return (
    <section className="px-4 py-14 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="mx-auto max-w-md">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">the registry payoff</p>
        <h2 className="mt-1 font-display text-3xl leading-tight font-extrabold lowercase">
          make the registry claimable.
        </h2>
        <p className="mt-2 text-[14px] text-ink-muted">
          turn your final dorm plan into a budgeted registry across brands. send it to family, friends, or your roommate so people can claim what they're covering.
        </p>

        {/* student card */}
        <div className="mt-5 rounded-3xl bg-card p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="font-display text-lg font-extrabold lowercase text-ink">the gift math.</div>
            <span className="rounded-full bg-lime/15 ring-1 ring-lime/40 px-2.5 py-0.5 text-[10px] font-bold text-lime">16 spots open</span>
          </div>
          <div className="mt-3 rounded-2xl bg-white/[0.03] ring-1 ring-white/10 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">covered</div>
            <div className="mt-1 font-display text-3xl font-extrabold text-ink">$0 <span className="text-ink-dim text-lg font-medium">of $145</span></div>
            <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-0 rounded-full bg-lime" />
            </div>
          </div>
          <p className="mt-3 text-[13px] text-ink-muted">
            share the registry. family claims items. claimed ones lock so nobody double-buys.
          </p>
          <div className="mt-4 space-y-2">
            {studentItems.map((i) => (
              <div key={i.t} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] ring-1 ring-white/10 p-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02] ring-1 ring-white/10" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-ink truncate">{i.t}</div>
                </div>
                <div className="font-mono text-[13px] font-bold text-ink">{i.p}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { track("finish_registry_clicked"); onOpen(); }}
            className="mt-4 w-full rounded-full bg-lime px-5 py-3.5 text-sm font-bold text-[#0F0F11] active:scale-[0.98] transition"
          >
            finish the registry — 16 spots open →
          </button>
        </div>

        {/* family/shared view card */}
        <div className="mt-5 rounded-3xl bg-cream p-5 text-[#0F0F11] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-between">
            <div className="font-display text-lg font-extrabold lowercase text-[#0F0F11]">their dorm registry, planned to the dollar</div>
            <span className="rounded-full bg-[#0F0F11] px-2.5 py-0.5 text-[10px] font-bold text-lime">shareable</span>
          </div>
          <div className="mt-3 rounded-2xl bg-black/5 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-black/50">covered</div>
            <div className="mt-1 font-display text-3xl font-extrabold text-[#0F0F11]">$0 <span className="text-black/50 text-lg font-medium">of $145</span></div>
            <div className="mt-2 h-2 w-full rounded-full bg-black/10 overflow-hidden">
              <div className="h-full w-0 rounded-full bg-lime" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {familyItems.map((t) => (
              <button
                key={t}
                onClick={() => { track("registry_item_claimed", { item: t }); }}
                className="w-full flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-black/10 active:scale-[0.98] transition"
              >
                <span className="text-[13px] font-semibold text-[#0F0F11]">{t}</span>
                <span className="text-[13px] font-bold text-[#0F0F11]">claim this →</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-[10px] leading-relaxed text-black/50">
            no account needed. dormie sells nothing — the store handles the purchase. the registry just keeps everyone from double-buying.
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-black/50">
            claiming an item keeps the Dormie registry organized. final checkout happens with the store. prices and availability can change — always confirm at checkout.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <PrimaryCTA className="w-full" onClick={() => { track("hero_cta_clicked", { section: "registry" }); onOpen(); }}>
            make my dorm registry
          </PrimaryCTA>
          <SecondaryCTA className="w-full" onClick={() => { track("share_registry_clicked", { section: "registry" }); onOpen(); }}>
            share the registry
          </SecondaryCTA>
        </div>
      </div>
    </section>
  );
}

function ShareSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-md">
        <h2 className="font-display text-3xl leading-tight font-extrabold lowercase">
          built for the group chat.
        </h2>
        <p className="mt-2 text-[14px] text-ink-muted">
          brag card, vote card, roommate check, mom view. same room, different audience.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <ShareCard tag="brag time" tone="lime" title="okay it ate." body="vertical card for tiktok + stories" />
          </div>
          <ShareCard tag="roommate check" tone="lilac" title="wait this is cute" body="before they buy the wrong lamp" />
          <ShareCard tag="mom view" tone="peach" title="the practical version" body="room + budget + list" />
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <PrimaryCTA className="w-full" onClick={() => { track("hero_cta_clicked", { section: "share" }); onOpen(); }}>
            make my share card
          </PrimaryCTA>
          <p className="text-center text-[11px] text-ink-dim">
            your first share has a dormie watermark. pass removes it.
          </p>
        </div>
      </div>
    </section>
  );
}

function RoommateSection({ onOpen }: { onOpen: () => void }) {
  const msgs = [
    { me: false, t: "wait this is actually cute" },
    { me: true, t: "can we do golden hour?" },
    { me: false, t: "send me the list" },
    { me: true, t: "fine, no neon sign" },
  ];
  return (
    <section className="px-4 py-14 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="mx-auto max-w-md">
        <h2 className="font-display text-3xl leading-tight font-extrabold lowercase">
          send this before your roommate buys ugly stuff.
        </h2>
        <p className="mt-2 text-[14px] text-ink-muted">
          match the vibe before move-in. split ideas, vote on looks, and avoid the two-people-one-room disaster.
        </p>
        <div className="mt-5 rounded-3xl bg-card p-4 ring-1 ring-white/10">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim mb-3">roomie · today</div>
          <div className="space-y-2">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] ${
                    m.me ? "bg-lime text-[#0F0F11] rounded-br-md" : "bg-white/[0.06] text-ink rounded-bl-md"
                  }`}
                >
                  {m.t}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <PrimaryCTA className="w-full" onClick={() => { track("roommate_cta_clicked"); onOpen(); }}>
            send to roommate
          </PrimaryCTA>
          <SecondaryCTA className="w-full" onClick={() => { track("hero_cta_clicked", { section: "roommate" }); onOpen(); }}>
            design my side first
          </SecondaryCTA>
        </div>
      </div>
    </section>
  );
}

function ParentSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-md">
        <h2 className="font-display text-3xl leading-tight font-extrabold lowercase">
          the version for whoever's paying.
        </h2>
        <p className="mt-2 text-[14px] text-ink-muted">
          send home the practical view: the room, the budget, the registry, and the product links. no 19 random texts. no mystery cart.
        </p>

        <div className="mt-5 rounded-3xl bg-cream p-5 text-[#0F0F11] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-widest text-black/50">room summary — for parent</div>
            <span className="rounded-full bg-[#0F0F11] px-2.5 py-0.5 text-[10px] font-bold text-lime">$24 once</span>
          </div>
          <div className="mt-3 aspect-[16/10] rounded-xl overflow-hidden">
            <img src={dormAfter} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <dl className="mt-4 divide-y divide-black/10 text-sm">
            {[
              ["estimated total", "$365"],
              ["budget selected", "$300–$400"],
              ["registry progress", "$0 of $145 covered"],
              ["ships to", "ZIP 78705 · prioritized"],
              ["shopping kit", "14 pieces, 3 stores"],
              ["claim/sponsor items", "family can claim what they cover"],
              ["subscription", "none"],
              ["auto-renew", "off"],
              ["season pass", "$24 once"],
              ["season access", "until sep 7"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2">
                <dt className="text-black/60">{k}</dt>
                <dd className="font-semibold text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[10px] leading-relaxed text-black/50">
            claiming an item keeps the Dormie registry organized. final checkout happens with the store. prices and availability can change — always confirm at checkout.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <PrimaryCTA className="w-full" onClick={() => { track("parent_cta_clicked"); onOpen(); }}>
            send mom the registry
          </PrimaryCTA>
          <SecondaryCTA className="w-full" onClick={() => { track("share_registry_clicked"); onOpen(); }}>
            share the dorm registry
          </SecondaryCTA>
          <p className="text-center text-[11px] text-ink-dim">
            student gets the fun version. parent gets the practical one.
          </p>
        </div>
      </div>
    </section>
  );
}

function FreeVsPassCard({
  kind,
  title,
  price,
  features,
  ctaLabel,
  onClick,
}: {
  kind: "free" | "pass";
  title: string;
  price: string;
  features: string[];
  ctaLabel: string;
  onClick: () => void;
}) {
  const isPass = kind === "pass";
  return (
    <div
      className={`rounded-3xl p-5 ring-1 ${
        isPass ? "bg-gradient-to-b from-lilac/20 to-card ring-lilac/40" : "bg-card ring-white/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-ink lowercase">{title}</div>
        {isPass && <span className="rounded-full bg-lilac px-2.5 py-0.5 text-[10px] font-bold text-[#0F0F11]">season pass</span>}
      </div>
      <div className={`mt-2 font-display text-3xl font-extrabold ${isPass ? "text-lilac" : "text-lime"}`}>
        {price}
      </div>
      <ul className="mt-4 space-y-2 text-[13px] text-ink-muted">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className={isPass ? "text-lilac" : "text-lime"}>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        className={`mt-5 w-full rounded-full py-3 text-sm font-bold active:scale-[0.98] transition ${
          isPass ? "bg-lilac text-[#0F0F11]" : "bg-lime text-[#0F0F11]"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

function PricingSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-md">
        <h2 className="font-display text-3xl leading-tight font-extrabold lowercase">
          free gets you the look. <span className="text-lilac">pass gets you the registry people can help with.</span>
        </h2>
        <p className="mt-2 text-[14px] text-ink-muted">
          try it free. go pass if you're actually moving in and want the full registry.
        </p>
        <div className="mt-6 grid gap-4">
          <FreeVsPassCard
            kind="free"
            title="free"
            price="$0"
            features={[
              "3 free designs",
              "first design without signup",
              "basic share card",
              "basic registry preview",
              "watermarked result",
            ]}
            ctaLabel="start free"
            onClick={() => { track("hero_cta_clicked", { section: "pricing-free" }); onOpen(); }}
          />
          <FreeVsPassCard
            kind="pass"
            title="season pass"
            price="$24 once"
            features={[
              "unlimited designs",
              "hd / no watermark",
              "real-product renders",
              "full dorm registry",
              "cross-brand product links",
              "family claim links",
              "budget tracking",
              "duplicate-buy prevention",
              "dupe finder",
              "restyles until sep 7",
              "$24 once",
              "no subscription",
              "no auto-renew",
            ]}
            ctaLabel="cover the season"
            onClick={() => { track("pass_cta_clicked"); onOpen(); }}
          />
        </div>
      </div>
    </section>
  );
}

function TrustSection({ onOpen }: { onOpen: () => void }) {
  const cards = [
    { t: "school furniture stays", b: "we design around what you can't remove." },
    { t: "damage-aware ideas", b: "no nails, no paint, renter/dorm-safe thinking." },
    { t: "real products, not fantasy furniture", b: "turn the look into links you can actually buy, with budget and ZIP filters." },
    { t: "budget first", b: "choose a spend range before the list gets out of hand." },
    { t: "ZIP-aware", b: "add where you're moving and we'll prioritize products that can ship there." },
    { t: "no app install", b: "works on mobile web." },
    { t: "first design free", b: "no signup until after the first result." },
  ];
  return (
    <section className="px-4 py-14 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="mx-auto max-w-md">
        <h2 className="font-display text-3xl leading-tight font-extrabold lowercase">
          not a fake showroom render.
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {cards.map((c, i) => (
            <div
              key={c.t}
              className={`rounded-2xl bg-card p-4 ring-1 ring-white/10 ${i === cards.length - 1 && cards.length % 2 === 1 ? "col-span-2" : ""}`}
            >
              <div className="text-[13px] font-bold text-ink">{c.t}</div>
              <div className="mt-1 text-[11px] text-ink-muted">{c.b}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <PrimaryCTA onClick={() => { track("hero_cta_clicked", { section: "trust" }); onOpen(); }}>
            drop the room pic
          </PrimaryCTA>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="px-4 pt-14 pb-28">
      <div className="mx-auto max-w-md text-center">
        <h2 className="font-display text-4xl leading-[0.95] font-extrabold lowercase">
          move-in is coming.<br />
          <span className="text-lime">make the room make sense.</span>
        </h2>
        <p className="mt-4 text-[15px] text-ink-muted">
          first design is free. no signup. design the room, build the registry, send the plan.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <PrimaryCTA size="lg" onClick={() => { track("hero_cta_clicked", { section: "final" }); onOpen(); }}>
            see my room →
          </PrimaryCTA>
          <SecondaryCTA onClick={() => { track("demo_room_clicked", { section: "final" }); onOpen(); }}>
            use demo room
          </SecondaryCTA>
          <p className="mt-2 text-[11px] text-ink-dim">
            3 free designs · dorm registry · $24 once for the full season
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-10 text-center">
      <div className="font-display text-xl font-extrabold text-lime lowercase">dormie</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-dim">by reimaginehome ai</div>
      <div className="mt-3 text-[11px] text-ink-dim">© {new Date().getFullYear()} · built for back-to-school szn</div>
    </footer>
  );
}

// --- Page ---------------------------------------------------------------
function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  return (
    <div className="min-h-screen bg-bg text-ink">
      <TopBar onOpen={open} />
      <Marquee />
      <Hero onOpen={open} />
      <ProblemSection onOpen={open} />
      <HowItWorks onOpen={open} />
      <VibePicker onOpen={open} />
      <ShoppingKitSection onOpen={open} />
      <RegistrySection onOpen={open} />
      <ShareSection onOpen={open} />
      <RoommateSection onOpen={open} />
      <ParentSection onOpen={open} />
      <PricingSection onOpen={open} />
      <TrustSection onOpen={open} />
      <FinalCTA onOpen={open} />
      <Footer />
      <StickyMobileCTA onOpen={open} />
      <StartModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
