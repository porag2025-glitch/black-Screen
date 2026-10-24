import { useEffect, useRef, useState } from "react";
import { Binary } from "lucide-react";
import { HEX_WORDS, pick, rand } from "../lib/engine";

interface Row {
  addr: number;
  bytes: number[];
}

function makeRow(addr: number): Row {
  const bytes = Array.from({ length: 16 }, () => rand(0, 255));
  if (Math.random() < 0.24) {
    const word = pick(HEX_WORDS);
    const offset = rand(0, 16 - word.length);
    for (let i = 0; i < word.length; i++) {
      bytes[offset + i] = word.charCodeAt(i);
    }
  }
  return { addr, bytes };
}

const hex2 = (n: number) => n.toString(16).toUpperCase().padStart(2, "0");
const toAscii = (b: number) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : "·");

export default function HexDump() {
  const [rows, setRows] = useState<Row[]>(() => {
    const start = 0x3f2a00;
    return Array.from({ length: 13 }, (_, i) => makeRow(start + i * 16));
  });
  const nextRef = useRef(0x3f2a00 + 13 * 16);

  useEffect(() => {
    const t = setInterval(() => {
      setRows((prev) => {
        const next = [...prev.slice(1), makeRow(nextRef.current)];
        nextRef.current += 16;
        return next;
      });
    }, 800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="border border-phos-faint bg-panel/90 backdrop-blur-[2px]">
      <header className="flex items-center gap-2 border-b border-phos-faint bg-panel2 px-3 py-2">
        <Binary size={13} className="text-phos" />
        <h2 className="text-[11px] font-bold tracking-[0.2em] text-phos-bright">
          MEMORY DUMP
        </h2>
        <span className="ml-auto text-[9px] tracking-widest text-phos-faint">
          READING: NOTHING
        </span>
      </header>
      <div className="overflow-x-auto px-3 py-2.5">
        <div className="min-w-[430px] font-mono text-[10.5px] leading-[1.7]">
          {rows.map((row) => (
            <div key={row.addr} className="flex gap-3 whitespace-nowrap">
              <span className="text-phos-faint">
                0x{row.addr.toString(16).toUpperCase().padStart(8, "0")}
              </span>
              <span className="text-phos-dim">
                {row.bytes.slice(0, 8).map(hex2).join(" ")}
                {"  "}
                {row.bytes.slice(8).map(hex2).join(" ")}
              </span>
              <span className="text-phos-bright glow-soft">
                {row.bytes.map(toAscii).join("")}
              </span>
            </div>
          ))}
        </div>
      </div>
      <footer className="border-t border-phos-ghost px-3 py-1.5 text-[9px] tracking-widest text-phos-faint">
        SOURCE: /dev/imagination — SOME ROWS SPELL SECRETS. NONE ARE REAL.
      </footer>
    </section>
  );
}
