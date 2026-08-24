import type { StrapiEducation } from "@/lib/strapi";
import Page from "@/components/layout/page";

interface Props {
  education: StrapiEducation[];
}

export default function EducationPage({ education }: Props) {
  return (
    <Page title="Education" lede="Schooling, newest first.">
      <ul>
        {education.map(edu => (
          <li key={edu.documentId} className="border-t border-hairline py-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-1">
              <h2 className="font-display text-[1.3rem] leading-snug">
                {edu.school}
              </h2>
              <p className="font-mono text-[11px] tracking-wide text-graphite">
                {edu.duration}
              </p>
            </div>
            <p className="mt-2 text-graphite">{edu.degree}</p>
            {edu.track && (
              <p className="mt-1 text-sm text-faint">{edu.track}</p>
            )}
          </li>
        ))}
      </ul>
    </Page>
  );
}
