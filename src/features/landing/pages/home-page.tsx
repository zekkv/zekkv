import { Link } from "@tanstack/react-router";
import type { StrapiUserProfile } from "@/lib/strapi";
import { SHELL } from "@/components/layout/page";

interface Props {
  profile: StrapiUserProfile;
}

export default function HomePage({ profile }: Props) {
  return (
    <section className="rise-in pt-14 pb-28 sm:pt-20 sm:pb-40">
      <div className={SHELL}>
        <h1 className="mt-9 font-display text-[clamp(2rem,4.5vw,2.75rem)] leading-[1.22] tracking-[-0.01em]">
          I like building backend systems and wiring up cloud infrastructure.
        </h1>

        <p className="mt-8 max-w-152 text-graphite">
          I'm a penultimate at Singapore Management University - BSc Information
          Systems. Still learning, but I take it seriously.
        </p>

        <div className="mt-10 flex flex-wrap gap-x-9 gap-y-3 text-sm">
          <Link to="/projects" className="quiet-link">
            See the work
            <span aria-hidden="true" className="ml-1.5">
              ↓
            </span>
          </Link>
          <a href={`mailto:${profile.email}`} className="quiet-link">
            Write to me
            <span aria-hidden="true" className="ml-1.5 text-faint">
              ↗
            </span>
          </a>
        </div>
      </div>

      <div className={`${SHELL} mt-10 border-t border-hairline pt-6 sm:mt-14`}>
        <dl className="flex flex-wrap gap-x-14 gap-y-4 font-mono text-[11px] leading-relaxed tracking-wide">
          <div>
            <dt className="text-faint">now</dt>
            <dd className="mt-1 text-graphite">{profile.now}</dd>
          </div>
          <div>
            <dt className="text-faint">last</dt>
            <dd className="mt-1 text-graphite">{profile.last}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
