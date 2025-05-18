import { useEffect, useRef } from "react";

export default function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;

      if (ref.current) {
        ref.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Main animated background */}
      <div
        ref={ref}
        className="absolute inset-0 transition-transform duration-300 animate-[pulse_20s_ease-in-out_infinite]
          blur-2xl opacity-40
          bg-gradient-radial from-[#d0f0ff]/40 via-[#e6f7ff]/35 to-[#ffffff]/60
          dark:from-[#0f0f2f]/40 dark:via-[#1f1f3f]/20 dark:to-[#0a0a23]/50"

      />

      {/* Glow layer */}
      <div
        className="absolute inset-0
          bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
          from-[#7b2ff7]/10 via-transparent to-transparent
          dark:from-[#ffffff]/5"
      />

      {/* Vertical streak */}
      <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/5 blur-md opacity-30" />
    </div>
  );
}
