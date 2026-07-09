import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/the-500-look")({
  head: () => ({
    meta: [
      { title: "the $500 dorm look — every piece linked | dormie" },
      {
        name: "description",
        content:
          "nine pieces that make the room people screenshot. twin xl, zero nails, RA-approved, $485 all in. every piece linked.",
      },
      { property: "og:title", content: "the $500 dorm look — dormie" },
      {
        property: "og:description",
        content: "nine pieces. $485 all in. the room people stop the dorm tour for.",
      },
    ],
  }),
  component: FiveHundredLook,
});

type Item = {
  n: number;
  name: string;
  price: number;
  title: string;
  why: string;
  specs: { label: string; muted?: boolean }[];
  href: string;
};

const ITEMS: Item[] = [
  {
    n: 1,
    name: "comforter + euro shams",
    price: 89,
    title: "comforter + euro sham set",
    why:
      "the difference between a dorm bed and a hotel bed is two euro shams and one layer. this set layers out of the bag — comforter, shams, standard cases — so the bed looks styled even when you made it in eight seconds.",
    specs: [
      { label: "twin xl" },
      { label: "machine washable" },
      { label: "7-piece set", muted: true },
    ],
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
  {
    n: 2,
    name: "plush 5x7 rug",
    price: 79,
    title: "plush 5x7 area rug",
    why:
      "the size jump matters: a 5x7 gets under the bed and your feet, so the whole room reads as one designed space instead of furniture on a tile island. plush pile — you will end up sitting on this more than the chair.",
    specs: [
      { label: "covers half the room" },
      { label: "non-slip pad ready", muted: true },
      { label: "vacuum-safe pile", muted: true },
    ],
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
  {
    n: 3,
    name: "full-length lean mirror",
    price: 65,
    title: "full-length lean mirror",
    why:
      "the single item that shows up in every dorm tour that goes viral. it doubles the light, makes an 11x14 room read twice the size, and — practically — you need to see the outfit. leans against the wall, zero mounting.",
    specs: [
      { label: "no mounting" },
      { label: "shatter-resistant", muted: true },
      { label: "~64\" tall", muted: true },
    ],
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
  {
    n: 4,
    name: "wedge headboard pillow",
    price: 55,
    title: "wedge headboard pillow",
    why:
      "dorm beds don't have headboards — just a wall that's cold at 11pm when you're watching something. a wedge turns the bed into the couch it was always going to be anyway, and it reads like real furniture in photos.",
    specs: [
      { label: "twin xl width" },
      { label: "cover washes", muted: true },
      { label: "no mounting", muted: true },
    ],
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
  {
    n: 5,
    name: "framed gallery wall set",
    price: 49,
    title: "framed gallery wall set of 6",
    why:
      "the upgrade from taped prints to actual frames with mats is the single biggest \"this person has their life together\" signal a wall can send. still hangs on command strips — the frames are light on purpose.",
    specs: [
      { label: "frames included" },
      { label: "hangs with strips" },
      { label: "real mats", muted: true },
    ],
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
  {
    n: 6,
    name: "dimmable floor lamp",
    price: 45,
    title: "dimmable floor lamp",
    why:
      "the overhead light has two settings: off and interrogation. a floor lamp with a real dimmer gives the room an evening mode — which is when the room actually gets used. warm bulb included; put it in the corner the ceiling light misses.",
    specs: [
      { label: "dimmable" },
      { label: "warm bulb included", muted: true },
      { label: "skinny footprint", muted: true },
    ],
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
  {
    n: 7,
    name: "blackout curtains + tension rod",
    price: 38,
    title: "blackout curtains + tension rod",
    why:
      "dorm blinds are decorative at best, and the parking lot light outside doesn't sleep. tension rod means no drilling — it wedges inside the window frame. this is the piece your 8am self thanks you for.",
    specs: [
      { label: "no drilling" },
      { label: "actual blackout", muted: true },
      { label: "fits standard frames", muted: true },
    ],
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
  {
    n: 8,
    name: "smart lighting set",
    price: 36,
    title: "smart lighting set",
    why:
      "app-controlled strips behind the bed frame or along the shelf line. one tap flips the room from study to movie to \"people are coming over\" — and it's the effect every viral dorm video is secretly running on.",
    specs: [
      { label: "app + voice control" },
      { label: "adhesive backed", muted: true },
      { label: "warm-to-color", muted: true },
    ],
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
  {
    n: 9,
    name: "oversized throw blanket",
    price: 29,
    title: "oversized knit throw",
    why:
      "draped off the corner of the bed, it's the styling detail that makes the whole setup look photographed on purpose. functionally: dorms run cold in october and hot in september, and this solves exactly half of that.",
    specs: [
      { label: "50x70 oversized" },
      { label: "machine washable", muted: true },
      { label: "fringe optional", muted: true },
    ],
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
];

const ESSENTIALS = [
  {
    name: "4.4 cu ft mini fridge",
    meta: "$159 · the roomy one — or $80 each, split",
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
  {
    name: "compact microwave",
    meta: "$89 · check your hall allows it — most do, some don't",
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
  {
    name: "tower fan with remote",
    meta: "$59 · the remote matters at 2am, trust",
    href: "https://www.amazon.com/dp/ASIN_HERE?tag=YOURTAG-20",
  },
];

function FiveHundredLook() {
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const [receiptVisible, setReceiptVisible] = useState(false);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const receiptRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        setSeen((prev) => {
          const next = new Set(prev);
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const idx = itemRefs.current.findIndex((el) => el === e.target);
              if (idx >= 0) next.add(idx);
            }
          });
          return next;
        });
      },
      { threshold: 0.5 },
    );
    itemRefs.current.forEach((el) => el && io.observe(el));

    const rio = new IntersectionObserver(
      (entries) => entries.forEach((e) => setReceiptVisible(e.isIntersecting)),
      { threshold: 0.15 },
    );
    if (receiptRef.current) rio.observe(receiptRef.current);

    return () => {
      io.disconnect();
      rio.disconnect();
    };
  }, []);

  const damage = Array.from(seen).reduce((sum, i) => sum + ITEMS[i].price, 0);
  const showBar = seen.size > 0 && !receiptVisible;

  return (
    <div className="min-h-screen bg-bg text-ink font-sans">
      <div className="mx-auto max-w-[640px] px-5 md:max-w-5xl md:px-8">

        <header className="pt-6">
          <Link
            to="/"
            className="text-xs font-bold tracking-widest uppercase text-lime hover:opacity-80"
          >
            dormie · by reimaginehome ai
          </Link>
          <div className="mt-1 text-[11px] text-ink-dim">
            as an amazon associate we earn from qualifying purchases.
          </div>
        </header>

        <main>
          {/* HERO */}
          <section className="pt-11 pb-3 md:mx-auto md:max-w-2xl">
            <h1 className="font-display font-bold leading-[1.04] tracking-tight text-[clamp(38px,9vw,56px)]">
              the <em className="not-italic text-lime">$500</em> dorm look.
            </h1>
            <p className="mt-4 max-w-[52ch] text-[17px] text-ink-muted">
              nine pieces. still twin xl, still zero nails, still built around the school's furniture
              — but this is the version people stop the dorm tour for. $485 all in, and every piece
              survives the next apartment too.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge accent>$485 all in</Badge>
              <Badge>9 pieces</Badge>
              <Badge>ra-approved</Badge>
              <Badge>the room people screenshot</Badge>
            </div>

            <div className="mt-7 overflow-hidden rounded-2xl border border-hairline bg-card-2 grain">
              <div className="aspect-[2/1] w-full bg-gradient-to-br from-lilac/25 via-card to-peach/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-4xl font-bold text-lime">$485</div>
                  <div className="mt-2 text-sm text-ink-muted">
                    the whole look — nine pieces, one room
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-2 text-[11.5px] text-ink-dim">
              the whole $485, in one room. the links below go to the real things.
            </p>
          </section>

          {/* RULES */}
          <section className="mt-9 rounded-2xl border border-hairline bg-card p-6 md:mx-auto md:max-w-2xl">
            <h2 className="font-display text-xl font-semibold mb-3">the rules we picked by</h2>
            {[
              [
                "twin xl or it doesn't count.",
                "dorm beds are 80\" long — regular twin bedding comes up short. everything here fits.",
              ],
              [
                "zero nails, zero paint.",
                "your ra checks. your deposit cares. everything hangs with command strips.",
              ],
              [
                "designed around the school's furniture.",
                "the bed frame, desk, and dresser stay — so we picked things that make them look intentional instead of institutional.",
              ],
              [
                "buy once.",
                "at this budget every piece has to earn a spot in the next apartment too — the mirror, the lamp, the frames all move out with you.",
              ],
            ].map(([b, rest]) => (
              <div key={b} className="flex gap-3 py-2 text-[14.5px] text-ink-muted">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-lime" />
                <div>
                  <b className="font-semibold text-ink">{b}</b> {rest}
                </div>
              </div>
            ))}
          </section>

          {/* LIST */}
          <div className="md:mx-auto md:max-w-2xl">
            <p className="mt-10 mb-1.5 text-xs font-bold tracking-widest uppercase text-lime">
              the list
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight mb-5">
              nine pieces. the whole room, done.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ITEMS.map((item, i) => (
              <article
                key={item.n}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="relative flex flex-col rounded-2xl border border-hairline bg-card p-5"
              >
                <span className="absolute -top-3 left-5 rounded-full bg-lime px-3 py-0.5 text-[11px] font-bold tabular-nums text-bg z-10">
                  {item.n} of 9
                </span>

                {/* image placeholder */}
                <div
                  className="mb-4 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-hairline bg-gradient-to-br from-lilac/20 via-card-2 to-peach/15"
                  aria-label={`${item.title} — image placeholder`}
                >
                  <div className="flex flex-col items-center gap-1.5 text-ink-dim">
                    <svg
                      className="h-8 w-8 opacity-60"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span className="text-[10px] font-mono uppercase tracking-wider">
                      image · coming soon
                    </span>
                  </div>
                </div>

                <div className="mt-1 flex items-baseline justify-between gap-3.5">
                  <h3 className="font-display text-xl font-medium leading-tight">{item.title}</h3>
                  <span className="flex-none font-display text-[21px] font-semibold tabular-nums text-lime">
                    ${item.price}
                  </span>
                </div>
                <p className="mt-2 text-[14.5px] leading-[1.55] text-ink-muted">{item.why}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.specs.map((s) => (
                    <span
                      key={s.label}
                      className={
                        "rounded-full px-2.5 py-1 text-[11px] font-semibold " +
                        (s.muted
                          ? "bg-card-2 text-ink-dim"
                          : "bg-lime/15 text-lime border border-lime/30")
                      }
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
                <a
                  href={item.href}
                  rel="nofollow sponsored"
                  target="_blank"
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3.5 text-sm font-bold text-bg transition-transform active:scale-[0.985] pt-4"
                  style={{ marginTop: "1rem" }}
                >
                  get it on amazon
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </article>
            ))}
          </div>


          {/* RECEIPT */}
          <section
            ref={receiptRef}
            className="mt-7 rounded-2xl border border-hairline bg-card-2 p-6"
          >
            <h2 className="font-display text-[23px] font-semibold mb-4">the damage.</h2>
            {ITEMS.map((it) => (
              <div
                key={it.n}
                className="flex justify-between border-b border-dashed border-hairline py-1.5 text-[14.5px] text-ink-muted tabular-nums last:border-b-0"
              >
                <span>{it.name}</span>
                <span>${it.price}</span>
              </div>
            ))}
            <div className="mt-3 flex items-baseline justify-between border-t-2 border-ink pt-3.5">
              <span className="font-display text-lg font-medium">the whole look</span>
              <span className="font-display text-[34px] font-bold tabular-nums text-lime">$485</span>
            </div>
            <p className="mt-2.5 text-[13px] font-semibold text-lime">
              $15 under budget. that covers the good coffee for week one.
            </p>
            <p className="mt-3.5 text-[13px] text-ink-dim">
              doing it on a tighter budget?{" "}
              <a href="/the-150-look" className="font-semibold text-lilac hover:underline">
                the $150 look is here →
              </a>
            </p>
          </section>

          {/* ESSENTIALS */}
          <section className="mt-11 rounded-2xl border border-peach/40 bg-peach/10 p-6">
            <h2 className="font-display text-[23px] font-semibold text-peach">
              the essentials are a separate budget. on purpose.
            </h2>
            <p className="mt-2 text-[14.5px] leading-[1.55] text-ink-muted">
              fridge, kettle, fan — the functional stuff is real money, and folding it into the look
              budget just wrecks both numbers. keep them apart, and split the big ones with your
              roommate.
            </p>
            {ESSENTIALS.map((e) => (
              <div
                key={e.name}
                className="flex items-center justify-between gap-3 border-b border-peach/20 py-3.5 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold">{e.name}</div>
                  <div className="text-[12.5px] tabular-nums text-ink-dim">{e.meta}</div>
                </div>
                <a
                  href={e.href}
                  rel="nofollow sponsored"
                  target="_blank"
                  className="flex-none rounded-full border border-hairline bg-card px-4 py-2 text-[12.5px] font-semibold text-ink transition-transform active:scale-95"
                >
                  get it →
                </a>
              </div>
            ))}
            <p className="mt-3.5 flex items-start gap-2 text-[12.5px] leading-[1.5] text-peach">
              <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-lime" />
              the fridge and microwave are split-with-your-roommate conversations. have them before
              you both show up with one of each.
            </p>
          </section>

          {/* CTA */}
          <section className="mt-11 rounded-2xl bg-lime p-8 text-bg">
            <h2 className="font-display text-[clamp(26px,6vw,32px)] font-bold leading-tight">
              want to see this in <em className="italic">your</em> room first?
            </h2>
            <p className="mt-2.5 max-w-[44ch] text-[15px] text-bg/80">
              drop a pic of your actual room (or pick your dorm's layout) and see the whole look on
              your real walls before you buy any of it.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-bg px-6 py-3.5 text-[14.5px] font-bold text-ink transition-transform active:scale-95"
            >
              try the dorm designer →
            </Link>
          </section>
        </main>

        <footer className="mt-5 pt-10 pb-24">
          <p className="border-t border-hairline pt-4 text-xs leading-[1.6] text-ink-dim">
            <b className="text-ink-muted">the honest fine print:</b> as an amazon associate, we earn
            from qualifying purchases made through links on this page — at no extra cost to you.
            prices shown were accurate at the time of writing and can change; the price on amazon at
            checkout is the real one. we only list things we'd put in a room we designed.
          </p>
          <p className="mt-3 text-xs text-ink-dim">
            dormie · by reimaginehome ai
          </p>
        </footer>
      </div>

      {/* sticky damage bar */}
      <div
        className={
          "fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-lime/40 bg-card px-5 py-2.5 text-[13px] shadow-[0_10px_34px_rgba(0,0,0,0.4)] transition-transform duration-500 " +
          (showBar ? "translate-y-0" : "translate-y-24")
        }
        aria-hidden={!showBar}
      >
        <span className="font-semibold text-ink-dim">the damage so far</span>
        <span className="font-display text-lg font-bold tabular-nums text-lime">${damage}</span>
        <span className="text-[11px] tabular-nums text-ink-dim">
          {seen.size} of {ITEMS.length}
        </span>
      </div>
    </div>
  );
}

function Badge({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={
        "rounded-full border px-3 py-1.5 text-xs font-semibold " +
        (accent
          ? "border-lime bg-lime text-bg"
          : "border-hairline bg-card text-ink-muted")
      }
    >
      {children}
    </span>
  );
}
