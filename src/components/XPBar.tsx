export default function XPBar({ progress, total }: { progress: number; total: number }) {
  const percent = total === 0 ? 0 : Math.min(100, Math.floor((progress / total) * 100));
  const segmentCount = 20;
  const activeSegments = Math.round((percent / 100) * segmentCount);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-64 h-4 z-50">
      <div className="w-full h-full bg-white/10 rounded-full shadow-inner backdrop-blur-md flex items-center gap-[2px] px-[2px] overflow-hidden border border-white/10">
        {Array.from({ length: segmentCount }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-sm transition-all duration-300 ${
              i < activeSegments
                ? "bg-gradient-to-r from-[#2fb2ff] to-[#004aad] shadow-md"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Glow ring when full */}
      {percent === 100 && (
        <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
