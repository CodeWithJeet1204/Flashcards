export default function SoundToggle() {
  const sound = localStorage.getItem("sound") !== "false";

  return (
    <div className="absolute top-4 left-20 z-50">
      <button
        onClick={() => {
          localStorage.setItem("sound", (!sound).toString());
          window.dispatchEvent(new Event("storage"));
        }}
        className="text-sm px-3 py-1 bg-white dark:bg-slate-800 text-black dark:text-white rounded-full border"
      >
        {sound ? "🔊 Sound: ON" : "🔇 Sound: OFF"}
      </button>
    </div>
  );
}
