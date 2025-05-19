export default function XPBar({ progress, total }: { progress: number; total: number }) {
  const percent = total === 0 ? 0 : Math.min(100, Math.floor((progress / total) * 100));
  const segmentCount = 20;
  const activeSegments = Math.round((percent / 100) * segmentCount);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[80vw] max-w-xl h-4 z-50">
      {/* XP bar container with theme-aware border */}
      <div className="w-full h-full rounded-full shadow-inner backdrop-blur-md flex items-center gap-[2px] px-[2px] overflow-hidden
        border border-sky-200 dark:border-white/10
        bg-[radial-gradient(ellipse_at_center,_#bae6fd,_#ffffff)]/30
        dark:bg-[radial-gradient(ellipse_at_center,_#2a2a70,_#0a0a23)]/10"
      >
        {Array.from({ length: segmentCount }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-sm transition-all duration-300 ${
              i < activeSegments
                ? "bg-gradient-to-r from-sky-400 to-sky-600 dark:from-[#2fb2ff] dark:to-[#004aad] shadow"
                : "bg-sky-100/50 dark:bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)]/10"
            }`}
          />
        ))}
      </div>

      {/* XP pulse ring when full */}
      {percent === 100 && (
        <div className="absolute inset-0 rounded-full border-2 border-sky-400/60 dark:border-blue-400/50 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
