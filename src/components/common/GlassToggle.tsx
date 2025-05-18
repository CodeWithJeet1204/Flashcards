export default function GlassToggle() {
  // Read current blur preference from localStorage
  const glass = localStorage.getItem("glass") === "true";

  // Toggle blur setting and trigger global UI update
  const toggleGlass = () => {
    const newValue = (!glass).toString();
    localStorage.setItem("glass", newValue);

    // Trigger updates across tabs and components
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("settings-updated"));
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleGlass}
        className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-md transition-all
          ${
            glass
              ? "bg-blue-500/20 text-blue-300 ring-2 ring-blue-400 hover:ring-4"
              : "bg-white/10 text-white hover:bg-white/20"
          }
        `}
      >
        Blur: {glass ? "ON" : "OFF"}
      </button>
    </div>
  );
}
