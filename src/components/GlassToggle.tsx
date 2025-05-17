export default function GlassToggle() {
  const glass = localStorage.getItem("glass") === "true";

  return (
    <div className="absolute top-4 left-4 z-50">
      <button
        onClick={() => {
          localStorage.setItem("glass", (!glass).toString());
          window.dispatchEvent(new Event("storage"));
        }}
        className="text-sm px-3 py-1 bg-white dark:bg-slate-800 text-black dark:text-white rounded-full border"
      >
        {glass ? "🧊 Blur: ON" : "🧊 Blur: OFF"}
      </button>
    </div>
  );
}
