import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { brandSocials } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · EKSTAZ" },
      { name: "description", content: "EKSTAZ on Instagram and YouTube." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <Shell>
      <main className="mx-auto flex min-h-[70svh] max-w-3xl flex-col justify-center px-5 py-20">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-crimson">Find EKSTAZ</p>
        <h1 className="mt-4 font-serif text-5xl leading-none text-bone md:text-7xl">Contact</h1>
        <ul className="mt-12 flex flex-col">
          {brandSocials.map((item) => (
            <li key={item.href} className="border-t border-line last:border-b">
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-16 items-center font-serif text-2xl text-bone hover:text-crimson md:text-4xl"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <img src="/media/soul/mark.jpg" alt="EKSTAZ mark" className="mt-16 w-40" />
      </main>
    </Shell>
  );
}
