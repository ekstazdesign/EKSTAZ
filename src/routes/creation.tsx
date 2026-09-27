import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/creation")({
  head: () => ({
    meta: [
      { title: "Creation · EKSTAZ" },
      { name: "description", content: "EKSTAZ posters, the magazine, and Beyond the Octagon." },
    ],
  }),
  component: Creation,
});

function Creation() {
  return (
    <Shell>
      <main>
        <header className="mx-auto max-w-5xl px-5 pb-8 pt-16 md:pt-24">
          <p className="font-serif text-xs uppercase tracking-[0.35em] text-crimson">Work</p>
          <h1 className="mt-4 font-serif text-5xl leading-none text-bone md:text-7xl">Creation</h1>
        </header>

        <img
          src="/media/soul/strain.jpg"
          alt="A new strain of exotic hype design"
          className="mx-auto w-full max-w-3xl"
        />

        <section className="bg-ink pb-8">
          <div className="mx-auto grid max-w-4xl gap-8 px-5 py-10 md:grid-cols-2">
            <img src="/media/soul/face-red.jpg" alt="A face, drawn in red and green" className="w-full" />
            <img src="/media/soul/face-pencil.jpg" alt="A face, in pencil" className="w-full" />
          </div>
          <img src="/media/soul/desk.jpg" alt="Before thee, on the desk" className="mx-auto w-full max-w-3xl" />
          <img
            src="/media/soul/blueprint.jpg"
            alt="EKSTAZ blueprint"
            className="mx-auto mt-16 w-full max-w-4xl"
          />
        </section>

        <div className="mx-auto flex max-w-5xl flex-col gap-20 px-5 py-16 md:gap-28 md:py-24">
          <article className="grid items-center gap-10 md:grid-cols-[18rem_1fr]">
            <a href="/media/magazine.pdf" target="_blank" rel="noreferrer" className="block">
              <img src="/media/magazine-cover.png" alt="EKSTAZ magazine cover" className="w-full" />
            </a>
            <div>
              <p className="font-serif text-xs uppercase tracking-[0.35em] text-crimson">Issue</p>
              <h2 className="mt-4 font-serif text-5xl leading-none text-bone md:text-7xl">Magazine</h2>
              <p className="mt-6 max-w-sm font-serif text-lg leading-relaxed text-muted">
                The issue. Cover first. The file opens when you want it.
              </p>
              <a
                href="/media/magazine.pdf"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex min-h-11 items-center font-serif text-xs uppercase tracking-[0.28em] text-crimson"
              >
                Open the PDF
              </a>
            </div>
          </article>

          <article className="grid items-center gap-10 border-t border-line pt-16 md:grid-cols-[1fr_22rem]">
            <div>
              <p className="font-serif text-xs uppercase tracking-[0.35em] text-crimson">Document</p>
              <h2 className="mt-4 font-serif text-4xl leading-none text-bone md:text-6xl">
                Beyond the Octagon
              </h2>
              <a
                href="/media/beyond-the-octagon.pdf"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex min-h-11 items-center font-serif text-xs uppercase tracking-[0.28em] text-crimson"
              >
                Open the PDF
              </a>
            </div>
            <a href="/media/beyond-the-octagon.pdf" target="_blank" rel="noreferrer" className="block">
              <img src="/media/beyond-the-octagon.png" alt="Beyond the Octagon" className="w-full" />
            </a>
          </article>
        </div>
      </main>
    </Shell>
  );
}
