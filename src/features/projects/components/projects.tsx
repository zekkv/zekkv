import { useState } from "react";
import type { StrapiProject } from "@/lib/strapi";

interface Props {
  projects: StrapiProject[];
}

export function Projects({ projects }: Props) {
  const [activeId, setActiveId] = useState<string | null>(
    projects[0]?.documentId ?? null
  );
  const active = projects.find(p => p.documentId === activeId) ?? projects[0];

  return (
    <>
      {/* Mobile: inline records under the selected row */}
      <ul className="-mt-2 lg:hidden">
        {projects.map(p => {
          const selected = p.documentId === active?.documentId;
          return (
            <li key={p.documentId} className="border-t border-hairline">
              <Row
                project={p}
                selected={selected}
                onSelect={() => setActiveId(p.documentId)}
                controls={`${p.documentId}-record-m`}
              />
              <div
                id={`${p.documentId}-record-m`}
                className={`pb-10 ${selected ? "swap-in" : ""}`}
                hidden={!selected}
              >
                <Record project={p} />
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop: index left, record right */}
      <div className="hidden lg:block">
        <p className="font-mono text-[11px] tracking-wide text-faint">
          {projects.length} records · newest first
        </p>
        <div className="mt-6 grid lg:grid-cols-[23rem_minmax(0,1fr)] lg:gap-24">
          <ul>
            {projects.map(p => (
              <li key={p.documentId} className="border-t border-hairline">
                <Row
                  project={p}
                  selected={p.documentId === active?.documentId}
                  onSelect={() => setActiveId(p.documentId)}
                  hoverSelect
                  controls={`${p.documentId}-record-d`}
                />
              </li>
            ))}
          </ul>

          <div className="self-start lg:sticky lg:top-16 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            {projects.map(p => {
              const selected = p.documentId === active?.documentId;
              return (
                <div
                  key={p.documentId}
                  id={`${p.documentId}-record-d`}
                  className={selected ? "swap-in" : ""}
                  hidden={!selected}
                >
                  <Record project={p} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function Row({
  project,
  selected,
  onSelect,
  controls,
  hoverSelect = false,
}: {
  project: StrapiProject;
  selected: boolean;
  onSelect: () => void;
  controls: string;
  hoverSelect?: boolean;
}) {
  return (
    <h2>
      <button
        type="button"
        onClick={onSelect}
        {...(hoverSelect ? { onMouseEnter: onSelect } : {})}
        onFocus={onSelect}
        aria-expanded={selected}
        aria-controls={controls}
        className={`relative block w-full cursor-pointer py-5 pr-2 text-left transition-colors duration-150 ${
          selected ? "" : "hover:text-viridian"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute -left-7 top-[1.9rem] hidden h-px w-4 bg-viridian transition-opacity duration-150 lg:block ${
            selected ? "opacity-100" : "opacity-0"
          }`}
        />
        <span className="block font-display text-[1.35rem] leading-snug">
          {project.title}
        </span>
        <span className="mt-1.5 block font-mono text-[11px] tracking-wide text-graphite">
          {project.duration}
          {project.category && ` · ${project.category}`}
        </span>
      </button>
    </h2>
  );
}

function Record({ project }: { project: StrapiProject }) {
  return (
    <article className="lg:max-w-136">
      <p className="hidden font-display text-[1.7rem] leading-tight tracking-[-0.01em] lg:block">
        {project.title}
      </p>

      {project.summary && (
        <p className="mt-5 text-graphite">{project.summary}</p>
      )}

      <ul className="mt-6 space-y-3.5">
        {project.description.map((point, i) => (
          <li key={i} className="flex gap-3.5">
            <span
              aria-hidden="true"
              className="shrink-0 pt-0.5 font-mono text-xs text-faint"
            >
              —
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {project.techStack.length > 0 && (
        <div className="mt-8 border-t border-hairline pt-5">
          <h3 className="font-mono text-[11px] tracking-wide text-faint">
            Stack
          </h3>
          <p className="mt-2 font-mono text-xs leading-relaxed text-graphite">
            {project.techStack.join(" · ")}
          </p>
        </div>
      )}

      {(project.githubLink || project.liveLink) && (
        <div className="mt-6 flex gap-7 pb-2 text-sm">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} — source`}
              className="quiet-link"
            >
              Source<span aria-hidden="true">↗</span>
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} — live site`}
              className="quiet-link"
            >
              Live<span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}
