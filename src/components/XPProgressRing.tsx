export default function XPProgressBar({ progress, total }: { progress: number; total: number }) {
  const segments = Array.from({ length: total }, (_, i) => i < progress);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-xl h-4 flex gap-[2px] px-2 bg-white/5 border border-white/10 rounded-full shadow-inner backdrop-blur-lg">
      {segments.map((filled, idx) => (
        <div
          key={idx}
          className={`flex-1 h-2 rounded-sm transition-all duration-300 ${
            filled
              ? "bg-gradient-to-tr from-[#2fb2ff] to-[#004aad] shadow-md animate-[pulse_8s_ease-in-out_infinite]"
              : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}
