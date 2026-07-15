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

// --- Before/After tap reveal --------------------------------------------
function HeroRevealCard({ onCTA }: { onCTA: () => void }) {
  const [mode, setMode] = useState<"before" | "after">("after");
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !autoplay) return;
    let cancelled = false;
    const loop = async () => {
      // brief tease: after -> before -> after
      await new Promise((r) => setTimeout(r, 1400));
      if (cancelled) return;
      setMode("before");
      await new Promise((r) => setTimeout(r, 1400));
      if (cancelled) return;
      setMode("after");
    };
    loop();
    return () => { cancelled = true; };
  }, [autoplay]);

  const toggle = (next: "before" | "after") => {
    setAutoplay(false);
    setMode(next);
  };

  return (
    <div className="relative rounded-[28px] bg-cream p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl select-none">
        {/* After (base) */}
        <img
          src={dormAfter}
          alt="Styled dorm room after dormie"
          className="absolute inset-0 h-full w-full object-cover"
          width={768}
          height={1024}
        />
        {/* Before (fades in when selected) */}
        <img
          src={dormBefore}
          alt="Plain dorm room before dormie"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            mode === "before" ? "opacity-100" : "opacity-0"
          }`}
          width={768}
          height={1024}
        />

        {/* subtle sweep on transition */}
        <div
          key={mode}
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/30 via-white/0 to-transparent animate-[sweep_0.6s_ease-out]"
          style={{ mixBlendMode: "overlay" }}
        />

        {/* status chips */}
        <div className="absolute left-3 top-3">
          <StickerChip tone={mode === "before" ? "cream" : "dark"}>
            {mode === "before" ? "BEFORE" : "AFTER"}
          </StickerChip>
        </div>
        <div className="absolute right-3 top-3">
          <StickerChip tone="lime" float>to this ✦</StickerChip>
        </div>
        <div className="absolute left-3 top-14">
          <StickerChip tone="lilac" float>no nails · no paint</StickerChip>
        </div>

        {/* segmented toggle — tap-only, no horizontal drag */}
        <div className="absolute inset-x-3 bottom-3 flex justify-center">
          <div className="inline-flex rounded-full bg-black/70 backdrop-blur p-1 ring-1 ring-white/15">
            <button
              type="button"
              onClick={() => toggle("before")}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
                mode === "before" ? "bg-cream text-[#0F0F11]" : "text-white/70"
              }`}
            >
              before
            </button>
            <button
              type="button"
              onClick={() => toggle("after")}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition ${
                mode === "after" ? "bg-lime text-[#0F0F11]" : "text-white/70"
              }`}
            >
              after
            </button>
          </div>
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
    <section className="relative px-4 pt-5 pb-10 md:px-8 md:pt-10 md:pb-20 grain">
      <div className="mx-auto max-w-md md:max-w-6xl">
        <div className="md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:items-center md:gap-12 lg:gap-16">
          {/* LEFT: copy + CTA */}
          <div className="md:pr-2">
            <div className="flex justify-center md:justify-start">
              <StickerChip tone="dark" className="font-mono">back to school szn · 39 days out</StickerChip>
            </div>
            <h1 className="mt-3 text-center md:text-left font-display text-[40px] md:text-[76px] lg:text-[88px] leading-[0.95] font-extrabold tracking-tight lowercase">
              your dorm,<br />
              <span className="text-lime">but make it iconic.</span>
            </h1>
            <p className="mt-3 md:mt-5 text-center md:text-left text-[14px] md:text-[17px] leading-snug md:leading-relaxed text-ink-muted md:max-w-lg">
              snap your room. get a design built around the furniture you're stuck with — then shop it in one tap.
            </p>

            <div className="mt-3 md:mt-5 flex flex-wrap justify-center md:justify-start gap-1.5">
              <StickerChip tone="lime">3 designs free</StickerChip>
              <StickerChip tone="lilac">no signup to try</StickerChip>
              <StickerChip tone="cream">ready in seconds</StickerChip>
            </div>

            <div className="mt-4 md:mt-7 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4">
              <PrimaryCTA size="lg" onClick={() => { track("hero_cta_clicked"); onOpen(); }}>
                see my room →
              </PrimaryCTA>
              <div className="flex items-center justify-center md:justify-start gap-3 text-[11px] md:text-[12px] text-ink-dim">
                <button
                  onClick={() => { track("demo_room_clicked"); onOpen(); }}
                  className="underline underline-offset-2 hover:text-ink"
                >
                  use demo room
                </button>
                <span>·</span>
                <span>no signup</span>
              </div>
            </div>

            <p className="hidden md:block mt-6 text-[13px] text-ink-muted md:max-w-md">
              then turn the room into a budgeted registry with real products, one-tap carts, and family claiming.
            </p>
          </div>

          {/* RIGHT: reveal card */}
          <div className="mt-5 md:mt-0">
            <HeroRevealCard onCTA={onOpen} />
          </div>
        </div>

        <p className="md:hidden mt-4 text-center text-[12px] text-ink-muted">
          then turn the room into a budgeted registry with real products, one-tap carts, and family claiming.
        </p>
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
    <section className="px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-md md:max-w-6xl">
        <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:gap-14 md:items-start">
          <div>
            <h2 className="font-display text-3xl md:text-5xl leading-tight font-extrabold lowercase">
              pinterest doesn't know your dorm.
            </h2>
            <p className="mt-3 text-[15px] md:text-[16px] text-ink-muted md:max-w-sm">
              your feed is cute. your room is tiny. the bed, desk, dresser, and chair probably have to stay. dormie designs around the room you actually got.
            </p>
            <div className="mt-6 hidden md:flex">
              <PrimaryCTA onClick={() => { track("hero_cta_clicked", { section: "problem" }); onOpen(); }}>
                try my room free
              </PrimaryCTA>
            </div>
          </div>
          <div className="mt-6 md:mt-0 grid gap-3 md:grid-cols-3 md:gap-4">
            {cards.map((c) => (
              <div key={c.t} className="rounded-2xl bg-card p-4 md:p-5 ring-1 ring-white/10">
                <div className="text-[15px] font-bold text-ink">{c.t}</div>
                <div className="mt-1 text-[13px] text-ink-muted">{c.b}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-center md:hidden">
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
    <section className="px-4 py-14 md:px-8 md:py-20 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="mx-auto max-w-md md:max-w-6xl">
        <div className="md:text-center md:max-w-2xl md:mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">how it works</p>
          <h2 className="mt-1 font-display text-3xl md:text-5xl leading-tight font-extrabold lowercase">
            three taps. then the reveal. then the registry.
          </h2>
        </div>
        <div className="mt-6 md:mt-10 grid gap-3 md:grid-cols-4 md:gap-4">
          <StepCard n="1" title="drop the room pic" body="snap it, upload it, or use the demo room." />
          <StepCard n="2" title="pick the energy" body="cozy szn, golden hour, locked in, soft era, or type your own." />
          <StepCard n="3" title="see the glow-up" body="before/after reveal, edits, share card, roommate check." />
          <StepCard n="4" tone="cream" title="build + share the registry" body="set the budget and ZIP, choose Amazon, Walmart, or mixed brands, then decide what you'll buy and what friends or family can claim." />
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
    <section className="px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-md md:max-w-5xl">
        <div className="md:text-center md:max-w-2xl md:mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">step 3 / 4 · saves to your profile</p>
          <h2 className="mt-1 font-display text-3xl md:text-5xl leading-tight font-extrabold lowercase">
            pick the energy. not the furniture.
          </h2>
          <p className="mt-2 md:mt-3 text-[14px] md:text-[15px] text-ink-muted">
            the school stuff stays. the vibe is yours. up to three.
          </p>
        </div>
        <div className="mt-5 md:mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {VIBES.map((v) => (
            <VibeCard key={v.key} vibe={v} selected={selected.includes(v.key)} onClick={() => toggle(v.key)} />
          ))}
        </div>
        <div className="md:mx-auto md:max-w-xl">
          <input
            placeholder="or type it — 'coquette but navy'"
            className="mt-4 md:mt-6 w-full rounded-full bg-white/[0.04] ring-1 ring-white/10 px-5 py-3.5 text-sm text-ink placeholder:text-ink-dim outline-none focus:ring-lime/60"
          />
          <div className="mt-5 md:mt-4 md:flex md:justify-center">
            <PrimaryCTA className="w-full md:w-auto" onClick={() => { track("hero_cta_clicked", { section: "vibe" }); onOpen(); }}>
              cook it →
            </PrimaryCTA>
          </div>
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

const PREVIEW_ITEMS: Array<{ id: string; cat: string; name: string; price: number; merchant: Record<ShopMode, string> }> = [
  { id: "comforter", cat: "comforter", name: "twin xl comforter set", price: 49, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "Amazon" } },
  { id: "rug", cat: "rug", name: "washable 5x7 rug", price: 55, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "Walmart" } },
  { id: "lamp", cat: "desk lamp", name: "clip-on desk lamp", price: 19, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "Target" } },
  { id: "bins", cat: "under-bed bins", name: "under-bed storage bins", price: 26, merchant: { amazon: "Amazon", walmart: "Walmart", mixed: "IKEA" } },
];

const SHARE_ITEMS: Array<{ id: string; name: string; merchant: string; price: number; claimedBy?: string }> = [
  { id: "comforter", name: "twin xl comforter set", merchant: "Amazon", price: 49, claimedBy: "mom" },
  { id: "rug", name: "washable 5x7 rug", merchant: "Walmart", price: 55 },
  { id: "lamp", name: "clip-on desk lamp", merchant: "Target", price: 19 },
  { id: "bins", name: "under-bed storage bins", merchant: "IKEA", price: 26 },
];

function AmazonMark({ size = 13 }: { size?: number }) {
  return (
    <span className="inline-flex flex-col leading-none">
      <span style={{ fontFamily: "'Amazon Ember', 'Helvetica Neue', system-ui, sans-serif", letterSpacing: "-0.02em" }}
            className="font-bold text-white" >
        <span style={{ fontSize: size }}>amazon</span>
      </span>
      <svg viewBox="0 0 60 10" className="mt-[1px]" style={{ width: size * 3.6, height: size * 0.5 }} aria-hidden>
        <path d="M2 3 Q 30 11 58 3" fill="none" stroke="#FF9900" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M53 1.5 L58 3 L55.5 7.5" fill="none" stroke="#FF9900" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function WalmartMark({ size = 13 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="font-bold text-white" style={{ fontSize: size, letterSpacing: "-0.01em" }}>Walmart</span>
      <svg viewBox="0 0 20 20" style={{ width: size * 0.9, height: size * 0.9 }} aria-hidden>
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <rect key={a} x="9.2" y="2.5" width="1.6" height="6" rx="0.8" fill="#FFC220" transform={`rotate(${a} 10 10)`} />
        ))}
      </svg>
    </span>
  );
}

function MerchantBadge({ name }: { name: string }) {
  if (name === "Amazon") return <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] ring-1 ring-[#FF9900]/40 px-1.5 py-0.5"><AmazonMark size={9} /></span>;
  if (name === "Walmart") return <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] ring-1 ring-[#0071DC]/40 px-1.5 py-0.5"><WalmartMark size={9} /></span>;
  return <span className={`rounded-full ring-1 px-1.5 py-0.5 text-[9px] font-bold ${merchantColor(name)}`}>{name}</span>;
}

function PhoneFrame({ children, step, label, tone = "lime" }: { children: ReactNode; step: string; label: string; tone?: "lime" | "lilac" | "peach" }) {
  const toneMap = {
    lime: { badge: "bg-lime text-[#0F0F11]", ring: "ring-lime/30", glow: "shadow-[0_30px_80px_-30px_rgba(216,255,79,0.35)]" },
    lilac: { badge: "bg-lilac text-[#0F0F11]", ring: "ring-lilac/30", glow: "shadow-[0_30px_80px_-30px_rgba(196,181,253,0.35)]" },
    peach: { badge: "bg-peach text-[#0F0F11]", ring: "ring-peach/30", glow: "shadow-[0_30px_80px_-30px_rgba(255,179,155,0.35)]" },
  } as const;
  const t = toneMap[tone];
  return (
    <div className="relative">
      {/* big step numeral watermark */}
      <div aria-hidden className="pointer-events-none absolute -top-6 -left-1 z-0 font-display text-[88px] leading-none font-extrabold text-white/[0.04] select-none">
        {step}
      </div>
      {/* step badge */}
      <div className={`absolute -top-3 left-4 z-20 flex items-center gap-2 rounded-full bg-bg ring-1 ${t.ring} pl-1 pr-3 py-1`}>
        <span className={`grid h-5 w-5 place-items-center rounded-full font-mono text-[10px] font-extrabold ${t.badge}`}>{step}</span>
        <span className="text-[10px] font-bold text-ink lowercase tracking-wide">{label}</span>
      </div>
      <div className={`relative z-10 rounded-[28px] bg-bg-2 ring-1 ${t.ring} p-2.5 ${t.glow}`}>
        <div className="rounded-[22px] bg-bg ring-1 ring-white/10 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

function StepConnector({ tone }: { tone: "lime" | "lilac" | "peach" }) {
  const dot = tone === "lime" ? "bg-lime" : tone === "lilac" ? "bg-lilac" : "bg-peach";
  const text = tone === "lime" ? "text-lime" : tone === "lilac" ? "text-lilac" : "text-peach";
  return (
    <div className="flex flex-col items-center gap-1.5 md:hidden" aria-hidden>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent" />
      <span className={`font-mono text-[11px] ${text}`}>↓</span>
    </div>
  );
}



function PlanCard({ mode, setMode, budget, setBudget, zip, setZip }: {
  mode: ShopMode; setMode: (m: ShopMode) => void;
  budget: string; setBudget: (b: string) => void;
  zip: string; setZip: (z: string) => void;
}) {
  const budgets = ["$150", "$300", "$500", "custom"];
  const opts: Array<{ k: ShopMode; label: ReactNode; d: string; ring: string }> = [
    { k: "amazon", label: <span className="inline-flex items-baseline gap-1.5"><AmazonMark size={12} /><span className="text-[11px] text-ink-muted">one-tap</span></span>, d: "eligible Amazon products land in your Amazon cart.", ring: "ring-[#FF9900]/50" },
    { k: "walmart", label: <span className="inline-flex items-center gap-1.5"><WalmartMark size={12} /><span className="text-[11px] text-ink-muted">one-tap</span></span>, d: "eligible Walmart products land in your Walmart cart.", ring: "ring-[#0071DC]/50" },
    { k: "mixed", label: <span className="text-[12px] font-bold text-ink lowercase">🛍 mixed brands</span>, d: "best pick per item — Amazon, Walmart, Target, IKEA + more.", ring: "ring-lilac/50" },
  ];
  return (
    <div className="p-4">
      <div className="font-mono text-[9px] uppercase tracking-widest text-ink-dim">the practical payoff</div>
      <h4 className="mt-1 font-display text-xl font-extrabold lowercase text-ink">price the registry.</h4>

      <div className="mt-3 rounded-2xl bg-card p-3 ring-1 ring-white/10">
        <div className="font-display text-[13px] font-extrabold lowercase text-ink">the budget.</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {budgets.map((b) => (
            <button
              key={b}
              onClick={() => { setBudget(b); track("budget_selected", { budget: b }); }}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                budget === b ? "bg-lime text-[#0F0F11]" : "bg-white/[0.05] ring-1 ring-white/15 text-ink"
              }`}
            >
              {b}{b === "custom" ? " $420" : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2.5 rounded-2xl bg-card p-3 ring-1 ring-white/10">
        <div className="font-display text-[13px] font-extrabold lowercase text-ink">the checkout style.</div>
        <div className="mt-2 space-y-1.5">
          {opts.map((opt) => {
            const active = mode === opt.k;
            return (
              <button
                key={opt.k}
                onClick={() => { setMode(opt.k); track(`${opt.k}_${opt.k === "mixed" ? "brands" : "one_tap"}_selected`); }}
                className={`w-full text-left rounded-xl p-2.5 ring-1 transition ${
                  active ? `bg-white/[0.06] ${opt.ring} ring-2` : "bg-white/[0.02] ring-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>{opt.label}</div>
                  {active && <span className="font-mono text-[9px] font-bold text-lime whitespace-nowrap">✓ picked</span>}
                </div>
                <div className="mt-1 text-[10.5px] text-ink-muted leading-snug">{opt.d}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2.5 rounded-2xl bg-card p-3 ring-1 ring-white/10">
        <div className="font-display text-[13px] font-extrabold lowercase text-ink">ship to zip</div>
        <div className="mt-1.5 flex items-center gap-2 rounded-full bg-white/[0.04] ring-1 ring-lime/40 px-3 py-2">
          <span className="text-[11px]">📍</span>
          <input
            value={zip}
            onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 5); setZip(v); track("zip_entered", { zip: v }); }}
            inputMode="numeric"
            className="flex-1 bg-transparent text-[12px] text-ink outline-none"
          />
          <span className="font-mono text-[9px] uppercase tracking-widest text-lime">zip-aware</span>
        </div>
      </div>
    </div>
  );
}

function BuildCard({ mode }: { mode: ShopMode }) {
  const items = PREVIEW_ITEMS.map((i) => ({ ...i, merch: i.merchant[mode] }));
  const total = items.reduce((s, i) => s + i.price, 0);
  const heading = mode === "amazon"
    ? <span className="inline-flex items-baseline gap-1.5">the <AmazonMark size={14} /> registry.</span>
    : mode === "walmart"
    ? <span className="inline-flex items-center gap-1.5">the <WalmartMark size={14} /> registry.</span>
    : <>the mixed-brand registry.</>;

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-display text-lg font-extrabold lowercase text-ink leading-tight">{heading}</h4>
        <span className="rounded-full bg-lilac/20 ring-1 ring-lilac/40 px-2 py-0.5 text-[9px] font-bold text-lilac uppercase whitespace-nowrap shrink-0">registry · {items.length}</span>
      </div>
      <p className="mt-1 text-[11px] text-ink-muted">mark what you're buying. leave the rest open for gifts.</p>

      <div className="mt-3 rounded-2xl bg-card p-3 ring-1 ring-lime/30">
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-display text-lg font-extrabold text-ink">$0 <span className="text-ink-dim text-[11px] font-medium">of ${total} covered</span></div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-lime whitespace-nowrap">{items.length} open</div>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-lime" style={{ width: "0%" }} />
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {items.map((i) => (
          <div key={i.id} className="rounded-xl bg-card ring-1 ring-white/10 p-2.5">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02] ring-1 ring-white/10" />
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[8px] uppercase tracking-widest text-ink-dim truncate">{i.cat}</div>
                <div className="text-[12px] font-semibold text-ink truncate">{i.name}</div>
                <div className="mt-1 flex items-center gap-1 flex-wrap">
                  <MerchantBadge name={i.merch} />
                  <span className="rounded-full bg-lilac/15 ring-1 ring-lilac/30 px-1.5 py-0.5 text-[8px] font-bold text-lilac">gift</span>
                  <span className="rounded-full bg-white/[0.05] ring-1 ring-white/15 px-1.5 py-0.5 text-[8px] font-bold text-ink-muted">i'll buy</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-[12px] font-bold text-ink">${i.price}</div>
                <div className="mt-0.5 font-mono text-[9px] text-ink-dim">swap ⇄</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShareCardPreview({ mode }: { mode: ShopMode }) {
  const items = SHARE_ITEMS.map((i) => ({
    ...i,
    merchant: mode === "amazon" ? "Amazon" : mode === "walmart" ? "Walmart" : i.merchant,
  }));
  const total = items.reduce((s, i) => s + i.price, 0);
  const covered = items.filter((i) => i.claimedBy).reduce((s, i) => s + i.price, 0);
  const openCount = items.filter((i) => !i.claimedBy).length;
  const pct = Math.round((covered / total) * 100);
  return (
    <div className="p-3">
      <div className="rounded-[18px] bg-cream p-4 text-[#0F0F11]">
        <div className="flex items-center justify-between gap-2">
          <div className="font-display text-[15px] font-extrabold lowercase leading-tight">their dorm registry.</div>
          <span className="rounded-full bg-[#0F0F11] px-2 py-0.5 text-[9px] font-bold text-lime whitespace-nowrap">shareable</span>
        </div>
        <div className="mt-2 aspect-[16/10] rounded-lg overflow-hidden ring-1 ring-black/10">
          <img src={dormAfter} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="mt-3 rounded-xl bg-black/5 p-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-black/50">covered</div>
              <div className="font-display text-lg font-extrabold">${covered} <span className="text-black/50 text-[11px] font-medium">of ${total}</span></div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[9px] uppercase tracking-widest text-black/50">open</div>
              <div className="font-display text-lg font-extrabold">{openCount}</div>
            </div>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
            <div className="h-full rounded-full bg-[#0F0F11]" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-2 rounded-xl bg-white p-2.5 ring-1 ring-black/10">
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold truncate">{i.name}</div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="rounded-full bg-black/5 ring-1 ring-black/10 px-1.5 py-0.5 text-[8px] font-bold text-black/70">{i.merchant}</span>
                  <span className="font-mono text-[9px] text-black/60">${i.price}</span>
                </div>
              </div>
              {i.claimedBy ? (
                <span className="rounded-full bg-[#0F0F11] px-2 py-1 text-[9px] font-bold text-lime whitespace-nowrap">claimed by {i.claimedBy}</span>
              ) : (
                <button className="rounded-full bg-[#0F0F11] px-2.5 py-1 text-[10px] font-bold text-lime whitespace-nowrap">claim this →</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegistryShopSection({ onOpen }: { onOpen: () => void }) {
  const [budget, setBudget] = useState("$300");
  const [zip, setZip] = useState("78705");
  const [mode, setMode] = useState<ShopMode>("mixed");

  useEffect(() => { track("combined_registry_section_viewed"); }, []);

  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-md md:max-w-6xl">
        {/* header */}
        <div className="md:mx-auto md:max-w-3xl md:text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">the practical payoff</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl leading-[1.05] font-extrabold lowercase">
            design the room. <span className="text-lime">build the registry.</span>
          </h2>
          <p className="mt-3 text-[14px] md:text-[15px] text-ink-muted md:mx-auto md:max-w-xl">
            set a budget, add your ZIP, and get real products for the room. buy what you want yourself, or share the registry so friends and family can claim the rest.
          </p>

          {/* brand strip */}
          <div className="mt-4 flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink-dim">shop through</span>
            <AmazonMark size={13} />
            <WalmartMark size={13} />
            <span className="text-[11px] text-ink-muted">Target · IKEA · + more</span>
          </div>
        </div>

        {/* MOBILE stacked */}
        <div className="mt-10 flex flex-col gap-4 md:hidden">
          <PhoneFrame step="01" label="set the plan" tone="lime">
            <PlanCard mode={mode} setMode={setMode} budget={budget} setBudget={setBudget} zip={zip} setZip={setZip} />
          </PhoneFrame>
          <StepConnector tone="lilac" />
          <PhoneFrame step="02" label="build the registry" tone="lilac">
            <BuildCard mode={mode} />
          </PhoneFrame>
          <StepConnector tone="peach" />
          <PhoneFrame step="03" label="share + claim" tone="peach">
            <ShareCardPreview mode={mode} />
          </PhoneFrame>
        </div>

        {/* DESKTOP 3-up */}
        <div className="mt-10 hidden md:grid md:grid-cols-3 md:gap-5 lg:gap-7">
          <PhoneFrame step="01" label="set the plan" tone="lime">
            <PlanCard mode={mode} setMode={setMode} budget={budget} setBudget={setBudget} zip={zip} setZip={setZip} />
          </PhoneFrame>
          <PhoneFrame step="02" label="build the registry" tone="lilac">
            <BuildCard mode={mode} />
          </PhoneFrame>
          <PhoneFrame step="03" label="share + claim" tone="peach">
            <ShareCardPreview mode={mode} />
          </PhoneFrame>
        </div>



        {/* benefit points */}
        <ul className="mt-8 grid gap-2.5 md:grid-cols-3 md:gap-4">
          {[
            "budget + ZIP-aware products",
            "Amazon, Walmart, or mixed brands",
            "buy it yourself or leave it open to claim",
          ].map((b) => (
            <li key={b} className="flex items-start gap-2.5 rounded-2xl bg-white/[0.03] ring-1 ring-white/10 px-3.5 py-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
              <span className="text-[13px] text-ink">{b}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={() => { track("registry_see_room_clicked"); onOpen(); }}
            className="rounded-full bg-lime px-6 py-3.5 text-sm font-bold text-[#0F0F11] active:scale-[0.98] transition animate-pulse-glow"
          >
            see my room →
          </button>
          <p className="text-center text-[11px] leading-relaxed text-ink-dim max-w-md">
            final price, stock, shipping, and checkout are confirmed by the retailer.
          </p>
        </div>
      </div>
    </section>
  );
}


function ShareSection({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-md md:max-w-6xl">
        <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-14 md:items-center">
          <div>
            <h2 className="font-display text-3xl md:text-5xl leading-tight font-extrabold lowercase">
              built for the group chat.
            </h2>
            <p className="mt-2 md:mt-4 text-[14px] md:text-[16px] text-ink-muted md:max-w-sm">
              brag card, vote card, roommate check, mom view. same room, different audience.
            </p>
            <div className="mt-5 hidden md:flex flex-col gap-2 md:max-w-xs">
              <PrimaryCTA className="w-full" onClick={() => { track("hero_cta_clicked", { section: "share" }); onOpen(); }}>
                make my share card
              </PrimaryCTA>
              <p className="text-[11px] text-ink-dim">
                your first share has a dormie watermark. pass removes it.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 grid grid-cols-2 gap-3 md:gap-4">
            <div className="col-span-2">
              <ShareCard tag="brag time" tone="lime" title="okay it ate." body="vertical card for tiktok + stories" />
            </div>
            <ShareCard tag="roommate check" tone="lilac" title="wait this is cute" body="before they buy the wrong lamp" />
            <ShareCard tag="mom view" tone="peach" title="the practical version" body="room + budget + list" />
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 md:hidden">
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
    <section className="px-4 py-14 md:px-8 md:py-20 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="mx-auto max-w-md md:max-w-5xl">
        <div className="md:grid md:grid-cols-2 md:gap-14 md:items-center">
          <div>
            <h2 className="font-display text-3xl md:text-5xl leading-tight font-extrabold lowercase">
              send this before your roommate buys ugly stuff.
            </h2>
            <p className="mt-2 md:mt-4 text-[14px] md:text-[16px] text-ink-muted md:max-w-md">
              match the vibe before move-in. split ideas, vote on looks, and avoid the two-people-one-room disaster.
            </p>
            <div className="mt-5 hidden md:flex flex-col gap-2 md:max-w-xs">
              <PrimaryCTA className="w-full" onClick={() => { track("roommate_cta_clicked"); onOpen(); }}>
                send to roommate
              </PrimaryCTA>
              <SecondaryCTA className="w-full" onClick={() => { track("hero_cta_clicked", { section: "roommate" }); onOpen(); }}>
                design my side first
              </SecondaryCTA>
            </div>
          </div>
          <div className="mt-5 md:mt-0 rounded-3xl bg-card p-4 md:p-6 ring-1 ring-white/10">
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
        </div>
        <div className="mt-5 flex flex-col gap-2 md:hidden">
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



function PassCard({
  variant,
  name,
  price,
  period,
  perMonth,
  features,
  ctaLabel,
  onClick,
  badge,
}: {
  variant: "season" | "year";
  name: string;
  price: string;
  period: string;
  perMonth: string;
  features: Array<string | { bold: string; rest: string }>;
  ctaLabel: string;
  onClick: () => void;
  badge?: string;
}) {
  const isFeat = variant === "year";
  return (
    <div
      className={`relative rounded-3xl p-5 ring-1 ${
        isFeat
          ? "bg-gradient-to-b from-lilac/20 to-card ring-lilac/50 shadow-[0_25px_60px_-25px_rgba(196,181,253,0.4)]"
          : "bg-card ring-white/10"
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 left-5 rounded-full bg-lilac px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0F0F11]">
          {badge}
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-bold text-ink lowercase">{name}</div>
          <div className="mt-1 text-[11px] text-ink-dim">{perMonth}</div>
        </div>
        <div className="text-right">
          <div className={`font-display text-3xl font-extrabold ${isFeat ? "text-lilac" : "text-lime"}`}>
            {price}
          </div>
          <div className="text-[10px] text-ink-dim">{period}</div>
        </div>
      </div>
      <ul className="mt-4 space-y-2 text-[13px] text-ink-muted">
        {features.map((f, i) => (
          <li key={i} className="flex gap-2">
            <span className={isFeat ? "text-lilac" : "text-lime"}>✓</span>
            {typeof f === "string" ? (
              <span>{f}</span>
            ) : (
              <span>
                <b className="text-ink font-semibold">{f.bold}</b> — {f.rest}
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-xl bg-white/[0.04] ring-1 ring-white/10 px-3 py-2.5 text-[11px] text-ink-dim leading-relaxed">
        built for you, not a group — invite friends instead and they get their own free credits.
      </div>
      <button
        onClick={onClick}
        className={`mt-4 w-full rounded-full py-3 text-sm font-bold active:scale-[0.98] transition ${
          isFeat ? "bg-lilac text-[#0F0F11]" : "bg-lime text-[#0F0F11]"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

function PricingSection({ onOpen }: { onOpen: () => void }) {
  const [plan, setPlan] = useState<"season" | "year">("year");
  return (
    <section className="px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-md md:max-w-2xl">
        <div className="md:text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">for the ones who don't want to wait</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl leading-tight font-extrabold lowercase">
            skip the sharing.<br />
            <span className="text-lilac">design as much as you want.</span>
          </h2>
          <p className="mt-2 md:mt-4 text-[14px] md:text-[15px] text-ink-muted md:mx-auto md:max-w-lg">
            your free credits and the share bonus still work exactly the same — this is just for going further, faster.
          </p>
        </div>

        {/* toggle */}
        <div className="mt-5 md:mt-8 md:mx-auto md:max-w-sm relative flex rounded-full bg-white/[0.05] ring-1 ring-white/10 p-1">
          <button
            onClick={() => setPlan("season")}
            className={`flex-1 rounded-full py-2.5 text-[12px] font-bold transition ${
              plan === "season" ? "bg-lime text-[#0F0F11]" : "text-ink-muted"
            }`}
          >
            3 months
          </button>
          <button
            onClick={() => setPlan("year")}
            className={`relative flex-1 rounded-full py-2.5 text-[12px] font-bold transition ${
              plan === "year" ? "bg-lilac text-[#0F0F11]" : "text-ink-muted"
            }`}
          >
            12 months
            <span className="absolute -top-2 right-2 rounded-full bg-lime px-2 py-0.5 text-[9px] font-extrabold text-[#0F0F11]">
              save 33%
            </span>
          </button>
        </div>

        <div className="mt-6">
          {plan === "season" ? (
            <PassCard
              variant="season"
              name="seasonal pass"
              price="$36"
              period="3 months"
              perMonth="$12 / month, billed once"
              features={[
                { bold: "unlimited designs", rest: "tweaks and re-generations don't count against anything" },
                "full registry + shopping, unlocked immediately",
                "no auto-renew — it just ends at 3 months",
              ]}
              ctaLabel="get the seasonal pass"
              onClick={() => { track("pass_cta_clicked", { plan: "season" }); onOpen(); }}
            />
          ) : (
            <PassCard
              variant="year"
              name="yearly pass"
              price="$72"
              period="12 months"
              perMonth="$6 / month, billed once"
              badge="most save with this"
              features={[
                { bold: "unlimited designs", rest: "tweaks and re-generations don't count against anything" },
                "full registry + shopping, unlocked immediately",
                { bold: "covers your whole year", rest: "move-in, the january reset, and whenever the vibe changes" },
              ]}
              ctaLabel="get the yearly pass"
              onClick={() => { track("pass_cta_clicked", { plan: "year" }); onOpen(); }}
            />
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[12px]">
          <span className="text-ink-dim">not ready to pay?</span>
          <button
            onClick={() => { track("share_free_clicked"); onOpen(); }}
            className="font-semibold text-lime hover:underline"
          >
            share instead — still free →
          </button>
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
    <section className="px-4 py-14 md:px-8 md:py-20 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
      <div className="mx-auto max-w-md md:max-w-6xl">
        <div className="md:text-center md:max-w-2xl md:mx-auto">
          <h2 className="font-display text-3xl md:text-5xl leading-tight font-extrabold lowercase">
            not a fake showroom render.
          </h2>
        </div>
        <div className="mt-5 md:mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {cards.map((c, i) => (
            <div
              key={c.t}
              className={`rounded-2xl bg-card p-4 md:p-5 ring-1 ring-white/10 ${i === cards.length - 1 && cards.length % 2 === 1 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <div className="text-[13px] md:text-[14px] font-bold text-ink">{c.t}</div>
              <div className="mt-1 text-[11px] md:text-[12px] text-ink-muted">{c.b}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 md:mt-10 flex justify-center">
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
    <section className="px-4 pt-14 pb-28 md:px-8 md:pt-24 md:pb-32">
      <div className="mx-auto max-w-md md:max-w-3xl text-center">
        <h2 className="font-display text-4xl md:text-6xl leading-[0.95] font-extrabold lowercase">
          move-in is coming.<br />
          <span className="text-lime">make the room make sense.</span>
        </h2>
        <p className="mt-4 md:mt-6 text-[15px] md:text-[17px] text-ink-muted md:mx-auto md:max-w-xl">
          first design is free. no signup. design the room, build the registry, send the plan.
        </p>
        <div className="mt-6 md:mt-8 flex flex-col md:flex-row md:justify-center md:items-center gap-3 md:gap-4">
          <PrimaryCTA size="lg" onClick={() => { track("hero_cta_clicked", { section: "final" }); onOpen(); }}>
            see my room →
          </PrimaryCTA>
          <SecondaryCTA onClick={() => { track("demo_room_clicked", { section: "final" }); onOpen(); }}>
            use demo room
          </SecondaryCTA>
        </div>
        <p className="mt-4 md:mt-6 text-[11px] md:text-[12px] text-ink-dim">
          3 free designs · dorm registry · $24 once for the full season
        </p>
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
      
      <PricingSection onOpen={open} />
      <TrustSection onOpen={open} />
      <FinalCTA onOpen={open} />
      <Footer />
      <StickyMobileCTA onOpen={open} />
      <StartModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
