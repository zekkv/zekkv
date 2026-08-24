interface PageProps {
  title: string;
  lede?: string;
  wide?: boolean;
  children: React.ReactNode;
}

/* Content hangs from the rail instead of floating centred. */
export const SHELL =
  "mx-auto w-full max-w-[44rem] px-6 sm:px-10 lg:mx-0 lg:ml-[8.75rem]";
const SHELL_WIDE =
  "mx-auto w-full max-w-[64rem] px-6 sm:px-10 lg:ml-[calc(50%-29rem)]";

export default function Page({
  title,
  lede,
  wide = false,
  children,
}: PageProps) {
  const shell = wide ? SHELL_WIDE : SHELL;
  return (
    <div className="rise-in pt-20 pb-28 sm:pt-24 sm:pb-36">
      <div className={shell}>
        <header>
          <h1 className="mt-7 font-display text-[clamp(1.9rem,3.5vw,2.5rem)] leading-tight tracking-[-0.01em]">
            {title}
          </h1>
          {lede && <p className="mt-5 max-w-[38rem] text-graphite">{lede}</p>}
        </header>
        <div className="mt-14">{children}</div>
      </div>
    </div>
  );
}
