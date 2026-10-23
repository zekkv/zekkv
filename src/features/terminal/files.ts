import type {
  StrapiEducation,
  StrapiExperience,
  StrapiProject,
  StrapiToolkit,
  StrapiUserProfile,
} from "@/lib/strapi";

export const HOME = "/home/charles";

interface Content {
  profile: StrapiUserProfile;
  projects: StrapiProject[];
  experiences: StrapiExperience[];
  education: StrapiEducation[];
  toolkit: StrapiToolkit;
}

type Maybe = string | false | null | undefined;

const md = (...blocks: Maybe[]) => `${blocks.filter(Boolean).join("\n\n")}\n`;

const list = (items: Maybe[]) =>
  items
    .filter(Boolean)
    .map(i => `- ${i}`)
    .join("\n");

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The site's pages as markdown files, keyed by absolute path. */
export function toFiles(c: Content): Record<string, string> {
  const files: Record<string, string> = {
    [`${HOME}/README.md`]: md(
      `# ${c.profile.name}`,
      "Backend & cloud engineer.",
      "I like building backend systems and wiring up cloud infrastructure.",
      "I'm a penultimate at Singapore Management University - BSc Information Systems. Still learning, but I take it seriously.",
      list([`now: ${c.profile.now}`, `last: ${c.profile.last}`]),
      "## Contact",
      list([
        `Email: ${c.profile.email}`,
        `GitHub: ${c.profile.github}`,
        `LinkedIn: ${c.profile.linkedin}`,
      ]),
      "## Look around",
      list([
        "projects/      selected work, one file per build",
        "experience.md  where I've worked",
        "toolkit.md     what I reach for",
        "education.md   schooling",
      ])
    ),

    [`${HOME}/experience.md`]: md(
      "# Experience",
      "Where I've worked, newest first.",
      ...c.experiences.map(e =>
        md(
          `## ${e.company}`,
          [e.role, e.duration, e.location].filter(Boolean).join(" · "),
          e.bullets && e.bullets.length > 0 && list(e.bullets)
        ).trimEnd()
      )
    ),

    [`${HOME}/education.md`]: md(
      "# Education",
      ...c.education.map(e =>
        md(
          `## ${e.school}`,
          [e.degree, e.duration].filter(Boolean).join(" · "),
          e.track
        ).trimEnd()
      )
    ),

    [`${HOME}/toolkit.md`]: md(
      "# Toolkit",
      "## Languages",
      c.toolkit.languages.join(", "),
      "## Cloud & platform",
      c.toolkit.cloud.join(", "),
      "## Frameworks & libraries",
      c.toolkit.frameworks.join(", ")
    ),
  };

  for (const p of c.projects) {
    files[`${HOME}/projects/${slug(p.title)}.md`] = md(
      `# ${p.title}`,
      [p.role, p.duration, p.category].filter(Boolean).join(" · "),
      p.summary,
      list(p.description),
      p.techStack.length > 0 && `## Stack\n\n${p.techStack.join(", ")}`,
      (p.githubLink || p.liveLink) &&
        `## Links\n\n${list([
          p.githubLink && `Source: ${p.githubLink}`,
          p.liveLink && `Live: ${p.liveLink}`,
        ])}`
    );
  }

  return files;
}
