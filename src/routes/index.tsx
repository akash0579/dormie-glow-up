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
      className={`fixed inset-x-0 bottom-0 z-40 pointer-events-none px-3 pb-3 transition-all duration-300 ${
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
function TopBar() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-bg/80 border-b border-white/5">
      <div className="mx-auto max-w-md px-4 h-12 flex items-center justify-between">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-display text-lg font-extrabold text-lime lowercase leading-none">dormie</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-ink-dim truncate">by reimaginehome ai</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden xs:inline font-mono text-[9px] uppercase tracking-widest text-ink-dim">bts szn · 39d</span>
          <span className="rounded-full bg-lime/15 ring-1 ring-lime/40 px-2.5 py-1 text-[10px] font-bold text-lime">
            <span className="text-lime">3</span> free
          </span>
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
    <section className="relative px-4 pt-6 pb-10 grain">
      <div className="mx-auto max-w-md">
        <div className="flex justify-center">
          <StickerChip tone="dark" className="font-mono">back to school szn · 39 days out</StickerChip>
        </div>
        <h1 className="mt-4 text-center font-display text-[42px] leading-[0.95] font-extrabold tracking-tight lowercase">
          your dorm,<br />
          <span className="text-lime">but it ate.</span>
        </h1>
        <p className="mt-3 text-center text-[15px] leading-snug text-ink-muted">
          one pic of your actual room → styled around the furniture you're stuck with. first design is free. no signup.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          <StickerChip tone="lilac">budget + ZIP</StickerChip>
          <StickerChip tone="lime">one-tap or mixed brands</StickerChip>
          <StickerChip tone="cream">room → registry → cart</StickerChip>
        </div>

        <div className="mt-6">
          <HeroRevealCard onCTA={onOpen} />
        </div>

        <div className="mt-6 flex flex-col items-stretch gap-3">
          <PrimaryCTA size="lg" onClick={() => { track("hero_cta_clicked"); onOpen(); }}>
            see my room →
          </PrimaryCTA>
          <SecondaryCTA onClick={() => { track("demo_room_clicked"); onOpen(); }}>
            use demo room
          </SecondaryCTA>
          <p className="text-center text-[12px] text-ink-muted">
            then turn the room into a budgeted registry with real products, one-tap carts, and family claiming.
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionTransition() {
  return (
    <section className="px-4 pt-2 pb-1">
      <div className="mx-auto max-w-md md:max-w-2xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
          the reveal is the fun part. <span className="text-lime">this is how the room actually happens.</span>
        </p>
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
    <section className="px-4 py-14">
      <div className="mx-auto max-w-md">
        <h2 className="font-display text-3xl leading-tight font-extrabold lowercase">
          pinterest doesn't know your dorm.
        </h2>
        <p className="mt-3 text-[15px] text-ink-muted">
          your feed is cute. your room is tiny. the bed, desk, dresser, and chair probably have to stay. dormie designs around the room you actually got.
        </p>
        <div className="mt-6 space-y-3">
          {cards.map((c) => (
            <div key={c.t} className="rounded-2xl bg-card p-4 ring-1 ring-white/10">
              <div className="text-[15px] font-bold text-ink">{c.t}</div>
              <div className="mt-1 text-[13px] text-ink-muted">{c.b}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
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
    <section className="px-4 py-14 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="mx-auto max-w-md">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">how it works</p>
        <h2 className="mt-1 font-display text-3xl leading-tight font-extrabold lowercase">
          three taps. then the reveal. then the registry.
        </h2>
        <div className="mt-6 space-y-3">
          <StepCard n="1" title="drop the room pic" body="snap it, upload it, or use the demo room." />
          <StepCard n="2" title="pick the energy" body="cozy szn, golden hour, locked in, soft era, or type your own." />
          <StepCard n="3" title="see the glow-up" body="before/after reveal, edits, share card, roommate check." />
          <StepCard n="4" tone="cream" title="build + share the registry" body="set the budget and ZIP, choose Amazon, Walmart, or mixed brands, then decide what you'll buy and what friends or family can claim." />
        </div>
        <div className="mt-6 flex justify-center">
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
    <section className="px-4 py-14">
      <div className="mx-auto max-w-md">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">step 3 / 4 · saves to your profile</p>
        <h2 className="mt-1 font-display text-3xl leading-tight font-extrabold lowercase">
          pick the energy. not the furniture.
        </h2>
        <p className="mt-2 text-[14px] text-ink-muted">
          the school stuff stays. the vibe is yours. up to three.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {VIBES.map((v) => (
            <VibeCard key={v.key} vibe={v} selected={selected.includes(v.key)} onClick={() => toggle(v.key)} />
          ))}
        </div>
        <input
          placeholder="or type it — 'coquette but navy'"
          className="mt-4 w-full rounded-full bg-white/[0.04] ring-1 ring-white/10 px-5 py-3.5 text-sm text-ink placeholder:text-ink-dim outline-none focus:ring-lime/60"
        />
        <div className="mt-5">
          <PrimaryCTA className="w-full" onClick={() => { track("hero_cta_clicked", { section: "vibe" }); onOpen(); }}>
            cook it →
          </PrimaryCTA>
        </div>
      </div>
    </section>
  );
}

// --- Combined registry + shopping section -------------------------------
type ShopMode = "amazon" | "walmart" | "mixed";
type ItemState = "gift" | "self" | "claimed";
type RegistryItem = {
  id: string;
  cat: string;
  name: string;
  price: number;
  merchant: { amazon: string; walmart: string; mixed: string };
  claimedBy?: string;
};

const REGISTRY_BASE: RegistryItem[] = [
  { id: "comforter", cat: "comforter", name: "twin xl comforter set", price: 49, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "Amazon" } },
  { id: "rug", cat: "rug", name: "washable 5x7 rug", price: 55, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "Walmart" } },
  { id: "lights", cat: "string lights", name: "warm led string lights", price: 12, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "Amazon" } },
  { id: "lamp", cat: "desk lamp", name: "clip-on desk lamp", price: 19, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "Target" } },
  { id: "wall", cat: "wall decor", name: "peel-and-stick wall panels", price: 24, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "Target" } },
  { id: "bins", cat: "under-bed bins", name: "under-bed storage bins", price: 26, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "IKEA" } },
  { id: "throw", cat: "throw blanket", name: "throw blanket", price: 26, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "IKEA" } },
  { id: "strips", cat: "command strips", name: "command strips mega pack", price: 13, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "Amazon" } },
];

const merchantColor = (m: string) => {
  if (m === "Amazon") return "bg-[#FF9900]/15 text-[#FFB84D] ring-[#FF9900]/40";
  if (m === "Walmart") return "bg-[#0071DC]/15 text-[#5AB0FF] ring-[#0071DC]/40";
  if (m === "Target") return "bg-[#CC0000]/15 text-[#FF6E6E] ring-[#CC0000]/40";
  if (m === "IKEA") return "bg-[#FFDA1A]/15 text-[#FFE875] ring-[#FFDA1A]/40";
  return "bg-white/10 text-ink ring-white/20";
};

function RegistryShopSection({ onOpen }: { onOpen: () => void }) {
  const [budget, setBudget] = useState<string>("$300");
  const [zip, setZip] = useState("78705");
  const [mode, setMode] = useState<ShopMode>("mixed");
  const [items, setItems] = useState<Array<RegistryItem & { state: ItemState }>>(
    () => REGISTRY_BASE.map((i) => ({ ...i, state: "gift" }))
  );

  useEffect(() => { track("combined_registry_section_viewed"); }, []);

  const budgets = ["$150", "$300", "$500", "custom $420"];
  const total = items.reduce((s, i) => s + i.price, 0);
  const covered = items.filter((i) => i.state === "claimed").reduce((s, i) => s + i.price, 0);
  const handled = items.filter((i) => i.state === "claimed" || i.state === "self").length;
  const leftToBuy = items.filter((i) => i.state !== "claimed").reduce((s, i) => s + i.price, 0);
  const openCount = items.filter((i) => i.state === "gift").length;
  const pct = Math.round((covered / total) * 100);

  const modeLabel = mode === "amazon" ? "amazon one-tap" : mode === "walmart" ? "walmart one-tap" : "mixed brands";
  const modeHeading = mode === "amazon" ? "the amazon registry." : mode === "walmart" ? "the walmart registry." : "the mixed-brand registry.";
  const cartCTA =
    mode === "amazon" ? "add unclaimed items to your amazon cart" :
    mode === "walmart" ? "add unclaimed items to your walmart cart" :
    "open the remaining product links";
  const buildCTA = `build the registry — ${budget.replace("custom ", "")} · ${modeLabel} →`;

  const cycleState = (id: string) => {
    setItems((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      const next: ItemState = i.state === "gift" ? "self" : i.state === "self" ? "gift" : "gift";
      track(next === "self" ? "item_marked_self_buy" : "item_marked_gift", { id });
      return { ...i, state: next };
    }));
  };
  const claim = (id: string) => {
    setItems((prev) => prev.map((i) => {
      if (i.id !== id || i.state === "claimed") return i;
      track("registry_item_claimed", { id });
      return { ...i, state: "claimed", claimedBy: "mom" };
    }));
  };
  const swap = (id: string) => { track("product_swap_clicked", { id }); };
  const remove = (id: string) => {
    track("product_removed", { id });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <section className="px-4 py-14 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="mx-auto max-w-md md:max-w-6xl">
        <div className="md:mx-auto md:max-w-2xl md:text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">the practical payoff</p>
          <h2 className="mt-1 font-display text-3xl md:text-5xl leading-tight font-extrabold lowercase">
            design the room. <span className="text-lime">price the registry.</span>
          </h2>
          <p className="mt-2 text-[14px] md:text-[15px] text-ink-muted">
            set the budget, add the ZIP, and turn the final room into a shoppable registry. buy the items yourself, or share the link so friends and family can claim what they're covering.
          </p>
        </div>

        {/* Desktop 2-col: controls left, live registry right */}
        <div className="mt-6 grid gap-4 lg:grid-cols-5">

          {/* ============ STAGE 1 — PRICE THE REGISTRY ============ */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl bg-card p-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">stage 1</div>
                  <h3 className="mt-0.5 font-display text-xl font-extrabold lowercase text-ink">price the registry.</h3>
                </div>
                <span className="rounded-full bg-lime/15 ring-1 ring-lime/40 px-2.5 py-0.5 text-[10px] font-bold text-lime">this room: ${total}</span>
              </div>
              <p className="mt-1 text-[12px] text-ink-muted">
                what it costs, where it checks out, and where it needs to ship.
              </p>

              {/* budget */}
              <div className="mt-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">the budget.</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      onClick={() => { setBudget(b); track("budget_selected", { budget: b }); }}
                      className={`rounded-full px-3.5 py-2 text-xs font-bold transition active:scale-[0.97] ${
                        budget === b ? "bg-lime text-[#0F0F11] shadow-[0_0_20px_-6px_rgba(216,255,79,0.7)]" : "bg-white/[0.05] ring-1 ring-white/15 text-ink hover:bg-white/[0.08]"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* checkout style */}
              <div className="mt-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">the checkout style.</div>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {([
                    { k: "amazon", t: "amazon one-tap", d: "eligible Amazon items land together in your Amazon cart.", accent: "ring-[#FF9900]/50" },
                    { k: "walmart", t: "walmart one-tap", d: "eligible Walmart items land together in your Walmart cart.", accent: "ring-[#0071DC]/50" },
                    { k: "mixed", t: "mixed brands", d: "best pick for each item across Amazon, Walmart, Target, IKEA + more. each item opens with its store.", accent: "ring-lilac/50" },
                  ] as const).map((opt) => {
                    const active = mode === opt.k;
                    return (
                      <button
                        key={opt.k}
                        onClick={() => { setMode(opt.k); track(`${opt.k}_${opt.k === "mixed" ? "brands" : "one_tap"}_selected`); }}
                        className={`text-left rounded-2xl p-3 ring-1 transition active:scale-[0.98] ${
                          active ? `bg-white/[0.06] ${opt.accent} ring-2` : "bg-white/[0.03] ring-white/10 hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-[13px] font-bold text-ink lowercase">{opt.t}</div>
                          {active && <span className="grid h-5 w-5 place-items-center rounded-full bg-lime text-[#0F0F11] text-[10px] font-bold">✓</span>}
                        </div>
                        <div className="mt-1 text-[11px] text-ink-muted">{opt.d}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[10px] text-ink-dim">
                  this changes where you check out, not the room we design. swap any item later.
                </p>
              </div>

              {/* ZIP */}
              <div className="mt-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">ship to ZIP</div>
                <div className="mt-1.5 flex items-center gap-2 rounded-full bg-white/[0.04] ring-1 ring-lime/40 focus-within:ring-lime px-4 py-2.5">
                  <span className="text-ink-dim text-sm">📍</span>
                  <input
                    value={zip}
                    onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 5); setZip(v); track("zip_entered", { zip: v }); }}
                    inputMode="numeric"
                    placeholder="78705"
                    className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-dim outline-none"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-lime">ZIP-aware</span>
                </div>
                <p className="mt-2 text-[11px] text-ink-muted">
                  Dormie uses the budget and ZIP to prioritize products relevant to the room and location.
                </p>
              </div>

              <button
                onClick={() => { track("registry_created", { budget, zip, mode }); onOpen(); }}
                className="mt-5 w-full rounded-full bg-lime px-5 py-3.5 text-sm font-bold text-[#0F0F11] active:scale-[0.98] transition animate-pulse-glow"
              >
                {buildCTA}
              </button>
            </div>

            <p className="text-center text-[10px] leading-relaxed text-ink-dim px-2">
              amazon for speed. walmart for value. mixed brands for choice.
            </p>
          </div>

          {/* ============ STAGE 2 — BUILD THE REGISTRY ============ */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-3xl bg-card p-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">stage 2 · live registry</div>
                  <h3 className="mt-0.5 font-display text-xl font-extrabold lowercase text-ink">{modeHeading}</h3>
                </div>
                <span className={`rounded-full ring-1 px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  mode === "amazon" ? "bg-[#FF9900]/15 text-[#FFB84D] ring-[#FF9900]/40" :
                  mode === "walmart" ? "bg-[#0071DC]/15 text-[#5AB0FF] ring-[#0071DC]/40" :
                  "bg-lilac/15 text-lilac ring-lilac/40"
                }`}>{modeLabel}</span>
              </div>
              <p className="mt-1 text-[12px] text-ink-muted">
                one registry for the whole room — gifts check items off, you buy the rest.
              </p>

              {/* gift math */}
              <div className="mt-4 rounded-2xl bg-white/[0.03] ring-1 ring-white/10 p-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">the gift math</div>
                    <div className="mt-1 font-display text-2xl font-extrabold text-ink">${covered} <span className="text-ink-dim text-base font-medium">of ${total} covered</span></div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">left to buy</div>
                    <div className="mt-1 font-display text-2xl font-extrabold text-lime">${leftToBuy}</div>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-lime transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted">
                  <span>{handled} of {items.length} handled</span>
                  <span>{openCount} open for gifts</span>
                </div>
              </div>

              {/* helper */}
              <p className="mt-3 text-[12px] text-ink-muted">
                <span className="text-ink font-semibold">mark what you're buying.</span> leave the rest open for gifts.
              </p>

              {/* product rows */}
              <div className="mt-3 space-y-2">
                {items.map((i) => {
                  const merch = i.merchant[mode];
                  const isSelf = i.state === "self";
                  const isClaimed = i.state === "claimed";
                  return (
                    <div
                      key={i.id}
                      className={`rounded-2xl p-3 ring-1 transition ${
                        isClaimed ? "bg-lilac/10 ring-lilac/40" :
                        isSelf ? "bg-lime/10 ring-lime/40" :
                        "bg-white/[0.03] ring-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02] ring-1 ring-white/10 grid place-items-center text-[9px] font-mono uppercase text-ink-dim">
                          {i.cat.split(" ")[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-mono text-[9px] uppercase tracking-widest text-ink-dim truncate">{i.cat}</div>
                          <div className="text-[13px] font-semibold text-ink truncate">{i.name}</div>
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className={`rounded-full ring-1 px-2 py-0.5 text-[9px] font-bold ${merchantColor(merch)}`}>{merch}</span>
                            {isClaimed && <span className="rounded-full bg-lilac px-2 py-0.5 text-[9px] font-bold text-[#0F0F11]">claimed by {i.claimedBy}</span>}
                            {isSelf && <span className="rounded-full bg-lime px-2 py-0.5 text-[9px] font-bold text-[#0F0F11]">i'll buy</span>}
                          </div>
                        </div>
                        <div className="font-mono text-[13px] font-bold text-ink shrink-0">${i.price}</div>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <button
                          disabled={isClaimed}
                          onClick={() => cycleState(i.id)}
                          className={`flex-1 rounded-full px-3 py-1.5 text-[11px] font-bold transition active:scale-[0.97] ${
                            isClaimed ? "bg-white/5 text-ink-dim" :
                            isSelf ? "bg-lime text-[#0F0F11]" :
                            "bg-white/[0.06] ring-1 ring-white/15 text-ink"
                          }`}
                        >
                          {isClaimed ? "handled" : isSelf ? "✓ i'll buy" : "mark: i'll buy"}
                        </button>
                        <button
                          onClick={() => swap(i.id)}
                          className="rounded-full bg-white/[0.06] ring-1 ring-white/15 px-3 py-1.5 text-[11px] font-bold text-ink active:scale-[0.97]"
                        >
                          swap
                        </button>
                        <button
                          onClick={() => remove(i.id)}
                          className="rounded-full bg-white/[0.04] ring-1 ring-white/10 px-3 py-1.5 text-[11px] font-bold text-ink-muted active:scale-[0.97]"
                          aria-label="remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-[11px] text-ink-dim">
                one product per slot. swap anything before the registry goes live.
              </p>

              <button
                onClick={() => { track(mode === "amazon" ? "amazon_cart_clicked" : mode === "walmart" ? "walmart_cart_clicked" : "mixed_product_link_clicked"); onOpen(); }}
                className="mt-4 w-full rounded-full bg-lime px-5 py-3.5 text-sm font-bold text-[#0F0F11] active:scale-[0.98] transition"
              >
                {cartCTA} →
              </button>
              <p className="mt-2 text-center text-[11px] text-ink-muted">
                family claims the gifts. you buy whatever's left.
              </p>
            </div>
          </div>
        </div>

        {/* ============ STAGE 3 — SHARE THE REGISTRY ============ */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Share action card */}
          <div className="rounded-3xl bg-gradient-to-br from-lilac/15 to-card ring-1 ring-lilac/30 p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">stage 3</div>
            <h3 className="mt-0.5 font-display text-2xl font-extrabold lowercase text-ink">
              share it. <span className="text-lilac">split who pays.</span>
            </h3>
            <p className="mt-2 text-[13px] text-ink-muted">
              one link for your roommate, parents, relatives, and family group chat.
            </p>
            <button
              onClick={() => { track("registry_shared"); onOpen(); }}
              className="mt-4 w-full rounded-full bg-lilac px-5 py-3.5 text-sm font-bold text-[#0F0F11] active:scale-[0.98] transition"
            >
              share the registry →
            </button>
            <div className="mt-4 flex flex-wrap gap-2">
              {["copy link", "messages", "whatsapp", "email", "share sheet"].map((s) => (
                <span key={s} className="rounded-full bg-white/[0.04] ring-1 ring-white/10 px-3 py-1.5 text-[11px] text-ink-muted">{s}</span>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-ink-dim">
              send the registry, not 19 product links. one room. one budget. one link.
            </p>
          </div>

          {/* Family-facing cream card */}
          <div className="rounded-3xl bg-cream p-5 text-[#0F0F11] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between">
              <div className="font-display text-lg font-extrabold lowercase text-[#0F0F11]">their dorm registry, planned to the dollar.</div>
              <span className="rounded-full bg-[#0F0F11] px-2.5 py-0.5 text-[10px] font-bold text-lime">shareable</span>
            </div>
            <div className="mt-3 aspect-[16/10] rounded-xl overflow-hidden">
              <img src={dormAfter} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="mt-3 rounded-2xl bg-black/5 p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-black/50">covered</div>
                  <div className="mt-0.5 font-display text-2xl font-extrabold text-[#0F0F11]">${covered} <span className="text-black/50 text-base font-medium">of ${total}</span></div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-black/50">open</div>
                  <div className="mt-0.5 font-display text-2xl font-extrabold text-[#0F0F11]">{openCount}</div>
                </div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                <div className="h-full rounded-full bg-lime transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <p className="mt-3 text-[12px] text-black/70">claim an item so everyone knows you're covering it.</p>
            <div className="mt-3 space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {items.slice(0, 6).map((i) => {
                const merch = i.merchant[mode];
                return (
                  <div key={i.id} className="flex items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-black/10">
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-semibold text-[#0F0F11] truncate">{i.name}</div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="rounded-full bg-black/5 ring-1 ring-black/10 px-2 py-0.5 text-[9px] font-bold text-black/70">{merch}</span>
                        <span className="font-mono text-[10px] text-black/60">${i.price}</span>
                      </div>
                    </div>
                    {i.state === "claimed" ? (
                      <span className="rounded-full bg-[#0F0F11] px-2.5 py-1 text-[10px] font-bold text-lime">claimed by {i.claimedBy}</span>
                    ) : i.state === "self" ? (
                      <span className="rounded-full bg-black/10 px-2.5 py-1 text-[10px] font-bold text-[#0F0F11]">covered</span>
                    ) : (
                      <button
                        onClick={() => claim(i.id)}
                        className="rounded-full bg-[#0F0F11] px-3 py-1.5 text-[11px] font-bold text-lime active:scale-[0.97]"
                      >
                        claim this →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-black/50">
              no account needed to view the registry. claiming updates the Dormie registry — final purchase happens with the retailer. claimed here means nobody else buys the same thing.
            </p>
          </div>
        </div>

        {/* honesty footer */}
        <p className="mt-6 mx-auto max-w-2xl text-center text-[11px] leading-relaxed text-ink-dim">
          Dormie organizes the room plan, registry, and product links. final price, stock, shipping, and checkout are confirmed by the retailer. ZIP helps prioritize relevant products — availability can change.
        </p>
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
          send home the room, the budget, and the registry. family can claim what they're covering, and the rest stays ready for you to buy. one link. no random product texts. no double-buying.
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
              "full shoppable registry — budget, ZIP, one-tap carts, mixed brands, and family claiming",
              "budget tracking",

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
      <TopBar />
      <Marquee />
      <Hero onOpen={open} />
      <SectionTransition />
      <RegistryShopSection onOpen={open} />
      <ProblemSection onOpen={open} />
      <HowItWorks onOpen={open} />
      <VibePicker onOpen={open} />

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
