import { useEffect, useRef, useState } from "react";
import { Radio, Pause, Play } from "lucide-react";
import { now, randomLog } from "../lib/engine";

interface Entry {
  id: number;
  time: string;
  level: string;
  text: string;
}

let counter = 0;
const makeEntry = (): Entry => {
  const log = randomLog();
  return { id: counter++, time: now(), level: log.level, text: log.text };
};

export default function LogFeed() {
  const [entries, setEntries] = useState<Entry[]>(() =>
    Array.from({ length: 9 }, makeEntry)
  );
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setEntries((prev) => [...prev.slice(-39), makeEntry()]);
    }, 1150);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  return (
    <section className="border border-phos-faint bg-panel/90 backdrop-blur-[2px]">
      <header className="flex items-center gap-2 border-b border-phos-faint bg-panel2 px-3 py-2">
        <Radio size={13} className="text-phos" />
        <h2 className="text-[11px] font-bold tracking-[0.2em] text-phos-bright">
          LIVE LOG STREAM
        </h2>
        <span className="flex items-center gap-1.5 text-[9px] tracking-widest text-phos-faint">
          <span
            className={`h-1.5 w-1.5 bg-phos ${paused ? "" : "animate-pulse-dot"}`}
          />
          {paused ? "PAUSED" : "STREAMING FABRICATIONS"}
        </span>
        <button
          onClick={() => setPaused((p) => !p)}
          className="ml-auto flex items-center gap-1 border border-phos-faint px-2 py-0.5 text-[10px] font-bold tracking-widest text-phos transition-colors hover:bg-phos hover:text-black"
        >
          {paused ? <Play size={10} /> : <Pause size={10} />}
          {paused ? "RESUME" : "PAUSE"}
        </button>
      </header>
      <div
        ref={scrollRef}
        className="term-scroll h-40 overflow-y-auto px-3 py-2 text-[11px] leading-[1.7] sm:text-xs"
      >
        {entries.map((e) => (
          <p key={e.id} className="animate-rise whitespace-nowrap">
            <span className="text-phos-faint">[{e.time}]</span>{" "}
            <span
              className={`inline-block min-w-12 border px-1 text-center text-[9px] font-bold tracking-wider ${
                e.level === "WARN"
                  ? "border-phos text-phos-pale glow-soft"
                  : "border-phos-ghost text-phos-dim"
              }`}
            >
              {e.level}
            </span>{" "}
            <span className="text-phos">{e.text}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
