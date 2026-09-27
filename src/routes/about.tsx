import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Spotify } from "@/components/spotify";
import { aboutBrand, aboutElton, aboutPlaylist, personalSocials } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · EKSTAZ" },
      { name: "description", content: "About Elton. I am EKSTAZ." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Shell>
      <main className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:py-24">
        <figure className="md:sticky md:top-28 md:self-start">
          <img
            src="/media/elton.jpg"
            alt="Elton D'Souza"
            className="w-full max-w-md grayscale"
          />
          <img src="/media/soul/elty.jpg" alt="Elty, drawn" className="mt-4 w-full max-w-md" />
        </figure>
        <div className="flex flex-col gap-12">
          <section>
            <h1 className="font-serif text-xs uppercase tracking-[0.35em] text-crimson">About Elton</h1>
            <div className="mt-6 flex flex-col gap-6 font-serif text-lg leading-relaxed text-bone md:text-xl">
              {aboutElton.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              <p className="text-crimson">I am EKSTAZ</p>
            </div>
            <img
              src="/media/soul/dont-fit-in.jpg"
              alt="Don't fit in"
              className="mt-10 w-full max-w-sm"
            />
          </section>
          <section>
            <h2 className="font-serif text-xs uppercase tracking-[0.35em] text-crimson">About EKSTAZ</h2>
            <p className="mt-6 font-serif text-lg leading-relaxed text-bone">{aboutBrand}</p>
            <img src="/media/soul/before-thee.jpg" alt="Before thee, EKSTAZ" className="mt-10 w-full max-w-md" />
          </section>
          <section className="border-t border-line pt-8">
            <h2 className="font-serif text-xs uppercase tracking-[0.28em] text-muted">{aboutPlaylist.title}</h2>
            <div className="mt-4">
              <Spotify id={aboutPlaylist.id} title={aboutPlaylist.title} />
            </div>
            <ul className="mt-6 flex gap-6">
              {personalSocials.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-serif text-xs uppercase tracking-[0.2em] text-muted hover:text-bone"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </Shell>
  );
}
