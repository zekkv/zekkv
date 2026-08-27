import { useEffect, useState, useSyncExternalStore } from "react";
import { Link, getRouteApi } from "@tanstack/react-router";
import { useTheme } from "next-themes";

// ponytail: NAV mirrors the route files (typed `to` paths) — not CMS content, stays local.
const NAV = [
  { to: "/", label: "Index" },
  { to: "/projects", label: "Work" },
  { to: "/experience", label: "Experience" },
  { to: "/toolkit", label: "Toolkit" },
  { to: "/education", label: "Education" },
] as const;

const rootRoute = getRouteApi("__root__");

function useContact() {
  const { email, github, linkedin } = rootRoute.useLoaderData();
  return [
    { href: `mailto:${email}`, label: "Email" },
    { href: github, label: "GitHub" },
    { href: linkedin, label: "LinkedIn" },
  ];
}

function external(href: string) {
  return href.startsWith("http")
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}

export default function Chrome({ children }: { children: React.ReactNode }) {
  const contact = useContact();
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:text-viridian"
      >
        Skip to content
      </a>

      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[16.5rem] flex-col justify-between border-r border-hairline px-9 py-11 lg:flex">
        <div>
          <Link to="/" className="block">
            <span className="font-display text-[1.35rem] leading-snug">
              Charles Isaac
              <br />
              Velasco
            </span>
            <span className="mt-3 block font-mono text-[11px] tracking-wide text-graphite">
              Backend &amp; cloud engineer
            </span>
          </Link>

          <nav aria-label="Primary" className="mt-14">
            <ul className="space-y-3">
              {NAV.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}>
                    {({ isActive }: { isActive: boolean }) => (
                      <span
                        className={`relative block pl-5 transition-colors duration-150 ${
                          isActive
                            ? "text-foreground"
                            : "text-graphite hover:text-foreground"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 transition-colors duration-150 ${
                            isActive ? "bg-viridian" : "bg-transparent"
                          }`}
                        />
                        {label}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="space-y-6">
          <ContactList
            contact={contact}
            listClassName="space-y-1.5"
            linkClassName="text-[0.85rem] text-graphite underline decoration-hairline underline-offset-4 transition-colors duration-150 hover:text-viridian"
          />

          <div className="flex items-center justify-between border-t border-hairline pt-4 font-mono text-[11px] text-graphite">
            <span className="flex items-center gap-2">
              <TimeStatus />
            </span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="flex min-h-svh flex-col lg:pl-[16.5rem]">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 border-b border-hairline bg-background/90 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between px-6 py-3.5">
            <Link to="/" className="font-display text-lg">
              Charles Velasco
            </Link>
            <ThemeToggle />
          </div>
          <nav
            aria-label="Primary"
            className="overflow-x-auto whitespace-nowrap px-6 pb-3"
          >
            <ul className="flex gap-5 font-mono text-xs">
              {NAV.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}>
                    {({ isActive }: { isActive: boolean }) => (
                      <span className={isActive ? "text-viridian" : ""}>
                        {label.toLowerCase()}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main id="content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>

        {/* Mobile footer */}
        <footer className="border-t border-hairline px-6 py-9 lg:hidden">
          <ContactList
            contact={contact}
            listClassName="flex gap-5"
            linkClassName="text-sm text-graphite underline decoration-hairline underline-offset-4 hover:text-viridian"
          />
          <p className="mt-5 flex items-center gap-2 font-mono text-[11px] text-graphite">
            <TimeStatus suffix=" SGT" />
          </p>
        </footer>
      </div>
    </>
  );
}

function ContactList({
  contact,
  listClassName,
  linkClassName,
}: {
  contact: { href: string; label: string }[];
  listClassName: string;
  linkClassName: string;
}) {
  return (
    <ul className={listClassName}>
      {contact.map(({ href, label }) => (
        <li key={label}>
          <a href={href} {...external(href)} className={linkClassName}>
            {label}
            <span aria-hidden="true" className="ml-0.5 text-faint">
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function TimeStatus({ suffix }: { suffix?: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full bg-viridian"
      />
      Singapore&nbsp;&nbsp;
      <Clock />
      {suffix}
    </>
  );
}

function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Singapore",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time ?? "--:--"}</span>;
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!hydrated) {
    return (
      <span aria-hidden="true" className="invisible font-mono text-[11px]">
        dim
      </span>
    );
  }

  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      title={dark ? "Switch to light" : "Switch to dark"}
      className="cursor-pointer font-mono text-[11px] text-graphite transition-colors duration-150 hover:text-viridian"
    >
      {dark ? "light" : "dim"}
    </button>
  );
}
