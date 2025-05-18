import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function XPPopup() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 0 }}
          animate={{ scale: 1.3, opacity: 1, y: -100 }}
          exit={{ opacity: 0, y: -150, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-6xl pointer-events-none"
        >
          <div className="relative flex items-center justify-center">
            <span className="z-10">⭐</span>
            <div className="absolute w-20 h-20 rounded-full bg-yellow-300/20 blur-2xl animate-ping scale-100" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
