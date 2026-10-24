import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Cpu,
  MemoryStick,
  CircuitBoard,
  Network,
  ShieldCheck,
} from "lucide-react";
import { PROCESSES, rand } from "../lib/engine";

function SegBar({ value }: { value: number }) {
  const segments = 24;
  const lit = Math.round((value / 100) * segments);
  return (
    <div className="flex flex-1 items-end gap-[2px]">
      {Array.from({ length: segments }).map((_, i) => (
        <span
          key={i}
          className={`h-3.5 flex-1 transition-colors duration-500 ${
            i < lit ? "bg-phos shadow-[0_0_5px_rgba(0,255,65,0.6)]" : "bg-phos-ghost"
          }`}
        />
      ))}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: typeof Cpu;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] tracking-widest">
        <span className="flex items-center gap-1.5 text-phos-dim">
          <Icon size={11} /> {label}
        </span>
        <span className="font-bold text-phos-bright glow-soft">
          {value}
          {unit}
        </span>
      </div>
      <SegBar value={value} />
    </div>
  );
}

const walk = (v: number, amt: number, min = 4, max = 97) =>
  Math.max(min, Math.min(max, v + rand(-amt, amt)));

export default function SystemMonitor() {
  const [cpu, setCpu] = useState(47);
  const [mem, setMem] = useState(62);
  const [gpu, setGpu] = useState(38);
  const [uptime, setUptime] = useState(0);
  const [history, setHistory] = useState<number[]>(() =>
    Array.from({ length: 42 }, () => rand(15, 85))
  );
  const [procCpu, setProcCpu] = useState<number[]>(() =>
    PROCESSES.map(() => rand(1, 40))
  );
  const startRef = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      setCpu((v) => walk(v, 9));
      setMem((v) => walk(v, 4, 30, 88));
      setGpu((v) => walk(v, 12));
      setHistory((h) => [...h.slice(1), rand(10, 95)]);
      setProcCpu((prev) => prev.map((v) => walk(v, 8, 0, 88)));
      setUptime(Math.floor((Date.now() - startRef.current) / 1000));
    }, 900);
    return () => clearInterval(t);
  }, []);

  const points = useMemo(() => {
    const max = 100;
    return history
      .map((v, i) => `${(i / (history.length - 1)) * 200},${46 - (v / max) * 42}`)
      .join(" ");
  }, [history]);

  const net = history[history.length - 1];
  const up = `${String(Math.floor(uptime / 3600)).padStart(2, "0")}:${String(
    Math.floor((uptime % 3600) / 60)
  ).padStart(2, "0")}:${String(uptime % 60).padStart(2, "0")}`;

  return (
    <section className="border border-phos-faint bg-panel/90 backdrop-blur-[2px]">
      <header className="flex items-center gap-2 border-b border-phos-faint bg-panel2 px-3 py-2">
        <Activity size={13} className="text-phos" />
        <h2 className="text-[11px] font-bold tracking-[0.2em] text-phos-bright">
          SYSTEM MONITOR
        </h2>
        <span className="ml-auto text-[9px] tracking-widest text-phos-faint">
          (ALL PRETEND)
        </span>
      </header>

      <div className="space-y-3.5 px-3 py-3">
        <Metric icon={Cpu} label="CPU // IMAGINARY-9000" value={cpu} unit="%" />
        <Metric icon={MemoryStick} label="RAM // PURE CONFIDENCE" value={mem} unit="%" />
        <Metric icon={CircuitBoard} label="GPU // GREEN PIXELS" value={gpu} unit="%" />

        {/* network sparkline */}
        <div>
          <div className="mb-1 flex items-center justify-between text-[10px] tracking-widest">
            <span className="flex items-center gap-1.5 text-phos-dim">
              <Network size={11} /> NETWORK // FICTIONAL TRAFFIC
            </span>
            <span className="font-bold text-phos-bright glow-soft">
              {(net * 12.4).toFixed(0)} KB/S
            </span>
          </div>
          <svg
            viewBox="0 0 200 48"
            className="h-12 w-full border border-phos-ghost bg-black/60"
            preserveAspectRatio="none"
          >
            {[12, 24, 36].map((y) => (
              <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#003d10" strokeWidth="1" />
            ))}
            <polyline
              points={points}
              fill="none"
              stroke="#00ff41"
              strokeWidth="1.6"
              style={{ filter: "drop-shadow(0 0 4px rgba(0,255,65,0.7))" }}
            />
          </svg>
        </div>

        {/* processes */}
        <div>
          <p className="mb-1.5 text-[10px] tracking-widest text-phos-dim">
            TOP PROCESSES (OF THE IMAGINATION)
          </p>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-phos-faint">
              <span>PID&nbsp;&nbsp;NAME</span>
              <span>CPU&nbsp;&nbsp;&nbsp;MEM</span>
            </div>
            {PROCESSES.map((p, i) => (
              <div key={p.pid} className="flex items-baseline justify-between">
                <span className="truncate">
                  <span className="text-phos-faint">{p.pid}</span>{" "}
                  <span className="text-phos">{p.name}</span>
                </span>
                <span className="shrink-0 text-phos-dim">
                  {String(procCpu[i] ?? 0).padStart(2, "0")}%{" "}
                  <span className="text-phos-faint">{p.mem.toFixed(1)}M</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-phos-ghost pt-2.5 text-[10px] tracking-widest">
          <span className="text-phos-faint">
            UPTIME <span className="text-phos">{up}</span>
          </span>
          <span className="flex items-center gap-1 font-bold text-phos-bright">
            <ShieldCheck size={11} /> THREATS: NONE POSSIBLE
          </span>
        </div>
      </div>
    </section>
  );
}
