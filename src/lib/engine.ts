export type LineKind =
  | "input"
  | "output"
  | "dim"
  | "bright"
  | "success"
  | "warn"
  | "ascii"
  | "progress";

export interface Line {
  id: number;
  kind: LineKind;
  text: string;
}

/* ---------------- helpers ---------------- */

export const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const fakeIP = () =>
  `${rand(11, 254)}.${rand(0, 254)}.${rand(0, 254)}.${rand(2, 254)}`;

export const fakeHex = (len = 8) => {
  const chars = "0123456789ABCDEF";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * 16)];
  return s;
};

export const now = () =>
  new Date().toLocaleTimeString("en-GB", { hour12: false });

export const blockBar = (pct: number, width = 26) => {
  const filled = Math.round((pct / 100) * width);
  return "█".repeat(filled) + "░".repeat(Math.max(0, width - filled));
};

export const sleep = (ms: number) =>
  new Promise<void>((r) => setTimeout(r, ms));

/* ---------------- branding ---------------- */

export const BANNER = String.raw`
██████╗ ██╗      █████╗  ██████╗██╗  ██╗
██╔══██╗██║     ██╔══██╗██╔════╝██║ ██╔╝
██████╔╝██║     ███████║██║     █████╔╝
██╔══██╗██║     ██╔══██║██║     ██╔═██╗
██████╔╝███████╗██║  ██║╚██████╗██║  ██╗
╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
███████╗ ██████╗██████╗ ███████╗███████╗███╗   ██╗
██╔════╝██╔════╝██╔══██╗██╔════╝██╔════╝████╗  ██║
███████╗██║     ██████╔╝█████╗  █████╗  ██╔██╗ ██║
╚════██║██║     ██╔══██╗██╔══╝  ██╔══╝  ██║╚██╗██║
███████║╚██████╗██║  ██║███████╗███████╗██║ ╚████║
╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝`;

export const BOOT_LINES: { text: string; delay: number }[] = [
  { text: "BLACKSCREEN BIOS v6.66 — checking nothing important...", delay: 260 },
  { text: "CPU ......... IMAGINARY-9000 @ 9.99 GHz ............ [ OK ]", delay: 140 },
  { text: "MEMORY ...... 640K (ought to be enough for anyone) . [ OK ]", delay: 140 },
  { text: "GPU ......... GREEN PIXEL RENDERER 3000 ............ [ OK ]", delay: 180 },
  { text: "loading module: pure_aesthetic.ko .................. [ OK ]", delay: 160 },
  { text: "loading module: hacker_vibes.dll ................... [ OK ]", delay: 160 },
  { text: "loading module: actual_hacking.ko .................. [NOT FOUND — GOOD]", delay: 320 },
  { text: "mounting /dev/null as primary storage .............. [ OK ]", delay: 150 },
  { text: "connecting to the mainframe (there is no mainframe)  [ OK ]", delay: 240 },
  { text: "decrypting the concept of decryption ............... [ OK ]", delay: 200 },
  { text: "calibrating green phosphor to maximum movie levels . [ OK ]", delay: 180 },
  { text: "disabling all real capabilities .................... [ OK ]", delay: 220 },
  { text: "", delay: 120 },
  { text: "ALL SYSTEMS NOMINAL. NONE OF THEM ARE REAL.", delay: 300 },
];

/* ---------------- static command output ---------------- */

export interface CmdResult {
  lines: { kind: LineKind; text: string }[];
}

const L = (kind: LineKind, text: string) => ({ kind, text });

export function staticCommand(raw: string): CmdResult | null {
  const cmd = raw.trim();
  const lower = cmd.toLowerCase();
  const [base, ...rest] = lower.split(/\s+/);
  const argStr = cmd.slice(base.length).trim();

  switch (base) {
    case "help":
      return {
        lines: [
          L("bright", "AVAILABLE COMMANDS (all 100% harmless):"),
          L("output", "  help .......... show this list"),
          L("output", "  about ......... what is this screen?"),
          L("output", "  scan .......... run a totally fake network scan"),
          L("output", "  diagnostic .... pretend to check the system"),
          L("output", "  ping .......... ping a satellite that doesn't exist"),
          L("output", "  hack .......... go ahead. try it."),
          L("output", "  status ........ system status report"),
          L("output", "  ls ............ list imaginary files"),
          L("output", "  whoami ........ deep philosophical inquiry"),
          L("output", "  date .......... the actual real date & time"),
          L("output", "  echo <txt> .... the screen repeats you"),
          L("output", "  matrix ........ toggle the digital rain"),
          L("output", "  banner ........ print the logo again"),
          L("output", "  clear ......... wipe the screen clean"),
          L("dim", "  tip: use ↑ / ↓ arrow keys for command history"),
        ],
      };

    case "about":
      return {
        lines: [
          L("bright", "WHAT IS BLACKSCREEN_ ?"),
          L("output", "A black screen. Green text. Hacker-movie energy."),
          L("output", "It looks exactly like a hacking terminal — and that"),
          L("output", "is the entire trick. Nothing here connects to anything."),
          L("output", "No networks are scanned. No systems are accessed."),
          L("output", "No passwords were harmed in the making of this page."),
          L("success", "IT IS A DISPLAY. ONLY A DISPLAY. A PRETTY ONE."),
        ],
      };

    case "whoami":
      return {
        lines: [
          L("output", "user: visitor_1337"),
          L("output", "role: curious human staring at green text"),
          L("output", "clearance level: DISPLAY ONLY"),
          L("dim", "you are the main character of this screen. congrats."),
        ],
      };

    case "date":
      return {
        lines: [
          L("output", new Date().toString()),
          L("dim", "(yes, this one is real. cherish it.)"),
        ],
      };

    case "echo":
      return {
        lines: [
          L("bright", argStr ? argStr : "(silence... you said nothing)"),
        ],
      };

    case "ls":
    case "dir":
      return {
        lines: [
          L("dim", "drwxr-xr-x  totally_real_files/"),
          L("output", "  mainframe_passwords.txt ... (0 bytes, obviously)"),
          L("output", "  do_not_open/ ................ (also empty)"),
          L("output", "  hacker_hoodie.png ........... (essential gear)"),
          L("output", "  green_text_final_FINAL2.txt . (the whole website)"),
          L("output", "  secrets.db .................. (contains only vibes)"),
        ],
      };

    case "status":
      return {
        lines: [
          L("bright", "SYSTEM STATUS REPORT"),
          L("output", `  uptime ......... still vibing`),
          L("output", `  cpu ............ ${blockBar(rand(28, 74), 16)} ${rand(28, 74)}% pretend load`),
          L("output", `  memory ......... ${blockBar(rand(35, 68), 16)} full of green`),
          L("output", "  network ........ connected to the concept of internet"),
          L("output", "  threats ........ 0 detected / 0 possible / 0 real"),
          L("success", "  verdict ........ PERFECTLY FAKE, RUNNING FLAWLESSLY"),
        ],
      };

    case "hack":
    case "sudo":
      return {
        lines: [
          L("warn", "nice try."),
          L("output", "this screen cannot hack anything. it can barely"),
          L("output", "do arithmetic. it is, and always will be, a display."),
          L("success", "ACCESS GRANTED... to more green text. that's all you get."),
        ],
      };

    case "exit":
    case "quit":
    case "logout":
      return {
        lines: [
          L("warn", "ERROR: there is no escape."),
          L("output", "the green screen is eternal. the green screen is home."),
          L("dim", "(you can close the tab. but the tab will remember.)"),
        ],
      };

    case "banner":
      return { lines: [L("ascii", BANNER)] };

    case "cd":
      return {
        lines: [
          L("output", `moved to /${rest[0] ?? "nowhere"}. it looks exactly the same here.`),
        ],
      };

    case "cat":
      return {
        lines: [
          L("output", "the file contains one line:"),
          L("bright", "\"this is not a real file.\""),
        ],
      };

    case "rm":
      return {
        lines: [
          L("warn", "refusing to delete: everything here is imaginary,"),
          L("output", "and imaginary files are load-bearing."),
        ],
      };

    case "":
      return { lines: [] };

    default:
      return null;
  }
}

/* ---------------- fake log feed ---------------- */

const LOG_TEMPLATES: (() => { level: string; text: string })[] = [
  () => ({ level: "NET", text: `packet #${fakeHex(6)} routed to /dev/null (fake)` }),
  () => ({ level: "SYS", text: "green pixel renderer locked at 60fps" }),
  () => ({ level: "AUTH", text: "visitor_1337 granted read-only eyeballs" }),
  () => ({ level: "KERN", text: "module pure_aesthetic.ko heartbeat ok" }),
  () => ({ level: "SCAN", text: `port ${pick([22, 80, 443, 8080, 31337])} status: imaginary` }),
  () => ({ level: "DB", text: "queried 0 records from table 'secrets' (does not exist)" }),
  () => ({ level: "NET", text: `handshake with ${fakeIP()} — it waved back (not really)` }),
  () => ({ level: "SEC", text: "firewall blocked 0 threats. there were 0 threats." }),
  () => ({ level: "CPU", text: `core ${rand(0, 7)} daydreaming at ${rand(80, 99)}% efficiency` }),
  () => ({ level: "DISP", text: `drew ${rand(900, 4000)} glowing characters this second` }),
  () => ({ level: "MEM", text: `allocated ${rand(4, 512)}MB of pure confidence` }),
  () => ({ level: "WARN", text: "someone typed 'hack' again. it did nothing. again." }),
  () => ({ level: "GPS", text: `satellite uplink: ${rand(40, 99)}% fictional signal` }),
  () => ({ level: "IO", text: `wrote ${rand(1, 64)}KB of nothing to disk, very fast` }),
];

export const randomLog = () => pick(LOG_TEMPLATES)();

/* ---------------- fake processes ---------------- */

export interface FakeProcess {
  name: string;
  pid: number;
  mem: number;
}

export const PROCESSES: FakeProcess[] = [
  { name: "blackscreen_core", pid: 1337, mem: 42.0 },
  { name: "green_text_renderer", pid: 2049, mem: 128.4 },
  { name: "matrix_rain.dll", pid: 4096, mem: 96.2 },
  { name: "fake_hack_simulator", pid: 7777, mem: 66.6 },
  { name: "vibes_daemon", pid: 8008, mem: 13.37 },
  { name: "nothing_service", pid: 9001, mem: 0.4 },
  { name: "mainframe_pretender", pid: 5150, mem: 88.8 },
];

/* ---------------- hidden words for hex dump ---------------- */

export const HEX_WORDS = [
  "NOTREAL",
  "DISPLAY",
  "GREEN!",
  "HELLO:)",
  "FAKE!!",
  "JUSTVIBES",
  "NOSIGNAL",
  "WOW",
];
