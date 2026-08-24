import type { StrapiToolkit } from "@/lib/strapi";
import Page from "@/components/layout/page";

interface Props {
  toolkit: StrapiToolkit;
}

export default function ToolkitPage({ toolkit }: Props) {
  const groups = [
    {
      label: "Languages",
      note: "What the systems are written in",
      items: toolkit.languages,
    },
    {
      label: "Cloud & platform",
      note: "Where they run",
      items: toolkit.cloud,
    },
    {
      label: "Frameworks & libraries",
      note: "What holds them together",
      items: toolkit.frameworks,
    },
  ];

  return (
    <Page title="Toolkit" lede="What I reach for, grouped by the job it does.">
      <ul>
        {groups.map(group => (
          <li key={group.label} className="border-t border-hairline py-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-10">
              <h2 className="text-[0.95rem] font-medium">{group.label}</h2>
              <p className="font-mono text-[11px] tracking-wide text-faint">
                {group.note}
              </p>
            </div>
            <p className="mt-3 max-w-[40rem] leading-[1.9] text-graphite">
              {group.items.join(" · ")}
            </p>
          </li>
        ))}
      </ul>
    </Page>
  );
}
