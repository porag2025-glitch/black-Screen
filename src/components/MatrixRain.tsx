import { useEffect, useRef } from "react";

const CHARS = "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF<>/\\=+*#";

export default function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];
    const fontSize = 15;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.floor(Math.random() * (height / fontSize))
      );
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < columns; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // bright head, dim tail handled by fade overlay
        ctx.fillStyle = Math.random() > 0.975 ? "#c8ffd4" : "#00cc33";
        ctx.fillText(ch, x, y);

        if (y > height && Math.random() > 0.976) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 55);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 opacity-30"
      aria-hidden="true"
    />
  );
}
