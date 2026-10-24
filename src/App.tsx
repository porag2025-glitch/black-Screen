import { useCallback, useEffect, useRef, useState } from "react";
import {
  TerminalSquare,
  Power,
  Wifi,
  BatteryFull,
  ShieldCheck,
  Play,
  Radar,
  Satellite,
  Binary,
  Eraser,
  Volume2,
  VolumeX,
  Eye,
  Sparkles,
} from "lucide-react";
import MatrixRain from "./components/MatrixRain";
import Terminal, { PROMPT } from "./components/Terminal";
import SystemMonitor from "./components/SystemMonitor";
import HexDump from "./components/HexDump";
import LogFeed from "./components/LogFeed";
import {
  BANNER,
  BOOT_LINES,
  blockBar,
  fakeIP,
  rand,
  sleep,
  staticCommand,
  type Line,
  type LineKind,
} from "./lib/engine";

type RawLine = { kind: LineKind; text: string };
const L = (kind: LineKind, text: string): RawLine => ({ kind, text });

export default function App() {
  const [lines, setLines] = useState<Line[]>([]);
  const [booting, setBooting] = useState(true);
  const [powered, setPowered] = useState(true);
  const [matrixOn, setMatrixOn] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [session, setSession] = useState(0);
  const [clock, setClock] = useState(new Date());

  const idRef = useRef(0);
  const busyRef = useRef(false);
  const bootingRef = useRef(true);
  const soundRef = useRef(false);
  const skipRef = useRef<(() => void) | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  /* ---------- line plumbing ---------- */
  const pushLines = useCallback((raw: RawLine[]) => {
    if (!raw.length) return;
    setLines((prev) => [
      ...prev,
      ...raw.map((r) => ({ ...r, id: idRef.current++ })),
    ]);
  }, []);

  const pushOne = useCallback((raw: RawLine): number => {
    const id = idRef.current++;
    setLines((prev) => [...prev, { ...raw, id }]);
    return id;
  }, []);

  const updateLine = useCallback((id: number, text: string) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, text } : l)));
  }, []);

  const clearLines = useCallback(() => setLines([]), []);

  /* ---------- sound ---------- */
  const beep = useCallback((freq = 740) => {
    if (!soundRef.current) return;
    try {
      audioRef.current ??= new AudioContext();
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.value = 0.025;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      /* silence is also very hacker */
    }
  }, []);

  /* ---------- clock ---------- */
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ---------- boot sequence ---------- */
  useEffect(() => {
    if (!powered) return;
    let cancelled = false;
    let finished = false;
    bootingRef.current = true;
    setBooting(true);
    setLines([]);

    const finalize = () => {
      if (finished) return;
      finished = true;
      pushLines([
        L("ascii", BANNER),
        L("bright", "WELCOME TO BLACKSCREEN_ — THE HACKER SCREEN THAT ISN'T."),
        L("output", "this machine looks like it breaks into mainframes for breakfast."),
        L("output", "in reality it cannot open a pickle jar. it is a DISPLAY. only a display."),
        L("dim", "type 'help' below to see what this screen pretends to do. ↓"),
        L("output", ""),
      ]);
      bootingRef.current = false;
      setBooting(false);
    };

    skipRef.current = () => {
      cancelled = true;
      finalize();
    };

    (async () => {
      for (const step of BOOT_LINES) {
        if (cancelled) return;
        pushLines([L("dim", step.text)]);
        await sleep(step.delay);
      }
      if (!cancelled) finalize();
    })();

    return () => {
      cancelled = true;
    };
  }, [powered, session, pushLines]);

  /* ---------- async fake operations ---------- */
  const runScan = useCallback(async () => {
    busyRef.current = true;
    pushLines([
      L("bright", "> initializing totally fake scan..."),
      L("dim", `> target: ${fakeIP()} (a computer that does not exist)`),
    ]);
    const pid = pushOne(L("progress", ""));
    const labels = [
      "scanning ports (pretending)",
      "tracing route to nowhere",
      "decrypting the word 'decrypting'",
      "bypassing a firewall made of text",
      "asking the mainframe nicely",
      "looking serious while doing nothing",
    ];
    for (let p = 0; p <= 100; p += rand(6, 13)) {
      const pct = Math.min(100, p);
      updateLine(
        pid,
        `[${blockBar(pct, 24)}] ${String(pct).padStart(3, " ")}% — ${
          labels[Math.min(labels.length - 1, Math.floor(pct / 18))]
        }`
      );
      beep(500 + pct * 4);
      await sleep(rand(140, 300));
    }
    updateLine(pid, `[${blockBar(100, 24)}] 100% — scan "complete"`);
    pushLines([
      L("output", `> open ports found: ${rand(2, 9)} (all imaginary)`),
      L("output", "> vulnerabilities: yes, the vulnerability is that none of this is real"),
      L("success", "[ SIMULATION COMPLETE — 0 SYSTEMS HACKED. THIS IS A DISPLAY. ]"),
    ]);
    busyRef.current = false;
  }, [pushLines, pushOne, updateLine, beep]);

  const runDiagnostic = useCallback(async () => {
    busyRef.current = true;
    pushLines([L("bright", "> running theatrical diagnostic...")]);
    const checks = [
      "green pixels ......... all present and glowing",
      "black background ..... sufficiently black",
      "cursor blink ......... blinking with confidence",
      "fake data stream ..... flowing beautifully",
      "actual capability .... none detected (as designed)",
      "movie-hacker energy .. CRITICAL LEVELS",
    ];
    for (const c of checks) {
      pushLines([L("output", `  ${c} [ OK ]`)]);
      beep(880);
      await sleep(rand(180, 340));
    }
    pushLines([
      L("success", "[ DIAGNOSTIC COMPLETE — THE SCREEN IS PERFECTLY FAKE. ]"),
    ]);
    busyRef.current = false;
  }, [pushLines, beep]);

  const runPing = useCallback(async () => {
    busyRef.current = true;
    const ip = fakeIP();
    pushLines([
      L("bright", `> PING satellite-1.imaginary (${ip}): 56 data bytes`),
    ]);
    for (let i = 0; i < 4; i++) {
      await sleep(rand(220, 420));
      pushLines([
        L(
          "output",
          `  64 bytes from ${ip}: icmp_seq=${i} ttl=64 time=${rand(4, 180)}ms (fictional)`
        ),
      ]);
      beep(660);
    }
    pushLines([
      L("dim", "  --- 4 packets transmitted, 4 received, 0% loss, 100% fiction ---"),
    ]);
    busyRef.current = false;
  }, [pushLines, beep]);

  /* ---------- command processor ---------- */
  const execute = useCallback(
    (rawCmd: string) => {
      if (!powered || bootingRef.current) return;
      const cmd = rawCmd.trim();
      pushLines([L("input", `${PROMPT} ${cmd}`)]);
      beep(740);
      if (!cmd) return;

      const lower = cmd.toLowerCase();
      const base = lower.split(/\s+/)[0];

      if (base === "clear" || base === "cls") {
        clearLines();
        return;
      }

      if (base === "matrix") {
        const arg = lower.split(/\s+/)[1];
        setMatrixOn((prev) => {
          const next = arg === "on" ? true : arg === "off" ? false : !prev;
          pushLines([
            L(
              "success",
              `digital rain: ${next ? "ON — the vibes intensify" : "OFF — just you and the text now"}.`
            ),
          ]);
          return next;
        });
        return;
      }

      if (base === "scan" || base === "diagnostic" || base === "diag" || base === "ping") {
        if (busyRef.current) {
          pushLines([
            L("warn", ">> a fake operation is already in progress. patience, agent."),
          ]);
          return;
        }
        if (base === "scan") void runScan();
        else if (base === "ping") void runPing();
        else void runDiagnostic();
        return;
      }

      const result = staticCommand(cmd);
      if (result) {
        pushLines(result.lines);
      } else {
        pushLines([
          L("warn", `bash: ${base}: command not found`),
          L("dim", "this shell is fake, but 'help' works. try that one."),
        ]);
      }
    },
    [powered, pushLines, clearLines, beep, runScan, runPing, runDiagnostic]
  );

  /* ---------- power ---------- */
  const togglePower = () => {
    beep(320);
    if (powered) {
      setPowered(false);
      setBooting(false);
      bootingRef.current = false;
    } else {
      setSession((s) => s + 1);
      setPowered(true);
    }
  };

  const toggleSound = () => {
    soundRef.current = !soundRef.current;
    setSoundOn(soundRef.current);
    if (soundRef.current) setTimeout(() => beep(880), 30);
  };

  const clockStr = clock.toLocaleTimeString("en-GB", { hour12: false });
  const dateStr = clock
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

  const ticker =
    "+++ DISPLAY MODE ACTIVE +++ NO ACTUAL HACKING OCCURRING +++ 100% GREEN +++ 0% REAL +++ ALL MAINFRAMES ARE FINE +++ TRUST THE GLOW +++ THIS SCREEN CANNOT HACK +++ IT CAN ONLY VIBE +++ ";

  const deckBtn =
    "flex items-center gap-2 border border-phos-faint bg-panel px-3 py-2 text-[10px] font-bold tracking-[0.18em] text-phos transition-all hover:border-phos hover:bg-phos hover:text-black hover:shadow-[0_0_18px_rgba(0,255,65,0.45)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-panel disabled:hover:text-phos sm:text-[11px]";

  return (
    <div className="relative min-h-screen bg-black font-mono text-phos">
      {powered && matrixOn && <MatrixRain />}

      {/* CRT overlays */}
      <div className="scanlines pointer-events-none fixed inset-0 z-40 opacity-70" />
      <div className="pointer-events-none fixed inset-0 z-40 shadow-[inset_0_0_190px_rgba(0,0,0,0.9)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-28 animate-scanbar bg-phos/5 blur-md" />

      <div className="animate-flicker relative z-10">
        {/* ============ HEADER ============ */}
        <header className="border-b border-phos-faint bg-black/85 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-3 py-2.5 sm:px-4 lg:px-6">
            <div className="border border-phos bg-panel2 p-1.5 shadow-[0_0_14px_rgba(0,255,65,0.35)]">
              <TerminalSquare size={20} className="text-phos" />
            </div>
            <div className="leading-none">
              <h1 className="glow font-display text-[26px] leading-[0.9] tracking-wide text-phos sm:text-3xl">
                BLACKSCREEN<span className="animate-blink">_</span>
              </h1>
              <p className="mt-1 text-[8.5px] tracking-[0.32em] text-phos-faint sm:text-[9.5px]">
                HACKER-LOOKING DISPLAY UNIT — v2.0
              </p>
            </div>

            <span className="ml-2 hidden items-center gap-1.5 border border-phos bg-phos/10 px-2 py-1 text-[9px] font-bold tracking-[0.2em] text-phos-bright md:flex">
              <ShieldCheck size={11} /> DISPLAY ONLY
            </span>

            <div className="ml-auto flex items-center gap-3 sm:gap-5">
              <div className="hidden items-center gap-2 text-phos-dim lg:flex">
                <Wifi size={15} />
                <div className="leading-tight">
                  <p className="text-[10px] font-bold text-phos">NULL-LINK</p>
                  <p className="text-[8.5px] tracking-widest text-phos-faint">0 MB/S REAL</p>
                </div>
              </div>
              <BatteryFull size={17} className="hidden text-phos-dim sm:block" />
              <div className="text-right leading-none">
                <p className="glow-soft font-display text-[22px] leading-[0.85] text-phos-bright">
                  {clockStr}
                </p>
                <p className="mt-0.5 text-[8.5px] tracking-[0.25em] text-phos-faint">
                  {dateStr}
                </p>
              </div>
              <button
                onClick={togglePower}
                aria-label={powered ? "power off the screen" : "power on the screen"}
                className={`border p-2 transition-all ${
                  powered
                    ? "border-phos-faint text-phos-dim hover:border-phos hover:bg-phos hover:text-black"
                    : "animate-pulse border-phos bg-phos text-black shadow-[0_0_20px_rgba(0,255,65,0.7)]"
                }`}
              >
                <Power size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* ============ TICKER ============ */}
        <div className="overflow-hidden border-b border-phos-faint bg-panel2">
          <div className="animate-marquee flex w-max whitespace-nowrap py-1">
            <span className="font-display pr-2 text-[15px] tracking-[0.15em] text-phos-dim">
              {ticker}
            </span>
            <span className="font-display pr-2 text-[15px] tracking-[0.15em] text-phos-dim">
              {ticker}
            </span>
          </div>
        </div>

        {powered ? (
          <main className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4 lg:px-6">
            {/* intro */}
            <p className="mb-3 text-xs leading-relaxed text-phos-dim sm:text-[13px]">
              <span className="font-bold text-phos-bright">&gt;</span> welcome,
              visitor. this screen <span className="text-phos">looks</span> like
              a hacker terminal — black screen, green text, mysterious data —
              but it hacks absolutely nothing. type{" "}
              <button
                onClick={() => execute("help")}
                className="border border-phos-faint px-1 font-bold text-phos-bright transition-colors hover:bg-phos hover:text-black"
              >
                help
              </button>{" "}
              in the terminal, or press the shiny buttons below.
            </p>

            {/* control deck */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 hidden text-[9px] tracking-[0.3em] text-phos-faint sm:inline">
                CONTROL DECK //
              </span>
              <button className={deckBtn} disabled={booting} onClick={() => execute("scan")}>
                <Radar size={13} /> FAKE SCAN
              </button>
              <button className={deckBtn} disabled={booting} onClick={() => execute("diagnostic")}>
                <Play size={13} /> RUN DIAGNOSTIC
              </button>
              <button className={deckBtn} disabled={booting} onClick={() => execute("ping")}>
                <Satellite size={13} /> PING SATELLITE
              </button>
              <button className={deckBtn} disabled={booting} onClick={() => execute("matrix")}>
                <Binary size={13} /> TOGGLE RAIN
              </button>
              <button className={deckBtn} disabled={booting} onClick={() => execute("clear")}>
                <Eraser size={13} /> CLEAR SCREEN
              </button>
              <button className={deckBtn} onClick={toggleSound}>
                {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
                SOUND: {soundOn ? "ON" : "OFF"}
              </button>
            </div>

            {/* main grid */}
            <div className="grid items-stretch gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Terminal
                  key={session}
                  lines={lines}
                  booting={booting}
                  onSubmit={execute}
                  onSkipBoot={() => skipRef.current?.()}
                />
              </div>
              <div className="flex flex-col gap-4">
                <SystemMonitor />
                <HexDump />
              </div>
            </div>

            <div className="mt-4">
              <LogFeed />
            </div>

            {/* info cards */}
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Eye,
                  title: "IT'S JUST A SCREEN",
                  body: "Every 'hack' here is theatre: fake scans, imaginary packets, pretend mainframes. The only real thing on this page is the glow.",
                },
                {
                  icon: ShieldCheck,
                  title: "ZERO HACKING",
                  body: "No networks are touched. No systems are accessed. No data moves anywhere. This page couldn't hack a toaster — and wouldn't if it could.",
                },
                {
                  icon: Sparkles,
                  title: "PURE AESTHETIC",
                  body: "Black background. Green monospace text. Blinking cursors and dramatic progress bars. Maximum movie-hacker energy, zero consequences.",
                },
              ].map((card) => (
                <article
                  key={card.title}
                  className="dotgrid group border border-phos-faint bg-panel/90 p-4 transition-colors hover:border-phos"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="border border-phos-faint p-1.5 text-phos transition-colors group-hover:bg-phos group-hover:text-black">
                      <card.icon size={15} />
                    </span>
                    <h3 className="font-display text-xl tracking-wider text-phos-bright">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-phos-dim">{card.body}</p>
                </article>
              ))}
            </div>

            <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-phos-faint pt-4 pb-2 text-center text-[10px] tracking-[0.2em] text-phos-faint sm:flex-row sm:text-left">
              <p>© 2026 BLACKSCREEN_ — GREEN TEXT ON A BLACK SCREEN. NOTHING ELSE.</p>
              <p>
                NO HACKERS WERE INVOLVED IN THIS WEBSITE
                <span className="animate-blink ml-1 inline-block h-2.5 w-[7px] bg-phos align-middle" />
              </p>
            </footer>
          </main>
        ) : (
          /* ============ POWERED OFF ============ */
          <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
            <p className="animate-blink font-display text-3xl tracking-[0.3em] text-phos-ghost">
              [ NO SIGNAL ]
            </p>
            <p className="max-w-sm text-xs leading-relaxed text-phos-ghost">
              the screen is resting. all fake hacking operations have been
              suspended, which changes nothing, because they were fake.
            </p>
            <button
              onClick={togglePower}
              className="mt-2 flex items-center gap-2 border border-phos px-4 py-2 text-[11px] font-bold tracking-[0.25em] text-phos transition-all hover:bg-phos hover:text-black hover:shadow-[0_0_24px_rgba(0,255,65,0.6)]"
            >
              <Power size={13} /> POWER ON
            </button>
          </main>
        )}
      </div>
    </div>
  );
}
