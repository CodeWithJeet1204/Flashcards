import { useEffect, useState } from "react";

export default function XPPopup() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-4xl animate-pop">
      ⭐
    </div>
  );
}
