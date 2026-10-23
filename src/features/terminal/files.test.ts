import { expect, test } from "vitest";
import { HOME, toFiles } from "./files";

test("every page becomes a markdown file", () => {
  const files = toFiles({
    profile: {
      id: 1,
      documentId: "p",
      name: "Charles Isaac Velasco",
      initials: "CV",
      email: "me@example.com",
      phone: "",
      location: "Singapore",
      linkedin: "https://linkedin.com/in/x",
      github: "https://github.com/x",
      now: "SMU",
      last: "EIU",
    },
    projects: [
      {
        id: 1,
        documentId: "a",
        title: "Rides & Routes (v2)",
        role: "Backend",
        duration: "2025",
        description: ["Built the API"],
        techStack: ["Go"],
        githubLink: "https://github.com/x/rides",
      },
    ],
    experiences: [
      {
        id: 1,
        documentId: "e",
        company: "EIU",
        role: "Intern",
        location: "",
        duration: "2024",
        bullets: null,
      },
    ],
    education: [
      {
        id: 1,
        documentId: "d",
        school: "DWCB",
        degree: null,
        duration: "2018",
      },
    ],
    toolkit: {
      id: 1,
      documentId: "t",
      languages: ["Go"],
      cloud: [],
      frameworks: [],
    },
  });

  expect(Object.keys(files).sort()).toEqual(
    [
      "README.md",
      "education.md",
      "experience.md",
      "projects/rides-routes-v2.md",
      "toolkit.md",
    ].map(f => `${HOME}/${f}`)
  );
  expect(files[`${HOME}/README.md`]).toContain(
    "- GitHub: https://github.com/x"
  );
  expect(files[`${HOME}/experience.md`]).toContain("## EIU\n\nIntern · 2024\n");
  expect(files[`${HOME}/education.md`]).toContain("## DWCB\n\n2018\n");
  const project = files[`${HOME}/projects/rides-routes-v2.md`];
  expect(project).toContain("- Source: https://github.com/x/rides");
  expect(project).not.toContain("Live:");
  expect(project).not.toContain("undefined");
});
