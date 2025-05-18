import { useEffect, useRef } from "react";

export default function ParallaxBackground() {
  // Ref to the animated main layer for mouse-based parallax
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update transform on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;

      if (ref.current) {
        ref.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
      }
    };

    // Attach event listener on mount
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup on unmount
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Main animated parallax background layer */}
      <div
        ref={ref}
        className="absolute inset-0 bg-gradient-radial from-[#004aad]/30 via-[#2fb2ff]/15 to-[#002f6e]/40 blur-2xl opacity-40 transition-transform duration-300 animate-[pulse_20s_ease-in-out_infinite]"
      />

      {/* Layered ambient center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7b2ff7]/10 via-transparent to-transparent" />

      {/* Subtle vertical streak for depth */}
      <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/5 blur-md opacity-30" />
    </div>
  );
}
