import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

const letters = ["e", "k", "s", "t", "a", "z"] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EKSTAZ" },
      {
        name: "description",
        content: "A new strain of exotic hype design.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Shell>
      <main className="flex min-h-[calc(100svh-4.5rem)] flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <h1 className="rise flex w-full items-end justify-center gap-1 md:gap-3">
            <span className="sr-only">EKSTAZ</span>
            {letters.map((letter) => (
              <img
                key={letter}
                src={`/media/type/${letter}.png`}
                alt=""
                className="h-[clamp(4.25rem,14vw,13rem)] w-auto"
              />
            ))}
          </h1>
          <p className="rise mt-10 max-w-md font-serif text-sm uppercase tracking-[0.32em] text-bone md:text-base">
            A new strain of exotic hype design
          </p>
        </div>
        <p className="pb-14 text-center font-serif text-xs uppercase tracking-[0.5em] text-crimson">
          Don't fit in
        </p>
        <img src="/media/soul/pain.jpg" alt="Pain. Hands around an eye." className="w-full" />
      </main>
    </Shell>
  );
}
