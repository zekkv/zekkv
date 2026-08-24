import type { StrapiExperience } from "@/lib/strapi";
import Page from "@/components/layout/page";

interface Props {
  experiences: StrapiExperience[];
}

export default function ExperiencePage({ experiences }: Props) {
  return (
    <Page title="Experience" lede="Where I've worked, newest first.">
      <ul>
        {experiences.map(exp => (
          <li key={exp.documentId} className="border-t border-hairline py-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-1">
              <h2 className="font-display text-[1.3rem] leading-snug">
                {exp.company}
              </h2>
              <p className="font-mono text-[11px] tracking-wide text-graphite">
                {[exp.duration, exp.location].filter(Boolean).join(" · ")}
              </p>
            </div>
            <p className="mt-2 text-graphite">{exp.role}</p>
            {exp.bullets && exp.bullets.length > 0 && (
              <ul className="mt-6 space-y-3.5">
                {exp.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="shrink-0 pt-0.5 font-mono text-xs text-faint"
                    >
                      —
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Page>
  );
}
