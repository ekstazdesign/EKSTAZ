import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { brandSocials, nav } from "@/lib/site";

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-svh bg-ink text-bone">
      <header className="sticky top-0 z-20 border-b border-line bg-ink/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 md:flex-row md:items-end md:justify-between">
          <Link to="/" className="font-serif text-2xl leading-none tracking-tight text-crimson">
            EKSTAZ
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Pages">
            {nav.map((item) => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`font-serif text-xs uppercase tracking-[0.22em] ${
                    active ? "text-crimson" : "text-bone hover:text-crimson"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-line px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="font-serif text-xs uppercase tracking-[0.35em] text-crimson">Don't fit in</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {brandSocials.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-serif text-xs uppercase tracking-[0.18em] text-muted hover:text-bone"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
