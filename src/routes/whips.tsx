import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { whips } from "@/lib/site";

export const Route = createFileRoute("/whips")({
  head: () => ({
    meta: [
      { title: "Whips · EKSTAZ" },
      { name: "description", content: "EKSTAZ night film. The black car." },
    ],
  }),
  component: Whips,
});

function Whips() {
  const [lead, ...rest] = whips.film;

  return (
    <Shell>
      <main>
        <header className="relative">
          <img
            src={lead.src}
            alt={lead.alt}
            className="h-[88svh] w-full object-cover object-[72%_center]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-10 md:px-10 md:pb-14">
            <p className="font-serif text-xs uppercase tracking-[0.35em] text-crimson">Automotive</p>
            <h1 className="mt-3 font-serif text-7xl leading-none text-bone md:text-9xl">Whips</h1>
          </div>
        </header>

        <section className="bg-ink px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl font-serif text-2xl leading-snug text-bone md:text-4xl">
              The black one. Night shoot, full frame.
            </p>
            <a
              href="https://www.instagram.com/ekstaz.whips"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center font-serif text-xs uppercase tracking-[0.28em] text-crimson"
            >
              ekstaz.whips
            </a>
          </div>
        </section>

        <ul>
          {rest.map((shot) => (
            <li key={shot.src}>
              <img src={shot.src} alt={shot.alt} className="w-full" />
            </li>
          ))}
        </ul>

        <section className="bg-ink px-5 py-16 md:py-24">
          <p className="mx-auto max-w-6xl font-serif text-xs uppercase tracking-[0.35em] text-crimson">
            Moving
          </p>
          <div className="mx-auto mt-8 flex max-w-6xl justify-center">
            <video
              className="h-[88svh] w-auto max-w-full bg-ink"
              src="/media/whips/night.mp4"
              poster="/media/whips/04-profile.jpg"
              controls
              playsInline
              loop
              muted
              autoPlay
            />
          </div>
          <p className="mx-auto mt-6 max-w-6xl font-serif text-sm text-muted">
            Fifteen seconds from the same night. Sound is in the file — unmute it.
          </p>
        </section>

        <section className="border-t border-line bg-ink px-5 py-16 md:px-10 md:py-24">
          <h2 className="font-serif text-xs uppercase tracking-[0.35em] text-crimson">Drawn</h2>
          <ul className="mx-auto mt-10 flex max-w-4xl flex-col gap-16">
            {whips.designs.map((piece) => (
              <li key={piece.src}>
                <img src={piece.src} alt={piece.alt} className="w-full" />
                <p className="mt-4 font-serif text-2xl text-bone">{piece.title}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Shell>
  );
}
