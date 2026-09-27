import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Spotify, Youtube } from "@/components/spotify";
import { spotify, youtube } from "@/lib/site";

export const Route = createFileRoute("/music")({
  head: () => ({
    meta: [
      { title: "Music · EKSTAZ" },
      { name: "description", content: "EKSTAZ playlists." },
    ],
  }),
  component: Music,
});

function Music() {
  const [open, setOpen] = useState<string>(spotify[0].id);

  return (
    <Shell>
      <main className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-crimson">Listen</p>
        <h1 className="mt-4 font-serif text-5xl leading-none text-bone md:text-7xl">Music</h1>
        <img src="/media/soul/lsd.jpg" alt="LSD" className="mt-12 w-full" />

        <section className="mt-14 flex flex-col">
          <h2 className="font-serif text-xs uppercase tracking-[0.28em] text-muted">Spotify</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {spotify.map((item) => {
              const active = open === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-expanded={active}
                    onClick={() => setOpen(item.id)}
                    className="flex min-h-14 w-full items-center justify-between text-left font-serif text-lg text-bone"
                  >
                    {item.title}
                    <span className="text-xs uppercase tracking-[0.22em] text-crimson">
                      {active ? "Open" : "Play"}
                    </span>
                  </button>
                  {active ? (
                    <div className="pb-6">
                      <Spotify id={item.id} title={item.title} tall />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-16 flex flex-col">
          <h2 className="font-serif text-xs uppercase tracking-[0.28em] text-muted">YouTube</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {youtube.map((item) => {
              const key = `yt-${item.id}`;
              const active = open === key;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-expanded={active}
                    onClick={() => setOpen(key)}
                    className="flex min-h-14 w-full items-center justify-between text-left font-serif text-lg text-bone"
                  >
                    {item.title}
                    <span className="text-xs uppercase tracking-[0.22em] text-crimson">
                      {active ? "Open" : "Play"}
                    </span>
                  </button>
                  {active ? (
                    <div className="pb-6">
                      <Youtube id={item.id} title={item.title} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </Shell>
  );
}
