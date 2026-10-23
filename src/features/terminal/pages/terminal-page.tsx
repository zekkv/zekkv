import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Bash } from "just-bash/browser";
import { HOME } from "../files";

// Table rows stay ≤35 columns so they don't wrap at phone width.
const MOTD = `ciav.dev, terminal view.
every page on the site is a markdown file in here.

  cat README.md       start here
  ls projects         my work
  help                builtins
  exit                back to gui
`;

const CLEAR = "\u001b[2J\u001b[H";
// Visible addresses in output become links; the rest renders as plain text.
const LINK = /(https?:\/\/[^\s<>()]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/;
const MAX_LINES = 300;

interface Line {
  id: number;
  prompt?: string;
  text: string;
}

const promptFor = (cwd: string) =>
  `charles@ciav.dev:${cwd === HOME || cwd.startsWith(`${HOME}/`) ? `~${cwd.slice(HOME.length)}` : cwd}$`;

export default function TerminalPage({
  files,
}: {
  files: Record<string, string>;
}) {
  const navigate = useNavigate();
  const [lines, setLines] = useState<Line[]>([{ id: 0, text: MOTD }]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState(HOME);
  const [running, setRunning] = useState(false);
  const shell = useRef<Promise<Bash> | null>(null);
  const env = useRef<Record<string, string> | undefined>(undefined);
  const abort = useRef<AbortController | null>(null);
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Client-only: keeps the ~350 KB shell out of the Worker bundle and the main chunk.
    if (import.meta.env.SSR) return;
    shell.current = import("just-bash/browser").then(
      ({ Bash, defineCommand }) => {
        // Built-ins report "user@localhost"; match the prompt instead.
        const say = (name: string, text: string) =>
          defineCommand(name, async () => ({
            stdout: `${text}\n`,
            stderr: "",
            exitCode: 0,
          }));
        return new Bash({
          files,
          cwd: HOME,
          env: { HOME, USER: "charles" },
          customCommands: [
            say("whoami", "charles"),
            say("hostname", "ciav.dev"),
          ],
          executionLimits: { maxOutputSize: 256 * 1024 },
        });
      }
    );
    inputRef.current?.focus();
  }, [files]);

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
  }, [lines]);

  const print = (text: string, prompt?: string) =>
    setLines(l =>
      [...l, { id: nextId.current++, prompt, text }].slice(-MAX_LINES)
    );

  async function run(cmd: string) {
    print(cmd, promptFor(cwd));
    setInput("");
    if (!cmd.trim()) return;
    history.current.push(cmd);
    cursor.current = history.current.length;
    if (cmd.trim() === "exit") return navigate({ to: "/" });
    if (!shell.current) return;

    setRunning(true);
    abort.current = new AbortController();
    try {
      const bash = await shell.current;
      const r = await bash.exec(cmd, {
        cwd,
        env: env.current,
        signal: abort.current.signal,
      });
      env.current = r.env;
      setCwd(r.env.PWD ?? cwd);
      let out = r.stdout + r.stderr;
      if (out.includes(CLEAR)) {
        setLines([]);
        out = out.slice(out.lastIndexOf(CLEAR) + CLEAR.length);
      }
      if (out) print(out);
    } catch (error) {
      print(
        `bash: ${error instanceof Error ? error.message : String(error)}\n`
      );
    } finally {
      setRunning(false);
      abort.current = null;
    }
  }

  async function complete() {
    if (!shell.current) return;
    const { fs } = await shell.current;
    const word = input.slice(input.lastIndexOf(" ") + 1);
    const cut = word.lastIndexOf("/") + 1;
    const dir = word.slice(0, cut);
    const base = word.slice(cut);
    const abs = fs.resolvePath(cwd, (dir || ".").replace(/^~(?=\/|$)/, HOME));
    const names = await fs
      .readdir(abs)
      .then(all => all.filter(n => n.startsWith(base)))
      .catch(() => []);
    if (names.length === 0) return;

    let common = names.reduce((a, n) => {
      let i = 0;
      while (i < a.length && a[i] === n[i]) i++;
      return a.slice(0, i);
    });
    if (names.length === 1) {
      const { isDirectory } = await fs.stat(fs.resolvePath(abs, common));
      common += isDirectory ? "/" : " ";
    } else if (common === base) {
      print(input, promptFor(cwd));
      print(`${names.join("  ")}\n`);
    }
    setInput(input.slice(0, input.length - word.length) + dir + common);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (!running) void run(input);
    } else if (e.key === "Tab" && input) {
      e.preventDefault();
      // Completion is best-effort; a failed chunk load already surfaces on Enter.
      complete().catch(() => {});
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      cursor.current = Math.max(
        0,
        Math.min(h.length, cursor.current + (e.key === "ArrowUp" ? -1 : 1))
      );
      setInput(h[cursor.current] ?? "");
    } else if (
      e.ctrlKey &&
      e.key.toLowerCase() === "c" &&
      !hasSelection(e.currentTarget)
    ) {
      e.preventDefault();
      if (abort.current) abort.current.abort();
      else {
        print(`${input}^C`, promptFor(cwd));
        setInput("");
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    // Mouse-only convenience: clicking anywhere refocuses the prompt. Keyboard
    // users are already in the input, so there's no key handler to add.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="flex min-h-svh flex-col font-mono text-base sm:text-sm"
      onClick={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      <div className="flex-1 px-4 py-4 sm:px-6">
        <div
          role="log"
          aria-label="Terminal output"
          className="whitespace-pre-wrap break-words"
        >
          {lines.map(l => (
            <div key={l.id}>
              {l.prompt && <span className="text-viridian">{l.prompt} </span>}
              <Linkified text={l.text} />
            </div>
          ))}
        </div>

        <div className="flex gap-[1ch]">
          <label
            htmlFor="terminal-input"
            className={`shrink-0 text-viridian ${running ? "invisible" : ""}`}
          >
            {promptFor(cwd)}
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            // The caret is the focus indicator; the global :focus-visible ring would box the whole line.
            className="min-w-0 flex-1 bg-transparent caret-viridian outline-none!"
          />
        </div>
      </div>
    </div>
  );
}

// Ctrl+C with text selected is a copy, not an interrupt.
const hasSelection = (el: HTMLInputElement) =>
  el.selectionStart !== el.selectionEnd || !!window.getSelection()?.toString();

function Linkified({ text }: { text: string }) {
  return text.split(LINK).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.startsWith("http") ? part : `mailto:${part}`;
    return (
      <a
        key={i}
        href={href}
        {...(part.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="underline decoration-hairline underline-offset-4 hover:text-viridian"
      >
        {part}
      </a>
    );
  });
}
