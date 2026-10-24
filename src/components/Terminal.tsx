import { useEffect, useRef, useState } from "react";
import { Minus, Square, X, FastForward, Lock } from "lucide-react";
import type { Line } from "../lib/engine";

interface Props {
  lines: Line[];
  booting: boolean;
  onSubmit: (cmd: string) => void;
  onSkipBoot: () => void;
}

const KIND_CLASS: Record<Line["kind"], string> = {
  input: "text-phos-pale font-bold",
  output: "text-phos",
  dim: "text-phos-dim",
  bright: "text-phos-bright glow-soft font-semibold",
  success: "text-phos-bright glow font-bold",
  warn: "bg-phos text-black font-bold px-1.5 w-fit",
  ascii: "text-phos glow",
  progress: "text-phos-bright glow-soft",
};

export const PROMPT = "visitor@blackscreen:~$";

export default function Terminal({ lines, booting, onSubmit, onSkipBoot }: Props) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, booting]);

  const focusInput = () => inputRef.current?.focus();

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = value;
      setValue("");
      setHistIdx(-1);
      if (cmd.trim()) setHistory((h) => [cmd, ...h].slice(0, 50));
      onSubmit(cmd);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) {
        const next = Math.min(histIdx + 1, history.length - 1);
        setHistIdx(next);
        setValue(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx > 0) {
        const next = histIdx - 1;
        setHistIdx(next);
        setValue(history[next]);
      } else {
        setHistIdx(-1);
        setValue("");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      onSubmit("clear");
      setValue("");
    }
  };

  return (
    <section className="flex min-h-0 flex-col border border-phos-faint bg-panel/90 shadow-[0_0_45px_rgba(0,255,65,0.07)] backdrop-blur-[2px]">
      {/* window chrome */}
      <header className="flex items-center gap-3 border-b border-phos-faint bg-panel2 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <button
            className="flex h-5 w-5 items-center justify-center border border-phos-faint text-phos-dim transition-colors hover:bg-phos hover:text-black"
            aria-label="close (decorative)"
          >
            <X size={11} strokeWidth={3} />
          </button>
          <button
            className="flex h-5 w-5 items-center justify-center border border-phos-faint text-phos-dim transition-colors hover:bg-phos hover:text-black"
            aria-label="minimize (decorative)"
          >
            <Minus size={11} strokeWidth={3} />
          </button>
          <button
            className="flex h-5 w-5 items-center justify-center border border-phos-faint text-phos-dim transition-colors hover:bg-phos hover:text-black"
            aria-label="maximize (decorative)"
          >
            <Square size={9} strokeWidth={3} />
          </button>
        </div>
        <p className="truncate text-[11px] tracking-widest text-phos-dim sm:text-xs">
          visitor@blackscreen: ~/display — bash (not real)
        </p>
        <div className="ml-auto flex items-center gap-2">
          {booting && (
            <button
              onClick={onSkipBoot}
              className="flex items-center gap-1 border border-phos px-2 py-0.5 text-[10px] font-bold tracking-widest text-phos transition-colors hover:bg-phos hover:text-black"
            >
              SKIP BOOT <FastForward size={11} />
            </button>
          )}
          <span className="hidden items-center gap-1 text-[10px] tracking-widest text-phos-faint sm:flex">
            <Lock size={10} /> ENCRYPTION: THEATRICAL
          </span>
        </div>
      </header>

      {/* output */}
      <div
        ref={scrollRef}
        onClick={focusInput}
        className="term-scroll min-h-[380px] flex-1 cursor-text overflow-y-auto px-3 py-3 sm:min-h-[440px] sm:px-4"
      >
        {lines.map((line) =>
          line.kind === "ascii" ? (
            <pre
              key={line.id}
              className="overflow-x-auto whitespace-pre pb-2 text-[6.5px] leading-[1.1] text-phos glow sm:text-[9px] lg:text-[10px]"
            >
              {line.text}
            </pre>
          ) : (
            <p
              key={line.id}
              className={`animate-rise whitespace-pre-wrap break-words text-xs leading-[1.55] sm:text-[13px] ${KIND_CLASS[line.kind]}`}
            >
              {line.text || "\u00A0"}
            </p>
          )
        )}

        {/* prompt */}
        <div className="mt-1 flex items-center gap-2 text-xs sm:text-[13px]">
          <span className="shrink-0 font-bold text-phos-bright glow-soft">
            {PROMPT}
          </span>
          {booting ? (
            <span className="inline-block h-4 w-2.5 animate-blink bg-phos" />
          ) : (
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              className="term-input min-w-0 flex-1 bg-transparent font-bold text-phos-pale outline-none"
              placeholder="type 'help' and press enter..."
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="fake terminal input"
            />
          )}
        </div>
      </div>

      {/* status strip */}
      <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-phos-faint bg-panel2 px-3 py-1.5 text-[10px] tracking-widest text-phos-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse-dot bg-phos" />
          LIVE FEED (FAKE)
        </span>
        <span>SESSION: DISPLAY-ONLY</span>
        <span className="hidden sm:inline">SHELL: /bin/vibes</span>
        <span className="ml-auto hidden md:inline">CTRL+L = CLEAR</span>
      </footer>
    </section>
  );
}
