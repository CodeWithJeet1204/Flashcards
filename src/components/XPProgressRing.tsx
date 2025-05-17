import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function XPProgressRing({ progress, total }: { progress: number; total: number }) {
  const percent = total === 0 ? 0 : (progress / total) * 100;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 z-50">
      <CircularProgressbar
        value={percent}
        strokeWidth={10}
        styles={buildStyles({
          pathColor: "#2fb2ff",
          trailColor: "#e5e7eb",
          textColor: "#2fb2ff",
        })}
      />
    </div>
  );
}
